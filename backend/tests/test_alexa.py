"""Walter AI — Alexa MCP Server Automated Tests."""

import sys
import os
import pytest
from httpx import AsyncClient, ASGITransport

# Ensure alexa directory is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "alexa")))
from mcp_server import app as alexa_app


@pytest.mark.asyncio
async def test_alexa_health():
    """Verify Alexa MCP server health check endpoint."""
    transport = ASGITransport(app=alexa_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert data["service"] == "walter-alexa-mcp"


@pytest.mark.asyncio
async def test_alexa_list_tools():
    """Verify Alexa MCP tool discovery endpoint."""
    transport = ASGITransport(app=alexa_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/mcp/tools")
        assert res.status_code == 200
        data = res.json()
        assert "tools" in data
        tool_names = [t["name"] for t in data["tools"]]
        assert "get_recent_call_summaries" in tool_names
        assert "get_urgent_calls" in tool_names
        assert "get_owner_availability" in tool_names
        assert "get_call_details" in tool_names
        assert "update_answering_preferences" in tool_names


@pytest.mark.asyncio
async def test_alexa_auth_enforcement(monkeypatch):
    """Verify authorization enforcement when ALEXA_MCP_API_KEY is configured."""
    import mcp_server
    monkeypatch.setattr(mcp_server, "ALEXA_MCP_API_KEY", "secret-test-key-12345")

    transport = ASGITransport(app=alexa_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Request without header -> 401
        res_no_auth = await ac.get("/mcp/tools")
        assert res_no_auth.status_code == 401

        # Request with wrong header -> 401
        res_bad_auth = await ac.get("/mcp/tools", headers={"Authorization": "Bearer wrong-key"})
        assert res_bad_auth.status_code == 401

        # Request with correct header -> 200
        res_valid_auth = await ac.get("/mcp/tools", headers={"Authorization": "Bearer secret-test-key-12345"})
        assert res_valid_auth.status_code == 200


@pytest.mark.asyncio
async def test_alexa_execute_unknown_tool():
    """Verify executing an unrecognized tool returns 404."""
    transport = ASGITransport(app=alexa_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/mcp/execute", json={"tool": "non_existent_tool", "arguments": {}})
        assert res.status_code == 404
        assert "Unknown tool" in res.json()["detail"]
