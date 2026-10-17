# Walter AI — Alexa Integration Guide

This directory houses the Model Context Protocol (MCP) server that connects Walter AI with Alexa+ or conventional Alexa Custom Skills.

---

## 1. Overview & Boundaries

- **Telephony vs. Alexa:** Alexa does not directly answer ordinary cellular/PSTN telephone calls. Telephony is handled separately via Twilio Programmable Voice.
- **Role of Alexa:** Allows the owner to ask their Echo or Alexa-enabled devices about:
  - Recent incoming call summaries
  - Urgent priority calls requiring callback
  - Owner answering rules & availability
  - Updating Walter's active greeting or fallback rules verbally

---

## 2. Alexa+ MCP Architecture

When registered with an eligible Alexa+ developer account, Alexa uses Streamable HTTP transport to discover and execute tools exposed by `mcp_server.py`.

### Exposed MCP Tools

1. `get_recent_call_summaries(limit: int = 5)`
   - Returns concise summaries of the latest calls handled by Walter.
2. `get_urgent_calls()`
   - Filters calls flagged as `high` or `critical` urgency.
3. `get_owner_availability()`
   - Checks Walter's current greeting, working hours, and communication style.
4. `get_call_details(call_id: string)`
   - Returns full details and extracted key action items for a specific call.
5. `update_answering_preferences(greeting: string, fallback_message: string)`
   - Allows owner to update answering behavior hands-free via voice.

---

## 3. Running the MCP Server Locally

```powershell
# From the project root
cd d:\walter\alexa
..\backend\.venv\Scripts\python.exe -m uvicorn mcp_server:app --port 8001 --reload
```

---

## 4. Conventional Alexa Skill Fallback

If Alexa+ MCP developer access is unavailable for your account region:
1. Create a custom Alexa Skill in the Amazon Alexa Developer Console.
2. Define intents corresponding to the MCP tools (`RecentCallsIntent`, `UrgentCallsIntent`, `UpdateGreetingIntent`).
3. Point your Alexa Skill endpoint to an AWS Lambda function or HTTPS webhook that relays requests to `/mcp/execute`.
