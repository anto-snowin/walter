"""Walter AI — Database Repository (In-Memory Development Fallback)."""

from __future__ import annotations

import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from app.config import settings

logger = logging.getLogger("walter.db")


class InMemoryRepository:
    """In-memory data store for development without Supabase."""

    def __init__(self):
        self._profiles: Dict[str, Dict[str, Any]] = {}
        self._answering_rules: Dict[str, Dict[str, Any]] = {}
        self._call_sessions: Dict[str, Dict[str, Any]] = {}
        self._call_summaries: Dict[str, Dict[str, Any]] = {}
        self._trusted_contacts: Dict[str, List[Dict[str, Any]]] = {}

    # --- Profiles ---

    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self._profiles.get(user_id)

    async def create_profile(self, user_id: str) -> Dict[str, Any]:
        profile = {
            "id": user_id,
            "display_name": "Walter User",
            "occupation": "",
            "introduction": "",
            "approved_information": {},
            "private_information_rules": {},
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        self._profiles[user_id] = profile
        return profile

    async def update_profile(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if user_id not in self._profiles:
            await self.create_profile(user_id)
        self._profiles[user_id].update(data)
        self._profiles[user_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
        return self._profiles[user_id]

    # --- Answering Rules ---

    async def get_answering_rules(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self._answering_rules.get(user_id)

    async def create_answering_rules(self, user_id: str) -> Dict[str, Any]:
        rules = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "greeting": "Hello, this is Walter, an AI assistant.",
            "communication_style": "professional",
            "working_hours": {"timezone": "UTC", "schedule": {}},
            "urgency_rules": {},
            "fallback_message": "I'll pass your message along to the owner.",
            "escalation_settings": {},
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        self._answering_rules[user_id] = rules
        return rules

    async def update_answering_rules(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if user_id not in self._answering_rules:
            await self.create_answering_rules(user_id)
        self._answering_rules[user_id].update(data)
        self._answering_rules[user_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
        return self._answering_rules[user_id]

    # --- Call Sessions ---

    async def save_call_session(
        self,
        user_id: str,
        caller_number: Optional[str] = None,
        started_at: Optional[str] = None,
        ended_at: Optional[str] = None,
        duration_seconds: int = 0,
        status: str = "completed",
        source: str = "simulator",
        provider_call_id: Optional[str] = None,
    ) -> str:
        call_id = str(uuid.uuid4())
        session = {
            "id": call_id,
            "user_id": user_id,
            "provider_call_id": provider_call_id,
            "caller_number": caller_number,
            "started_at": started_at or datetime.now(timezone.utc).isoformat(),
            "ended_at": ended_at,
            "duration_seconds": duration_seconds,
            "status": status,
            "source": source,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self._call_sessions[call_id] = session
        return call_id

    async def get_calls(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        category: Optional[str] = None,
        urgency: Optional[str] = None,
        source: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
    ) -> Dict[str, Any]:
        user_calls = [
            c for c in self._call_sessions.values()
            if c["user_id"] == user_id
        ]

        if status:
            user_calls = [c for c in user_calls if c["status"] == status]
        if source:
            user_calls = [c for c in user_calls if c["source"] == source]

        # Sort by created_at descending
        user_calls.sort(key=lambda x: x.get("created_at", ""), reverse=True)

        total = len(user_calls)
        start = (page - 1) * page_size
        end = start + page_size
        paginated = user_calls[start:end]

        # Attach summaries
        for call in paginated:
            summary = next(
                (s for s in self._call_summaries.values() if s["call_id"] == call["id"]),
                None,
            )
            call["summary"] = summary

        return {
            "calls": paginated,
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    async def get_call(self, user_id: str, call_id: str) -> Optional[Dict[str, Any]]:
        call = self._call_sessions.get(call_id)
        if call and call["user_id"] == user_id:
            summary = next(
                (s for s in self._call_summaries.values() if s["call_id"] == call_id),
                None,
            )
            call["summary"] = summary
            return call
        return None

    async def get_call_summary(self, user_id: str, call_id: str) -> Optional[Dict[str, Any]]:
        for summary in self._call_summaries.values():
            if summary["call_id"] == call_id and summary["user_id"] == user_id:
                return summary
        return None

    async def save_call_summary(
        self,
        call_id: str,
        user_id: str,
        summary: str,
        category: str = "general",
        urgency: str = "low",
        key_details: Optional[Dict[str, Any]] = None,
        follow_up_actions: Optional[List[Dict[str, Any]]] = None,
        escalation_required: bool = False,
    ) -> str:
        summary_id = str(uuid.uuid4())
        self._call_summaries[summary_id] = {
            "id": summary_id,
            "call_id": call_id,
            "user_id": user_id,
            "summary": summary,
            "category": category,
            "urgency": urgency,
            "key_details": key_details or {},
            "follow_up_actions": follow_up_actions or [],
            "escalation_required": escalation_required,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        return summary_id

    async def escalate_call(self, user_id: str, call_id: str, reason: Optional[str] = None) -> bool:
        for summary in self._call_summaries.values():
            if summary["call_id"] == call_id and summary["user_id"] == user_id:
                summary["escalation_required"] = True
                return True
        return False

    # --- Dashboard Stats ---

    async def get_dashboard_stats(self, user_id: str) -> Dict[str, Any]:
        user_calls = [
            c for c in self._call_sessions.values()
            if c["user_id"] == user_id
        ]

        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        today_calls = [
            c for c in user_calls
            if c.get("started_at", "").startswith(today)
        ]

        urgent_count = 0
        for call in user_calls:
            summary = next(
                (s for s in self._call_summaries.values() if s["call_id"] == call["id"]),
                None,
            )
            if summary and summary.get("urgency") in ("high", "critical"):
                urgent_count += 1

        failed_count = len([c for c in user_calls if c.get("status") == "failed"])

        recent = sorted(user_calls, key=lambda x: x.get("created_at", ""), reverse=True)[:5]
        for call in recent:
            call["summary"] = next(
                (s for s in self._call_summaries.values() if s["call_id"] == call["id"]),
                None,
            )

        return {
            "total_calls": len(user_calls),
            "calls_today": len(today_calls),
            "urgent_calls": urgent_count,
            "failed_calls": failed_count,
            "recent_calls": recent,
            "walter_status": "online",
        }


class SupabaseRepository:
    """Supabase PostgreSQL repository for production use."""

    def __init__(self):
        if settings.has_supabase:
            from supabase import create_client
            self._client = create_client(settings.supabase_url, settings.supabase_service_role_key)
        else:
            self._client = None

    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        if not self._client:
            return None
        result = self._client.table("profiles").select("*").eq("id", user_id).execute()
        return result.data[0] if result.data else None

    async def create_profile(self, user_id: str) -> Dict[str, Any]:
        data = {
            "id": user_id,
            "display_name": "Walter User",
            "occupation": "",
            "introduction": "",
            "approved_information": {},
            "private_information_rules": {},
        }
        if self._client:
            result = self._client.table("profiles").insert(data).execute()
            return result.data[0]
        return data

    async def update_profile(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if self._client:
            result = (
                self._client.table("profiles")
                .update(data)
                .eq("id", user_id)
                .execute()
            )
            return result.data[0] if result.data else data
        return data

    async def get_answering_rules(self, user_id: str) -> Optional[Dict[str, Any]]:
        if not self._client:
            return None
        result = (
            self._client.table("answering_rules")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )
        return result.data[0] if result.data else None

    async def create_answering_rules(self, user_id: str) -> Dict[str, Any]:
        data = {
            "user_id": user_id,
            "greeting": "Hello, this is Walter, an AI assistant.",
            "communication_style": "professional",
            "working_hours": {},
            "urgency_rules": {},
            "fallback_message": "I'll pass your message along to the owner.",
            "escalation_settings": {},
        }
        if self._client:
            result = self._client.table("answering_rules").insert(data).execute()
            return result.data[0]
        return data

    async def update_answering_rules(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if self._client:
            result = (
                self._client.table("answering_rules")
                .update(data)
                .eq("user_id", user_id)
                .execute()
            )
            return result.data[0] if result.data else data
        return data

    async def save_call_session(self, **kwargs) -> str:
        call_id = str(uuid.uuid4())
        kwargs["id"] = call_id
        if self._client:
            self._client.table("call_sessions").insert(kwargs).execute()
        return call_id

    async def get_calls(self, user_id: str, **kwargs) -> Dict[str, Any]:
        if not self._client:
            return {"calls": [], "total": 0, "page": 1, "page_size": 20}

        page = kwargs.get("page", 1)
        page_size = kwargs.get("page_size", 20)
        offset = (page - 1) * page_size

        query = (
            self._client.table("call_sessions")
            .select("*, call_summaries(*)", count="exact")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .range(offset, offset + page_size - 1)
        )

        if kwargs.get("status"):
            query = query.eq("status", kwargs["status"])
        if kwargs.get("source"):
            query = query.eq("source", kwargs["source"])

        result = query.execute()

        calls = []
        for row in result.data:
            summaries = row.pop("call_summaries", [])
            row["summary"] = summaries[0] if summaries else None
            calls.append(row)

        return {
            "calls": calls,
            "total": result.count or 0,
            "page": page,
            "page_size": page_size,
        }

    async def get_call(self, user_id: str, call_id: str) -> Optional[Dict[str, Any]]:
        if not self._client:
            return None
        result = (
            self._client.table("call_sessions")
            .select("*, call_summaries(*)")
            .eq("id", call_id)
            .eq("user_id", user_id)
            .execute()
        )
        if result.data:
            row = result.data[0]
            summaries = row.pop("call_summaries", [])
            row["summary"] = summaries[0] if summaries else None
            return row
        return None

    async def get_call_summary(self, user_id: str, call_id: str) -> Optional[Dict[str, Any]]:
        if not self._client:
            return None
        result = (
            self._client.table("call_summaries")
            .select("*")
            .eq("call_id", call_id)
            .eq("user_id", user_id)
            .execute()
        )
        return result.data[0] if result.data else None

    async def save_call_summary(self, **kwargs) -> str:
        summary_id = str(uuid.uuid4())
        kwargs["id"] = summary_id
        if self._client:
            self._client.table("call_summaries").insert(kwargs).execute()
        return summary_id

    async def escalate_call(self, user_id: str, call_id: str, reason: Optional[str] = None) -> bool:
        if self._client:
            self._client.table("call_summaries").update(
                {"escalation_required": True}
            ).eq("call_id", call_id).eq("user_id", user_id).execute()
        return True

    async def get_dashboard_stats(self, user_id: str) -> Dict[str, Any]:
        # Simplified — uses get_calls for stats
        calls_result = await self.get_calls(user_id, page=1, page_size=1000)
        calls = calls_result.get("calls", [])

        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        today_calls = [c for c in calls if c.get("started_at", "").startswith(today)]
        urgent = [c for c in calls if c.get("summary", {}) and c["summary"].get("urgency") in ("high", "critical")]
        failed = [c for c in calls if c.get("status") == "failed"]
        recent = calls[:5]

        return {
            "total_calls": len(calls),
            "calls_today": len(today_calls),
            "urgent_calls": len(urgent),
            "failed_calls": len(failed),
            "recent_calls": recent,
            "walter_status": "online",
        }


# Select the right repository implementation
if settings.has_supabase:
    db = SupabaseRepository()
else:
    logger.info("Using in-memory database (development mode)")
    db = InMemoryRepository()
