# Walter AI — Production Deployment Guide

---

## 1. Frontend Deployment (Vercel / Next.js)

1. Deploy the `frontend/` directory to Vercel or any Node.js container host.
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anon key
   - `NEXT_PUBLIC_API_BASE_URL`: The public HTTPS URL of your deployed FastAPI backend

---

## 2. Backend Deployment (Docker / Cloud Run / EC2)

FastAPI requires support for long-lived WebSocket connections (`/api/voice/stream`):
1. Package the backend container using `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
2. Configure environment variables in `.env`:
   - `APP_ENV=production`
   - `APP_BASE_URL=https://api.yourdomain.com`
   - `FRONTEND_ORIGIN=https://yourdomain.com`
   - `OPENAI_API_KEY=sk-...`
   - `TWILIO_ACCOUNT_SID=AC...`
   - `TWILIO_AUTH_TOKEN=...`
   - `TWILIO_PHONE_NUMBER=+1...`
   - `SUPABASE_URL=https://...supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=ey...`

---

## 3. Twilio Webhook Configuration

1. In the Twilio Voice Console, select your active telephone number.
2. Under "A Call Comes In", choose **Webhook (HTTP POST)**.
3. Enter URL: `https://api.yourdomain.com/api/calls/incoming`.
4. Twilio will route incoming phone calls directly to Walter's WebSocket media stream.
