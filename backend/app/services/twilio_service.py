"""Walter AI — Twilio Service."""

from __future__ import annotations

import logging
from app.config import settings

logger = logging.getLogger("walter.twilio")


class TwilioService:
    """Twilio integration service for voice calls."""

    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None and settings.has_twilio:
            from twilio.rest import Client
            self._client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        return self._client

    def validate_signature(self, url: str, params: dict, signature: str) -> bool:
        """Validate Twilio webhook signature."""
        if not settings.has_twilio:
            return False

        from twilio.request_validator import RequestValidator
        validator = RequestValidator(settings.twilio_auth_token)
        return validator.validate(url, params, signature)

    def generate_connect_twiml(self, stream_url: str) -> str:
        """Generate TwiML to connect a bidirectional media stream."""
        return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Please wait while I connect you to Walter.</Say>
    <Connect>
        <Stream url="{stream_url}">
            <Parameter name="service" value="walter-ai" />
        </Stream>
    </Connect>
</Response>"""

    async def check_health(self) -> dict:
        """Check Twilio connection health."""
        if not settings.has_twilio:
            return {"status": "not_configured", "error": "Twilio credentials not set"}

        try:
            account = self.client.api.accounts(settings.twilio_account_sid).fetch()
            return {
                "status": "connected",
                "account_name": account.friendly_name,
                "account_status": account.status,
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}
