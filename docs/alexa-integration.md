# Walter AI — Alexa Integration & Tools Specification

This document details the architecture, setup, tools, and testing procedures for connecting Walter AI with Amazon Alexa+ via Model Context Protocol (MCP) or conventional Alexa Custom Skills.

---

## 1. Scope & Boundaries

- **Telephony vs. Alexa:** Alexa does not directly answer ordinary cellular/PSTN telephone calls. Telephony is handled separately via Twilio Programmable Voice.
- **Role of Alexa:** Allows the account owner to use their Echo, Fire TV, or Alexa-enabled devices to:
  - Query recent incoming call summaries and caller identities.
  - Triage urgent calls requiring prompt response or callbacks.
  - Check current answering rules and owner availability.
  - Update Walter's verbal greeting and fallback rules hands-free via voice commands.

---

## 2. Alexa+ MCP Server Specification

The MCP server runs as a standalone service in `alexa/mcp_server.py`. It communicates with Walter's FastAPI backend using Streamable HTTP transport and exposes 5 tools:

| Tool Name | Parameters | Description |
|-----------|------------|-------------|
| `get_recent_call_summaries` | `limit: int` (default 5, max 10) | Retrieves the latest inbound call summaries, callers, and timestamps. |
| `get_urgent_calls` | None | Returns calls flagged with `high` or `critical` urgency requiring action. |
| `get_owner_availability` | None | Checks current greeting, working schedule, and answering style. |
| `get_call_details` | `call_id: string` (required) | Returns deep metadata, action checklist, and entities for a call. |
| `update_answering_preferences` | `greeting: string`, `fallback_message: string` | Updates Walter's verbal greeting or fallback note via voice. |

---

## 3. Running the MCP Server Locally

```powershell
# In PowerShell:
cd d:\walter\alexa
..\backend\.venv\Scripts\python.exe -m uvicorn mcp_server:app --port 8001 --reload
```

Health check endpoint:
```powershell
curl http://localhost:8001/health
```

---

## 4. Testing Tools Locally

### Tool Discovery
```powershell
curl http://localhost:8001/mcp/tools
```

### Execute `get_urgent_calls`
```powershell
curl -X POST http://localhost:8001/mcp/execute `
  -H "Content-Type: application/json" `
  -d '{"tool": "get_urgent_calls", "arguments": {}}'
```

### Execute `get_recent_call_summaries`
```powershell
curl -X POST http://localhost:8001/mcp/execute `
  -H "Content-Type: application/json" `
  -d '{"tool": "get_recent_call_summaries", "arguments": {"limit": 3}}'
```

### Execute `update_answering_preferences`
```powershell
curl -X POST http://localhost:8001/mcp/execute `
  -H "Content-Type: application/json" `
  -d '{"tool": "update_answering_preferences", "arguments": {"greeting": "Hello, Walter AI taking calls while owner is in conference."}}'
```

---

## 5. Security & Authentication

- The MCP server supports optional bearer token authentication via `ALEXA_MCP_API_KEY`.
- When `ALEXA_MCP_API_KEY` is set in the environment, all requests to `/mcp/tools` and `/mcp/execute` must include `Authorization: Bearer <key>`.
- Unauthorized requests return HTTP 401.

---

## 6. Conventional Alexa Skill Fallback

If Alexa+ MCP developer preview access is unavailable in your account region:
1. Navigate to the **Amazon Alexa Developer Console** (developer.amazon.com/alexa).
2. Create a new custom skill named **Walter Assistant**.
3. Add the following interaction model intents:
   - `RecentCallsIntent`: *"Alexa, ask Walter who called today"*
   - `UrgentCallsIntent`: *"Alexa, ask Walter if there are any urgent calls"*
   - `AvailabilityIntent`: *"Alexa, ask Walter what my current greeting is"*
   - `UpdateGreetingIntent`: *"Alexa, tell Walter to update my greeting"*
4. Deploy an AWS Lambda handler or HTTPS webhook that forwards the intent request to Walter's `/mcp/execute` endpoint.
5. Return speech synthesis response formatted for Alexa voice output.
