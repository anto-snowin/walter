"""Walter AI — Authentication Service."""

from __future__ import annotations

import logging
from fastapi import Header, HTTPException
from typing import Optional

from app.config import settings

logger = logging.getLogger("walter.auth")


async def get_current_user_id(
    authorization: Optional[str] = Header(default=None),
) -> str:
    """Extract and validate user ID from the Authorization header.
    
    In production, this validates the Supabase JWT token.
    In development without Supabase, returns a development user ID.
    """
    if not settings.has_supabase:
        # Development mode — return a fixed dev user ID
        return "dev-user-00000000-0000-0000-0000-000000000000"

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")

    token = authorization.replace("Bearer ", "")

    try:
        from supabase import create_client

        supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)
        user_response = supabase.auth.get_user(token)

        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")

        return user_response.user.id

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")
