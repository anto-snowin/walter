"""Walter AI — Simulator Service."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from app.config import settings
from app.db.repository import db
from app.agent.walter_agent import WalterAgent

logger = logging.getLogger("walter.simulator")


class SimulatorSession:
    """Represents an active simulator session."""

    def __init__(self, session_id: str, user_id: str, caller_name: Optional[str] = None):
        self.session_id = session_id
        self.user_id = user_id
        self.caller_name = caller_name or "Anonymous Caller"
        self.started_at = datetime.now(timezone.utc)
        self.messages: List[Dict[str, str]] = []
        self.agent = WalterAgent()

    def add_message(self, role: str, content: str):
        self.messages.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })


class SimulatorService:
    """Service for managing browser-based call simulation sessions."""

    def __init__(self):
        self._sessions: Dict[str, SimulatorSession] = {}

    async def create_session(
        self, user_id: str, caller_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a new simulator session."""
        session_id = str(uuid.uuid4())
        session = SimulatorSession(session_id, user_id, caller_name)

        # Load user profile for personalized responses
        profile = await db.get_profile(user_id)
        rules = await db.get_answering_rules(user_id)

        await session.agent.initialize(profile, rules)

        greeting = session.agent.get_greeting()
        session.add_message("walter", greeting)

        self._sessions[session_id] = session

        logger.info(f"Simulator session created: {session_id}")

        return {
            "session_id": session_id,
            "status": "active",
            "greeting": greeting,
        }

    async def process_message(
        self, session_id: str, user_id: str, message: str
    ) -> Dict[str, Any]:
        """Process a caller message and generate a Walter response."""
        session = self._sessions.get(session_id)
        if not session:
            raise ValueError("Session not found")
        if session.user_id != user_id:
            raise ValueError("Unauthorized session access")

        session.add_message("caller", message)

        response = await session.agent.respond(message, session.messages)
        session.add_message("walter", response["text"])

        return {
            "response": response["text"],
            "intent": response.get("intent"),
            "urgency": response.get("urgency"),
        }

    async def end_session(self, session_id: str, user_id: str) -> Dict[str, Any]:
        """End a simulator session, generate summary, and save to database."""
        session = self._sessions.get(session_id)
        if not session:
            raise ValueError("Session not found")
        if session.user_id != user_id:
            raise ValueError("Unauthorized session access")

        ended_at = datetime.now(timezone.utc)
        duration = int((ended_at - session.started_at).total_seconds())

        # Generate call summary
        summary_data = await session.agent.generate_summary(session.messages)

        # Save to database
        call_id = await db.save_call_session(
            user_id=user_id,
            caller_number=f"SIM-{session.caller_name}",
            started_at=session.started_at.isoformat(),
            ended_at=ended_at.isoformat(),
            duration_seconds=duration,
            status="completed",
            source="simulator",
        )

        if call_id:
            await db.save_call_summary(
                call_id=call_id,
                user_id=user_id,
                summary=summary_data["summary"],
                category=summary_data["category"],
                urgency=summary_data["urgency"],
                key_details=summary_data.get("key_details", {}),
                follow_up_actions=summary_data.get("follow_up_actions", []),
                escalation_required=summary_data.get("escalation_required", False),
            )

        # Cleanup session
        del self._sessions[session_id]

        logger.info(f"Simulator session ended: {session_id}, duration: {duration}s")

        return {
            "session_id": session_id,
            "summary": summary_data["summary"],
            "category": summary_data["category"],
            "urgency": summary_data["urgency"],
            "key_details": summary_data.get("key_details", {}),
            "follow_up_actions": summary_data.get("follow_up_actions", []),
            "duration_seconds": duration,
            "call_id": call_id,
        }
