"""Walter AI — Profile API endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone

from app.services.auth import get_current_user_id
from app.db.repository import db

router = APIRouter(prefix="/profile")


class ProfileResponse(BaseModel):
    id: str
    display_name: Optional[str] = None
    occupation: Optional[str] = None
    introduction: Optional[str] = None
    approved_information: Dict[str, Any] = Field(default_factory=dict)
    private_information_rules: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    occupation: Optional[str] = None
    introduction: Optional[str] = None
    approved_information: Optional[Dict[str, Any]] = None
    private_information_rules: Optional[Dict[str, Any]] = None


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(user_id: str = Depends(get_current_user_id)):
    """Get the authenticated user's profile."""
    profile = await db.get_profile(user_id)
    if not profile:
        # Create default profile
        profile = await db.create_profile(user_id)
    return profile


@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    update: ProfileUpdate,
    user_id: str = Depends(get_current_user_id),
):
    """Update the authenticated user's profile."""
    profile = await db.update_profile(user_id, update.model_dump(exclude_none=True))
    return profile
