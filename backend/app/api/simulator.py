"""Walter AI — Simulator API endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.services.auth import get_current_user_id
from app.services.simulator import SimulatorService
from app.db.repository import db

router = APIRouter()

simulator_service = SimulatorService()


class CreateSessionRequest(BaseModel):
    caller_name: Optional[str] = None


class SessionResponse(BaseModel):
    session_id: str
    status: str
    greeting: str


class MessageRequest(BaseModel):
    message: str


class MessageResponse(BaseModel):
    response: str
    intent: Optional[str] = None
    urgency: Optional[str] = None


class EndSessionResponse(BaseModel):
    session_id: str
    summary: str
    category: str
    urgency: str
    key_details: Dict[str, Any] = Field(default_factory=dict)
    follow_up_actions: List[Dict[str, Any]] = Field(default_factory=list)
    duration_seconds: int
    call_id: Optional[str] = None


@router.post("/simulator/sessions", response_model=SessionResponse)
async def create_session(
    request: CreateSessionRequest,
    user_id: str = Depends(get_current_user_id),
):
    """Start a new simulator session."""
    session = await simulator_service.create_session(user_id, request.caller_name)
    return session


@router.post("/simulator/sessions/{session_id}/messages", response_model=MessageResponse)
async def send_message(
    session_id: str,
    request: MessageRequest,
    user_id: str = Depends(get_current_user_id),
):
    """Send a message in a simulator session."""
    response = await simulator_service.process_message(session_id, user_id, request.message)
    return response


@router.post("/simulator/sessions/{session_id}/end", response_model=EndSessionResponse)
async def end_session(
    session_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """End a simulator session and generate summary."""
    result = await simulator_service.end_session(session_id, user_id)
    return result
