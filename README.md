# Walter AI

**Your Voice. Your Walter. Always There.**

Walter AI is a personalized AI telephone assistant that answers incoming calls on your behalf, talks naturally with callers, handles routine questions, identifies urgent situations, and lets you manage everything through a secure web dashboard.

## Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Neo-Brutalist Design
- **Backend**: FastAPI + Python 3.12 + WebSockets
- **Database**: Supabase PostgreSQL with Row Level Security
- **Telephony**: Twilio Programmable Voice + Bidirectional Media Streams
- **AI Voice**: OpenAI Realtime API (with fallback STT→LLM→TTS pipeline)
- **Voice Assistant**: Alexa MCP / Alexa Skill integration

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- Supabase account (free tier)

### Frontend
```powershell
cd frontend
npm install
npm run dev
```

### Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Environment Variables
Copy `.env.example` files in both `frontend/` and `backend/` directories and fill in your credentials.

## Project Structure
```
walter-ai/
├── frontend/          # Next.js App Router (Neo-Brutalist UI)
├── backend/           # FastAPI backend
├── alexa/             # Alexa MCP server
├── supabase/          # Database migrations
├── docs/              # Documentation
├── .gitignore
└── README.md
```

## External Services Required
| Service | Required For | Free Tier |
|---------|-------------|-----------|
| Supabase | Database + Auth | ✅ Yes |
| OpenAI | AI conversations | ❌ Paid |
| Twilio | Phone calls | ❌ Paid |
| Vercel | Frontend hosting | ✅ Yes |

The browser-based call simulator works without Twilio or OpenAI credentials.

## License
Private — All rights reserved.
