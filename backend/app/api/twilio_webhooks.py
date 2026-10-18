"""Walter AI — Twilio Webhook Endpoints."""

from __future__ import annotations

import logging
from fastapi import APIRouter, Request, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import Response

from app.config import settings
from app.services.twilio_service import TwilioService
from app.voice.stream_handler import VoiceStreamHandler

logger = logging.getLogger("walter.twilio")

router = APIRouter()

twilio_service = TwilioService()


@router.post("/calls/incoming")
async def incoming_call(request: Request):
    """Handle incoming Twilio voice webhook."""
    if not settings.has_twilio:
        raise HTTPException(status_code=503, detail="Twilio not configured")

    # Validate webhook signature
    form_data = await request.form()
    signature = request.headers.get("X-Twilio-Signature", "")
    url = str(request.url)

    if not settings.is_development:
        is_valid = twilio_service.validate_signature(url, dict(form_data), signature)
        if not is_valid:
            logger.warning("Invalid Twilio webhook signature")
            raise HTTPException(status_code=403, detail="Invalid signature")

    caller = str(form_data.get("From", "Unknown Caller"))
    call_sid = str(form_data.get("CallSid", ""))
    logger.info(f"Incoming call from: {caller} (CallSid: {call_sid})")

    # Generate TwiML to connect bidirectional media stream with custom parameters
    twiml = twilio_service.generate_connect_twiml(
        stream_url=f"wss://{request.headers.get('host', 'localhost')}/api/voice/stream",
        caller=caller,
        call_sid=call_sid,
    )

    return Response(content=twiml, media_type="application/xml")


@router.websocket("/voice/stream")
async def voice_stream(websocket: WebSocket):
    """Handle Twilio bidirectional media stream via WebSocket."""
    await websocket.accept()
    handler = VoiceStreamHandler()

    try:
        await handler.handle_stream(websocket)
    except WebSocketDisconnect:
        logger.info("Voice stream disconnected")
    except Exception as e:
        logger.error(f"Voice stream error: {e}")
    finally:
        await handler.cleanup()
