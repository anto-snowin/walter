"""Walter AI — Preferences / Answering Rules API endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.services.auth import get_current_user_id
from app.db.repository import db

router = APIRouter()


class AnsweringRulesResponse(BaseModel):
    id: Optional[str] = None
    user_id: str
    greeting: str = "Hello, this is Walter, an AI assistant."
    communication_style: str = "professional"
    working_hours: Dict[str, Any] = Field(default_factory=dict)
    urgency_rules: Dict[str, Any] = Field(default_factory=dict)
    fallback_message: str = "I'll pass your message along."
    escalation_settings: Dict[str, Any] = Field(default_factory=dict)
    updated_at: Optional[str] = None


class AnsweringRulesUpdate(BaseModel):
    greeting: Optional[str] = None
    communication_style: Optional[str] = None
    working_hours: Optional[Dict[str, Any]] = None
    urgency_rules: Optional[Dict[str, Any]] = None
    fallback_message: Optional[str] = None
    escalation_settings: Optional[Dict[str, Any]] = None


@router.get("/preferences", response_model=AnsweringRulesResponse)
async def get_preferences(user_id: str = Depends(get_current_user_id)):
    """Get the authenticated user's answering rules."""
    rules = await db.get_answering_rules(user_id)
    if not rules:
        rules = await db.create_answering_rules(user_id)
    return rules


@router.put("/preferences", response_model=AnsweringRulesResponse)
async def update_preferences(
    update: AnsweringRulesUpdate,
    user_id: str = Depends(get_current_user_id),
):
    """Update the authenticated user's answering rules."""
    rules = await db.update_answering_rules(user_id, update.model_dump(exclude_none=True))
    return rules
