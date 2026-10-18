"""Walter AI — Voice Stream, Telephony, and Security Automated Tests."""

import json
import pytest
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.config import settings
from app.voice.stream_handler import VoiceStreamHandler
from app.services.twilio_service import TwilioService
from app.agent.walter_agent import WalterAgent
from app.db.repository import db


@pytest.mark.asyncio
async def test_voice_stream_handler_lifecycle():
    """Verify VoiceStreamHandler connects, processes start, media, stop, and persists call session."""
    handler = VoiceStreamHandler(user_id="dev-user-00000000-0000-0000-0000-000000000000")
    mock_ws = MagicMock()
    mock_ws.send_text = AsyncMock()

    # Simulate Twilio messages
    messages = [
        json.dumps({"event": "connected"}),
        json.dumps({
            "event": "start",
            "start": {
                "streamSid": "MZ1234567890",
                "callSid": "CA999888777",
                "customParameters": {
                    "caller": "+15551234567",
                    "call_sid": "CA999888777",
                },
            },
        }),
        json.dumps({
            "event": "media",
            "media": {
                "payload": "f39/f39/f39/f39/",
            },
        }),
        json.dumps({"event": "stop"}),
    ]

    async def iter_text():
        for m in messages:
            yield m

    mock_ws.iter_text = iter_text

    await handler.handle_stream(mock_ws)

    assert handler.stream_sid == "MZ1234567890"
    assert handler.call_sid == "CA999888777"
    assert handler.caller_number == "+15551234567"
    assert handler._finalized is True

    # Verify session was recorded in database
    calls_res = await db.get_calls(user_id="dev-user-00000000-0000-0000-0000-000000000000", source="twilio")
    assert calls_res["total"] >= 1
    recent_call = calls_res["calls"][0]
    assert recent_call["source"] == "twilio"
    assert recent_call["caller_number"] == "+15551234567"
    assert recent_call["summary"] is not None


@pytest.mark.asyncio
async def test_voice_stream_send_audio_to_twilio():
    """Verify sending audio back to Twilio formats correctly in Twilio media JSON."""
    handler = VoiceStreamHandler()
    handler.stream_sid = "MZ_TEST_123"
    mock_ws = MagicMock()
    mock_ws.send_text = AsyncMock()
    handler.websocket = mock_ws

    sample_payload = "f39/f39/f39/f39/"
    await handler._send_audio_to_twilio(sample_payload)

    mock_ws.send_text.assert_called_once()
    sent_text = mock_ws.send_text.call_args[0][0]
    data = json.loads(sent_text)
    assert data["event"] == "media"
    assert data["streamSid"] == "MZ_TEST_123"
    assert data["media"]["payload"] == sample_payload


@pytest.mark.asyncio
async def test_twilio_webhook_signature_validation(monkeypatch):
    """Verify webhook signature validation when Twilio is configured."""
    monkeypatch.setattr(settings, "twilio_account_sid", "ACtest123")
    monkeypatch.setattr(settings, "twilio_auth_token", "testtoken456")
    monkeypatch.setattr(settings, "app_env", "production")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Request with invalid signature in production environment
        res = await ac.post(
            "/api/calls/incoming",
            data={"From": "+15551112222", "CallSid": "CA111222333"},
            headers={"X-Twilio-Signature": "invalid_sig"},
        )
        assert res.status_code == 403
        assert res.json()["detail"] == "Invalid signature"


@pytest.mark.asyncio
async def test_malformed_webhook_requests():
    """Verify malformed requests to API endpoints return structured errors."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Invalid JSON to simulator message
        res = await ac.post(
            "/api/simulator/sessions/non-existent-id/messages",
            json={},  # missing required "message" field
        )
        assert res.status_code == 422  # Pydantic validation error


@pytest.mark.asyncio
async def test_ai_provider_missing_credentials_graceful_fallback():
    """Verify Walter agent falls back smoothly without crashing when OpenAI is unavailable."""
    agent = WalterAgent()
    await agent.initialize(
        profile={"display_name": "Dr. Sarah", "occupation": "Physician"},
        rules={"greeting": "Hello, Dr. Sarah's office."},
    )

    greeting = agent.get_greeting()
    assert "Dr. Sarah" in greeting

    response = await agent.respond("I have a critical emergency regarding my prescription", [])
    assert response["urgency"] == "critical"
    assert "[DEVELOPMENT MODE]" in response["text"]

    summary = await agent.generate_summary([
        {"role": "caller", "content": "I have an emergency"},
        {"role": "walter", "content": "I understand this is urgent."},
    ])
    assert "summary" in summary
    assert "urgency" in summary
