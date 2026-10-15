"""Walter AI — Dashboard Stats API endpoint."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from app.services.auth import get_current_user_id
from app.db.repository import db

router = APIRouter(prefix="/dashboard")


@router.get("/dashboard/stats")
async def get_dashboard_stats(user_id: str = Depends(get_current_user_id)):
    """Get aggregated dashboard statistics for the authenticated user."""
    stats = await db.get_dashboard_stats(user_id)
    return stats
