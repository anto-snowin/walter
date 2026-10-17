# Walter AI — System Architecture

Walter AI is a personal AI telephone assistant that interfaces between incoming telephone callers and the account owner.

---

## 1. High-Level Architecture Diagram

```
[ Inbound Caller ] 
       │ (Cellular / Landline)
       ▼
[ Twilio Programmable Voice ]
       │ (TwiML / Bidirectional Media Streams WebSocket)
       ▼ (8 kHz μ-law base64 audio)
[ FastAPI Backend ] 
   ├── VoiceStreamHandler (Audio converter & frame buffers)
   ├── WalterAgent (OpenAI Realtime / LLM + Dev Fallback)
   ├── Security Layer (Twilio Signature & JWT Auth)
   └── Repository Layer (Supabase PostgreSQL / In-Memory Dev)
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
[ Next.js App Router Frontend ]    [ Alexa+ MCP Server ]
   ├── Neo-Brutalist Dashboard        ├── Call Summaries Tool
   ├── Browser Call Simulator         ├── Urgent Triage Tool
   └── Personalization & Rules        └── Answering Preferences Tool
```

---

## 2. Inbound Telephone Audio Workflow

1. A caller dials the configured Twilio telephone number.
2. Twilio sends an HTTP POST webhook to `/api/calls/incoming`.
3. FastAPI validates the `X-Twilio-Signature` header.
4. FastAPI returns TwiML instructing Twilio to initiate a bidirectional `<Stream>` to `wss://<host>/api/voice/stream`.
5. Twilio connects to the WebSocket. `VoiceStreamHandler` receives inbound 8 kHz μ-law chunks.
6. The audio is buffered and streamed to the active AI voice session.
7. Outbound AI speech is re-encoded into Twilio-compatible μ-law format and streamed back to the caller.
8. Upon call completion, Walter finalizes the session, executes automated classification and summary synthesis, and updates the owner's dashboard in real-time.

---

## 3. Storage & Isolation

- All user data in PostgreSQL is protected by Row Level Security (RLS).
- Call sessions, answering rules, and profiles are mapped strictly by `user_id`.
- The frontend uses the public anon key only; all privileged database operations are handled by FastAPI server-side.
