"""Walter AI — Voice Stream Handler for Twilio Bidirectional Media Streams."""

from __future__ import annotations

import json
import base64
import logging
import asyncio
from typing import Optional, Dict, Any

from fastapi import WebSocket

from app.config import settings

logger = logging.getLogger("walter.voice")


class VoiceStreamHandler:
    """Handles bidirectional voice streaming between Twilio and AI provider.
    
    Twilio Media Streams format:
    - Inbound audio: base64-encoded μ-law at 8kHz, mono
    - Outbound audio: must be in the same format
    """

    def __init__(self):
        self.stream_sid: Optional[str] = None
        self.call_sid: Optional[str] = None
        self._ai_ws = None
        self._active = False

    async def handle_stream(self, websocket: WebSocket):
        """Main handler for the Twilio WebSocket media stream."""
        self._active = True
        logger.info("Voice stream connection established")

        async for raw_message in websocket.iter_text():
            try:
                message = json.loads(raw_message)
                event_type = message.get("event")

                if event_type == "connected":
                    logger.info("Twilio stream connected")

                elif event_type == "start":
                    self.stream_sid = message["start"]["streamSid"]
                    self.call_sid = message["start"]["callSid"]
                    logger.info(f"Stream started: {self.stream_sid}")

                    # Initialize AI voice session
                    if settings.has_openai:
                        await self._connect_ai_provider()

                elif event_type == "media":
                    # Forward audio to AI provider
                    audio_payload = message["media"]["payload"]
                    if self._ai_ws:
                        await self._forward_to_ai(audio_payload)

                elif event_type == "stop":
                    logger.info("Twilio stream stopped")
                    break

            except json.JSONDecodeError:
                logger.warning("Invalid JSON in voice stream")
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

            # Configure session
            session_config = {
                "type": "session.update",
                "session": {
                    "modalities": ["text", "audio"],
                    "instructions": "You are Walter, a personal AI telephone assistant. Be concise, calm, and professional.",
                    "voice": "alloy",
                    "input_audio_format": "g711_ulaw",
                    "output_audio_format": "g711_ulaw",
                    "turn_detection": {
                        "type": "server_vad",
                        "threshold": 0.5,
                        "prefix_padding_ms": 300,
                        "silence_duration_ms": 500,
                    },
                },
            }

            await self._ai_ws.send(json.dumps(session_config))

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
            async for message in self._ai_ws:
                data = json.loads(message)
                event_type = data.get("type", "")

                if event_type == "response.audio.delta":
                    # Forward AI audio back to Twilio
                    audio_delta = data.get("delta", "")
                    if audio_delta:
                        await self._send_audio_to_twilio(audio_delta)

                elif event_type == "response.audio.done":
                    logger.debug("AI audio response complete")

                elif event_type == "error":
                    logger.error(f"AI provider error: {data.get('error', {})}")

        except Exception as e:
            if self._active:
                logger.error(f"AI response stream error: {e}")

    async def _send_audio_to_twilio(self, audio_payload: str):
        """Send audio back to Twilio via the media stream."""
        # This would send back through the WebSocket
        # The actual implementation needs the Twilio websocket reference
        pass

    async def cleanup(self):
        """Clean up resources when the stream ends."""
        self._active = False
        if self._ai_ws:
            try:
                await self._ai_ws.close()
            except Exception:
                pass
            self._ai_ws = None
        logger.info("Voice stream handler cleaned up")
