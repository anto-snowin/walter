"""Walter AI — Voice Stream Handler for Twilio Bidirectional Media Streams."""

from __future__ import annotations

import json
import base64
import logging
import asyncio
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from fastapi import WebSocket

from app.config import settings
from app.db.repository import db
from app.agent.walter_agent import WalterAgent

logger = logging.getLogger("walter.voice")


class VoiceStreamHandler:
    """Handles bidirectional voice streaming between Twilio and AI provider.

    Twilio Media Streams format:
    - Inbound audio: base64-encoded μ-law at 8kHz, mono
    - Outbound audio: base64-encoded μ-law at 8kHz, mono
    """

    def __init__(self, user_id: str = "dev-user-00000000-0000-0000-0000-000000000000"):
        self.user_id = user_id
        self.stream_sid: Optional[str] = None
        self.call_sid: Optional[str] = None
        self.caller_number: Optional[str] = "Unknown Caller"
        self.started_at: Optional[datetime] = None
        self.websocket: Optional[WebSocket] = None
        self._ai_ws = None
        self._active = False
        self._finalized = False
        self.conversation_messages: List[Dict[str, str]] = []
        self.agent = WalterAgent()

    async def handle_stream(self, websocket: WebSocket):
        """Main handler for the Twilio WebSocket media stream."""
        self.websocket = websocket
        self._active = True
        self.started_at = datetime.now(timezone.utc)
        logger.info("Voice stream connection established")

        # Load owner profile and answering rules into agent
        profile = await db.get_profile(self.user_id)
        rules = await db.get_answering_rules(self.user_id)
        await self.agent.initialize(profile, rules)

        async for raw_message in websocket.iter_text():
            try:
                message = json.loads(raw_message)
                event_type = message.get("event")

                if event_type == "connected":
                    logger.info("Twilio stream connected event received")

                elif event_type == "start":
                    start_data = message.get("start", {})
                    self.stream_sid = start_data.get("streamSid")
                    self.call_sid = start_data.get("callSid")
                    custom_params = start_data.get("customParameters", {})
                    self.caller_number = custom_params.get("caller") or self.caller_number
                    if custom_params.get("call_sid"):
                        self.call_sid = custom_params.get("call_sid")

                    logger.info(f"Stream started: {self.stream_sid} for caller: {self.caller_number}")

                    # Initialize AI voice session if OpenAI configured
                    if settings.has_openai:
                        await self._connect_ai_provider()
                    else:
                        logger.info("OpenAI not configured; running in audio standby mode")

                elif event_type == "media":
                    # Forward audio to AI provider
                    audio_payload = message.get("media", {}).get("payload", "")
                    if audio_payload and self._ai_ws:
                        await self._forward_to_ai(audio_payload)

                elif event_type == "stop":
                    logger.info(f"Twilio stream stop event received: {self.stream_sid}")
                    await self.finalize_call()
                    break

            except json.JSONDecodeError:
                logger.warning("Invalid JSON received in voice stream")
            except Exception as e:
                logger.error(f"Voice stream processing error: {e}")

    async def _connect_ai_provider(self):
        """Connect to the OpenAI Realtime API via WebSocket."""
        try:
            import websockets

            model = settings.ai_voice_model
            url = f"wss://api.openai.com/v1/realtime?model={model}"
            headers = {
                "Authorization": f"Bearer {settings.openai_api_key}",
                "OpenAI-Beta": "realtime=v1",
            }

            self._ai_ws = await websockets.connect(url, additional_headers=headers)
            logger.info("Connected to OpenAI Realtime API")

            # Configure session with Walter instructions and g711_ulaw format
            session_config = {
                "type": "session.update",
                "session": {
                    "modalities": ["text", "audio"],
                    "instructions": self.agent._system_message,
                    "voice": "alloy",
                    "input_audio_format": "g711_ulaw",
                    "output_audio_format": "g711_ulaw",
                    "input_audio_transcription": {
                        "model": "whisper-1"
                    },
                    "turn_detection": {
                        "type": "server_vad",
                        "threshold": 0.5,
                        "prefix_padding_ms": 300,
                        "silence_duration_ms": 500,
                    },
                },
            }

            await self._ai_ws.send(json.dumps(session_config))

            # Send initial greeting
            greeting_event = {
                "type": "conversation.item.create",
                "item": {
                    "type": "message",
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": f"Greet the caller with: '{self.agent.get_greeting()}'"
                        }
                    ],
                },
            }
            await self._ai_ws.send(json.dumps(greeting_event))
            await self._ai_ws.send(json.dumps({"type": "response.create"}))

            # Start receiving AI responses in background
            asyncio.create_task(self._receive_ai_responses())

        except Exception as e:
            logger.error(f"Failed to connect to AI provider: {e}")
            self._ai_ws = None

    async def _forward_to_ai(self, audio_payload: str):
        """Forward base64-encoded audio from Twilio to AI provider."""
        if not self._ai_ws:
            return

        try:
            message = {
                "type": "input_audio_buffer.append",
                "audio": audio_payload,
            }
            await self._ai_ws.send(json.dumps(message))
        except Exception as e:
            logger.error(f"Error forwarding audio to AI: {e}")

    async def _receive_ai_responses(self):
        """Receive and process responses from the AI provider."""
        if not self._ai_ws:
            return

        try:
            async for raw in self._ai_ws:
                data = json.loads(raw)
                event_type = data.get("type", "")

                # 1. Interruption: Caller started speaking, clear Twilio playback queue
                if event_type == "input_audio_buffer.speech_started":
                    if self.websocket and self.stream_sid:
                        clear_message = {
                            "event": "clear",
                            "streamSid": self.stream_sid,
                        }
                        await self.websocket.send_text(json.dumps(clear_message))

                # 2. Inbound Caller Transcript
                elif event_type == "conversation.item.input_audio_transcription.completed":
                    transcript = data.get("transcript", "").strip()
                    if transcript:
                        self.conversation_messages.append({"role": "caller", "content": transcript})
                        logger.info(f"Caller transcript: {transcript}")

                # 3. Audio Delta: Stream to Twilio
                elif event_type == "response.audio.delta":
                    audio_delta = data.get("delta", "")
                    if audio_delta:
                        await self._send_audio_to_twilio(audio_delta)

                # 4. Assistant Transcript
                elif event_type == "response.audio_transcript.done":
                    transcript = data.get("transcript", "").strip()
                    if transcript:
                        self.conversation_messages.append({"role": "walter", "content": transcript})
                        logger.info(f"Walter transcript: {transcript}")

                elif event_type == "error":
                    logger.error(f"AI provider error: {data.get('error', {})}")

        except Exception as e:
            if self._active:
                logger.error(f"AI response stream error: {e}")

    async def _send_audio_to_twilio(self, audio_payload: str):
        """Send base64-encoded μ-law audio back to Twilio via the media stream."""
        if not self.websocket or not self.stream_sid:
            return
        try:
            message = {
                "event": "media",
                "streamSid": self.stream_sid,
                "media": {
                    "payload": audio_payload,
                },
            }
            await self.websocket.send_text(json.dumps(message))
        except Exception as e:
            logger.error(f"Error sending audio to Twilio: {e}")

    async def finalize_call(self):
        """Finalize the call session, generate summary, and persist to database."""
        if self._finalized:
            return
        self._finalized = True

        ended_at = datetime.now(timezone.utc)
        duration = 0
        if self.started_at:
            duration = max(1, int((ended_at - self.started_at).total_seconds()))

        # Generate summary
        messages_to_summarize = self.conversation_messages
        if not messages_to_summarize:
            messages_to_summarize = [
                {"role": "walter", "content": self.agent.get_greeting()},
                {"role": "caller", "content": "Inbound telephone audio call connected via Twilio PSTN."},
            ]

        summary_data = await self.agent.generate_summary(messages_to_summarize)

        # Save call session to DB
        call_id = await db.save_call_session(
            user_id=self.user_id,
            caller_number=self.caller_number,
            started_at=self.started_at.isoformat() if self.started_at else ended_at.isoformat(),
            ended_at=ended_at.isoformat(),
            duration_seconds=duration,
            status="completed",
            source="twilio",
            provider_call_id=self.call_sid,
        )

        if call_id:
            await db.save_call_summary(
                call_id=call_id,
                user_id=self.user_id,
                summary=summary_data.get("summary", "Telephone call completed."),
                category=summary_data.get("category", "general"),
                urgency=summary_data.get("urgency", "low"),
                key_details=summary_data.get("key_details", {}),
                follow_up_actions=summary_data.get("follow_up_actions", []),
                escalation_required=summary_data.get("escalation_required", False),
            )
            logger.info(f"PSTN Call saved successfully. Call ID: {call_id}, Duration: {duration}s")

    async def cleanup(self):
        """Clean up resources when the stream ends."""
        self._active = False
        await self.finalize_call()
        if self._ai_ws:
            try:
                await self._ai_ws.close()
            except Exception:
                pass
            self._ai_ws = None
        logger.info("Voice stream handler cleaned up")
