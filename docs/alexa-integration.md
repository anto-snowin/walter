# Walter AI — Alexa Integration & Tools Specification

---

## 1. Capabilities

Walter exposes 5 distinct voice tools to Alexa+:
- `get_recent_call_summaries`
- `get_urgent_calls`
- `get_owner_availability`
- `get_call_details`
- `update_answering_preferences`

---

## 2. Testing Endpoints

Test the MCP tools locally:
```bash
curl -X POST http://localhost:8001/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "get_urgent_calls", "arguments": {}}'
```
