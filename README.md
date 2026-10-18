# Walter AI

**Your Voice. Your Walter. Always There.**

Walter AI is a personal AI telephone assistant that answers incoming telephone calls on your behalf, converses naturally with callers using approved personal information, identifies urgent triage situations, generates concise summaries with action checklists, and allows you to manage everything through a Neo-Brutalist web dashboard.

---

## 1. System Architecture

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS v4 + Recharts + Lucide Icons (Neo-Brutalist Design System)
- **Backend**: FastAPI + Python 3.12 + Uvicorn + Pydantic v2 + WebSockets
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) + In-Memory Development Repository
- **Telephony**: Twilio Programmable Voice with Bidirectional WebSocket Media Streams (8 kHz μ-law)
- **AI Voice**: OpenAI Realtime API (`gpt-4o-realtime-preview`) + Rule-based Development Fallback
- **Voice Assistant**: Streamable HTTP Model Context Protocol (MCP) Server for Alexa+ / Conventional Alexa Skill Fallback

---

## 2. Quick Start (Windows PowerShell)

### Prerequisites
- Python 3.12+
- Node.js v20+ and npm

### Step 1: Run Backend & Test Suite
```powershell
cd d:\walter\backend

# Run automated tests (20 passing unit & integration tests)
.\.venv\Scripts\pytest.exe -v

# Start FastAPI server on port 8000
.\.venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```
Verify backend health: [http://localhost:8000/health](http://localhost:8000/health)

### Step 2: Run Next.js Frontend
```powershell
cd d:\walter\frontend

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Run Alexa+ MCP Server (Optional)
```powershell
cd d:\walter\alexa

# Run MCP server on port 8001
..\backend\.venv\Scripts\uvicorn.exe mcp_server:app --port 8001 --reload
```
Verify MCP health: [http://localhost:8001/health](http://localhost:8001/health)

---

## 3. Project Directory Structure

```
walter/
├── frontend/                     # Next.js App Router (Neo-Brutalist UI)
│   ├── src/app/                  # App routes: /, /login, /dashboard/*
│   │   ├── dashboard/calls/      # Call telemetry archive & detail view
│   │   ├── dashboard/simulator/  # Interactive browser call simulator
│   │   ├── dashboard/personalization/ # Profile facts & restricted topics
│   │   ├── dashboard/rules/      # Answering rules & escalation triggers
│   │   ├── dashboard/integrations/ # Honest provider connection telemetry
│   │   └── dashboard/settings/   # Data retention & audio privacy policy
│   ├── src/components/ui/        # Reusable Neo-Brutalist component kit
│   └── src/lib/api.ts            # Typed client for FastAPI backend
├── backend/                      # FastAPI Python 3.12 application
│   ├── app/main.py               # API routes, CORS, and health checks
│   ├── app/agent/walter_agent.py # Walter AI system prompt & fallback logic
│   ├── app/voice/stream_handler.py # Twilio bidirectional media stream pipeline
│   ├── app/services/             # Simulator, Twilio, and Auth services
│   ├── app/db/repository.py      # Supabase PostgreSQL & In-Memory storage
│   └── tests/                    # 20 automated pytest test cases
├── alexa/                        # Alexa+ Model Context Protocol (MCP) server
│   ├── mcp_server.py             # 5 MCP voice tools + Streamable HTTP
│   └── README.md                 # Alexa+ and Skill fallback guide
├── supabase/migrations/          # SQL schema migrations with full RLS
├── docs/                         # Architecture, Setup, Privacy, Deployment
├── walter_execution_plan.md      # Complete project execution plan
└── README.md
```

---

## 4. Zero-Cost Development Mode

Walter is engineered with a **zero-cost developer harness**:
- The **Browser Call Simulator** (`/dashboard/simulator`) exercises the full conversational lifecycle without needing a paid Twilio number or OpenAI subscription.
- If third-party credentials are not configured, Walter automatically activates its rule-based intent recognition, urgency triage, and summary synthesis pipeline, explicitly labeled with `[DEVELOPMENT MODE]`.
- Single-click bypass on `/login` allows instant access to all owner console views.

---

## 5. Automated Tests

```powershell
cd d:\walter\backend
.\.venv\Scripts\pytest.exe -v
```

Tests verify:
- Backend health and external integration status endpoints
- User profile and answering rules CRUD
- Simulator lifecycle: creation, messaging, intent classification, and summary generation
- Call session archiving and escalation authorization
- Pagination and multi-parameter filtering
- Voice stream handler bidirectional media streaming and interruption clearing
- Twilio webhook signature validation and 403 enforcement
- Malformed webhook request handling
- Graceful AI provider fallback when credentials are absent
- Alexa MCP tool discovery, health checks, and token authorization

---

## 6. Documentation

Detailed technical guides are available in `docs/`:
- [Architecture & Data Flow](docs/architecture.md)
- [Local Development Setup](docs/setup.md)
- [Privacy & Two-Party Consent Policy](docs/privacy.md)
- [Production Deployment Guide](docs/deployment.md)
- [Alexa+ MCP & Custom Skill Specification](docs/alexa-integration.md)
