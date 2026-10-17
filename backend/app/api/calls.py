"""Walter AI — Calls API endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

from app.services.auth import get_current_user_id
from app.db.repository import db

router = APIRouter()


class CallSummaryResponse(BaseModel):
    id: str
    call_id: str
    user_id: str
    summary: str
    category: str = "general"
    urgency: str = "low"
    key_details: Dict[str, Any] = Field(default_factory=dict)
    follow_up_actions: List[Dict[str, Any]] = Field(default_factory=list)
    escalation_required: bool = False
    created_at: Optional[str] = None


class CallSessionResponse(BaseModel):
    id: str
    user_id: str
    provider_call_id: Optional[str] = None
    caller_number: Optional[str] = None
    started_at: Optional[str] = None
    ended_at: Optional[str] = None
    duration_seconds: Optional[int] = None
    status: str = "completed"
    source: str = "simulator"
    created_at: Optional[str] = None
    summary: Optional[CallSummaryResponse] = None


class CallListResponse(BaseModel):
    calls: List[CallSessionResponse]
    total: int
    page: int
    page_size: int


@router.get("/calls", response_model=CallListResponse)
async def get_calls(
    user_id: str = Depends(get_current_user_id),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    urgency: Optional[str] = None,
    source: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
):
    """Get paginated call history for the authenticated user."""
    result = await db.get_calls(
        user_id=user_id,
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        category=category,
        urgency=urgency,
        source=source,
        date_from=date_from,
        date_to=date_to,
    )
    return result


@router.get("/calls/{call_id}", response_model=CallSessionResponse)
async def get_call(
    call_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """Get details of a specific call."""
    call = await db.get_call(user_id, call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call


@router.get("/calls/{call_id}/summary", response_model=CallSummaryResponse)
async def get_call_summary(
    call_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """Get the summary for a specific call."""
    summary = await db.get_call_summary(user_id, call_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    return summary


class EscalateRequest(BaseModel):
    reason: Optional[str] = None


@router.post("/calls/{call_id}/escalate")
async def escalate_call(
    call_id: str,
    request: EscalateRequest,
    user_id: str = Depends(get_current_user_id),
):
    """Mark a call for escalation. Owner-only action."""
    call = await db.get_call(user_id, call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    result = await db.escalate_call(user_id, call_id, request.reason)
    return {"status": "escalated", "call_id": call_id}
