"""Walter AI — Alexa+ MCP Server.

Exposes Model Context Protocol (MCP) tools for Alexa+ or custom voice integrations
to retrieve recent call summaries, urgent triage flags, and update owner preferences.
"""

from __future__ import annotations

import os
import json
import logging
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel, Field
import httpx

logger = logging.getLogger("walter.alexa")
logging.basicConfig(level=logging.INFO)

WALTER_API_BASE = os.getenv("WALTER_API_BASE", "http://localhost:8000")
ALEXA_MCP_API_KEY = os.getenv("ALEXA_MCP_API_KEY", "")

app = FastAPI(
    title="Walter AI — Alexa+ MCP Bridge",
    description="Streamable HTTP MCP Server exposing Walter call intelligence to Alexa+",
    version="1.0.0",
)


def verify_alexa_auth(authorization: Optional[str] = Header(default=None)):
    """Enforce authorization header for Alexa integration requests."""
    if ALEXA_MCP_API_KEY and authorization != f"Bearer {ALEXA_MCP_API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized Alexa MCP request")
    return True


# -----------------------------------------------------------------------------
# MCP Discovery & Manifest
# -----------------------------------------------------------------------------

@app.get("/mcp/tools")
async def list_tools(_: bool = Depends(verify_alexa_auth)):
    """Return available MCP tools compatible with Alexa+ integration."""
    return {
        "tools": [
            {
                "name": "get_recent_call_summaries",
                "description": "Retrieve the most recent inbound call summaries and caller identities handled by Walter.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "limit": {"type": "integer", "description": "Number of calls to retrieve (max 10)", "default": 5}
                    },
                },
            },
            {
                "name": "get_urgent_calls",
                "description": "Fetch high or critical urgency calls requiring immediate owner attention.",
                "parameters": {"type": "object", "properties": {}},
            },
            {
                "name": "get_owner_availability",
                "description": "Check current owner working hours and answering style configured in Walter.",
                "parameters": {"type": "object", "properties": {}},
            },
            {
                "name": "get_call_details",
                "description": "Retrieve deep metadata, action items, and extracted entities for a specific call ID.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "call_id": {"type": "string", "description": "Unique call session ID"}
                    },
                    "required": ["call_id"],
                },
            },
            {
                "name": "update_answering_preferences",
                "description": "Update Walter's verbal greeting or fallback message via Alexa voice commands.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "greeting": {"type": "string", "description": "New custom greeting line"},
                        "fallback_message": {"type": "string", "description": "New uncertainty fallback line"}
                    },
                },
            },
        ]
    }


# -----------------------------------------------------------------------------
# Tool Execution Handlers
# -----------------------------------------------------------------------------

class ToolExecutionRequest(BaseModel):
    tool: str
    arguments: Dict[str, Any] = Field(default_factory=dict)


@app.post("/mcp/execute")
async def execute_tool(request: ToolExecutionRequest, _: bool = Depends(verify_alexa_auth)):
    """Execute requested MCP tool and return structured answer for Alexa speech synthesis."""
    tool = request.tool
    args = request.arguments

    async with httpx.AsyncClient(base_url=WALTER_API_BASE) as client:
        try:
            if tool == "get_recent_call_summaries":
                limit = args.get("limit", 5)
                res = await client.get(f"/api/calls?page=1&page_size={limit}")
                res.raise_for_status()
                calls = res.json().get("calls", [])
                
                summaries = [
                    {
                        "caller": c.get("caller_number") or "Unknown",
                        "summary": c.get("summary", {}).get("summary", "No summary"),
                        "urgency": c.get("summary", {}).get("urgency", "low"),
                        "time": c.get("started_at"),
                    }
                    for c in calls
                ]
                return {
                    "result": f"Walter handled {len(summaries)} recent calls.",
                    "data": summaries,
                }

            elif tool == "get_urgent_calls":
                res = await client.get("/api/calls?urgency=high&page=1&page_size=10")
                res.raise_for_status()
                urgent = res.json().get("calls", [])
                return {
                    "count": len(urgent),
                    "urgent_calls": [
                        {
                            "caller": c.get("caller_number"),
                            "summary": c.get("summary", {}).get("summary"),
                            "priority": c.get("summary", {}).get("urgency"),
                        }
                        for c in urgent
                    ],
                }

            elif tool == "get_owner_availability":
                res = await client.get("/api/preferences")
                res.raise_for_status()
                pref = res.json()
                return {
                    "greeting": pref.get("greeting"),
                    "communication_style": pref.get("communication_style"),
                    "fallback_message": pref.get("fallback_message"),
                }

            elif tool == "get_call_details":
                call_id = args.get("call_id")
                if not call_id:
                    raise HTTPException(status_code=400, detail="Missing call_id parameter")
                res = await client.get(f"/api/calls/{call_id}")
                res.raise_for_status()
                return {"call_details": res.json()}

            elif tool == "update_answering_preferences":
                payload = {}
                if "greeting" in args:
                    payload["greeting"] = args["greeting"]
                if "fallback_message" in args:
                    payload["fallback_message"] = args["fallback_message"]
                res = await client.put("/api/preferences", json=payload)
                res.raise_for_status()
                return {"status": "success", "updated_preferences": res.json()}

            else:
                raise HTTPException(status_code=404, detail=f"Unknown tool: {tool}")

        except httpx.HTTPError as e:
            logger.error(f"Error querying Walter API: {e}")
            raise HTTPException(status_code=502, detail=f"Walter backend communication error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("mcp_server:app", host="0.0.0.0", port=8001, reload=True)
