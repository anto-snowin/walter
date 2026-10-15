"""Walter AI — Integration Status API endpoint."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from app.config import settings
from app.services.auth import get_current_user_id

router = APIRouter(prefix="/integrations")


@router.get("/integrations/status")
async def get_integration_status(user_id: str = Depends(get_current_user_id)):
    """Get honest connection status of all integrations."""
    return {
        "twilio": {
            "status": "configured" if settings.has_twilio else "not_configured",
            "description": "Twilio Programmable Voice for inbound telephone calls",
            "requires": ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
            "configured_fields": {
                "account_sid": bool(settings.twilio_account_sid),
                "auth_token": bool(settings.twilio_auth_token),
                "phone_number": bool(settings.twilio_phone_number),
            },
        },
        "openai": {
            "status": "configured" if settings.has_openai else "not_configured",
            "description": "OpenAI Realtime API for AI voice conversations",
            "requires": ["OPENAI_API_KEY"],
            "configured_fields": {
                "api_key": bool(settings.openai_api_key),
            },
            "model": settings.ai_voice_model if settings.has_openai else None,
        },
        "supabase": {
            "status": "configured" if settings.has_supabase else "not_configured",
            "description": "Supabase PostgreSQL database and authentication",
            "requires": ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
            "configured_fields": {
                "url": bool(settings.supabase_url),
                "service_role_key": bool(settings.supabase_service_role_key),
            },
        },
        "alexa": {
            "status": "not_configured",
            "description": "Alexa+ MCP or Alexa Skill for voice assistant integration",
            "requires": ["Alexa Developer Account", "MCP Server Registration"],
            "note": "Alexa integration requires manual setup and testing in a supported Alexa environment.",
        },
    }
