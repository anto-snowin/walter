"""Walter AI — Backend Automated Tests."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.agent.walter_agent import WalterAgent
from app.services.twilio_service import TwilioService
from app.config import settings


@pytest.mark.asyncio
async def test_health_check():
    """Verify health endpoint returns status healthy."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "integrations" in data


@pytest.mark.asyncio
async def test_integrations_status():
    """Verify integrations status endpoint reports status."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/integrations/status")
    assert response.status_code == 200
    data = response.json()
    assert "twilio" in data
    assert "openai" in data
    assert "supabase" in data
    assert "alexa" in data


@pytest.mark.asyncio
async def test_profile_crud():
    """Verify profile retrieval and update."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Get profile
        get_res = await ac.get("/api/profile")
        assert get_res.status_code == 200
        profile = get_res.json()
        assert "id" in profile

        # Update profile
        update_data = {
            "display_name": "Anto Snowin",
            "occupation": "Software Engineer & AI Architect",
            "introduction": "Leading next-generation voice AI projects.",
            "approved_information": {"office_hours": "9am-5pm EST", "city": "New York"},
        }
        put_res = await ac.put("/api/profile", json=update_data)
        assert put_res.status_code == 200
        updated = put_res.json()
        assert updated["display_name"] == "Anto Snowin"
        assert updated["occupation"] == "Software Engineer & AI Architect"


@pytest.mark.asyncio
async def test_preferences_crud():
    """Verify answering rules / preferences retrieval and update."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        get_res = await ac.get("/api/preferences")
        assert get_res.status_code == 200

        update_data = {
            "greeting": "Hello, this is Walter, AI telephone assistant for Anto.",
            "communication_style": "confident and concise",
            "fallback_message": "Anto is currently in deep focus. I will deliver your note.",
        }
        put_res = await ac.put("/api/preferences", json=update_data)
        assert put_res.status_code == 200
        updated = put_res.json()
        assert updated["greeting"] == "Hello, this is Walter, AI telephone assistant for Anto."


@pytest.mark.asyncio
async def test_simulator_lifecycle():
    """Verify browser call simulator lifecycle: create -> message -> end."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Create simulator session
        create_res = await ac.post("/api/simulator/sessions", json={"caller_name": "Sarah Connor"})
        assert create_res.status_code == 200
        session_data = create_res.json()
        session_id = session_data["session_id"]
        assert session_id is not None
        assert "greeting" in session_data

        # 2. Send message
        msg_res = await ac.post(
            f"/api/simulator/sessions/{session_id}/messages",
            json={"message": "Hi Walter, I need to schedule an urgent meeting with Anto regarding Project Sky."},
        )
        assert msg_res.status_code == 200
        msg_data = msg_res.json()
        assert "response" in msg_data
        assert msg_data["intent"] in ["scheduling", "urgent_message", "general"]

        # 3. End simulator session
        end_res = await ac.post(f"/api/simulator/sessions/{session_id}/end")
        assert end_res.status_code == 200
        summary_data = end_res.json()
        assert "summary" in summary_data
        assert "category" in summary_data
        assert "urgency" in summary_data
        call_id = summary_data.get("call_id")

        # 4. Verify call appears in call list
        calls_res = await ac.get("/api/calls")
        assert calls_res.status_code == 200
        calls_list = calls_res.json()
        assert calls_list["total"] >= 1


@pytest.mark.asyncio
async def test_call_escalation():
    """Verify call escalation functionality."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Create and end a session to get a call_id
        create_res = await ac.post("/api/simulator/sessions", json={})
        session_id = create_res.json()["session_id"]
        end_res = await ac.post(f"/api/simulator/sessions/{session_id}/end")
        call_id = end_res.json()["call_id"]
        assert call_id is not None

        # Escalate call
        esc_res = await ac.post(
            f"/api/calls/{call_id}/escalate",
            json={"reason": "Caller requested urgent direct callback"},
        )
        assert esc_res.status_code == 200
        assert esc_res.json()["status"] == "escalated"

        # Verify summary has escalation_required=True
        summary_res = await ac.get(f"/api/calls/{call_id}/summary")
        assert summary_res.status_code == 200
        assert summary_res.json()["escalation_required"] is True


@pytest.mark.asyncio
async def test_dashboard_stats():
    """Verify dashboard stats aggregate correctly."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        stats_res = await ac.get("/api/dashboard/stats")
        assert stats_res.status_code == 200
        stats = stats_res.json()
        assert "total_calls" in stats
        assert "calls_today" in stats
        assert "urgent_calls" in stats
        assert "failed_calls" in stats
        assert "walter_status" in stats


@pytest.mark.asyncio
async def test_call_filtering_and_pagination():
    """Verify search, category/urgency filtering and pagination on calls endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Test pagination
        res = await ac.get("/api/calls?page=1&page_size=5")
        assert res.status_code == 200
        data = res.json()
        assert data["page"] == 1
        assert data["page_size"] == 5

        # Test search query
        res_search = await ac.get("/api/calls?search=Sarah")
        assert res_search.status_code == 200


@pytest.mark.asyncio
async def test_twilio_webhook_requires_twilio_when_unconfigured():
    """Verify incoming twilio webhook returns 503 if twilio is not configured."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # If twilio is not configured, expect 503 Service Unavailable
        res = await ac.post("/api/calls/incoming")
        if not settings.has_twilio:
            assert res.status_code == 503
            assert res.json()["detail"] == "Twilio not configured"


def test_walter_agent_fallback():
    """Verify Walter agent rule-based intent and urgency detection without API key."""
    agent = WalterAgent()
    assert agent._detect_intent_fallback("can we set up a meeting") == "scheduling"
    assert agent._detect_intent_fallback("this is an emergency") == "urgent_message"
    assert agent._detect_intent_fallback("please call back at 555-0199") == "callback_request"

    assert agent._detect_urgency_fallback("this is critical and an emergency") == "critical"
    assert agent._detect_urgency_fallback("it is urgent") == "high"
    assert agent._detect_urgency_fallback("just checking in") == "low"


def test_twilio_service_twiml_generation():
    """Verify Twilio TwiML generator connects bidirectional media stream."""
    svc = TwilioService()
    twiml = svc.generate_connect_twiml("wss://example.com/api/voice/stream")
    assert "<Connect>" in twiml
    assert "<Stream" in twiml
    assert "url=\"wss://example.com/api/voice/stream\"" in twiml
