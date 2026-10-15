"""Walter AI Backend — FastAPI Application."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

logger = logging.getLogger("walter")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info("Walter AI Backend starting up...")
    logger.info(f"  Environment: {settings.app_env}")
    logger.info(f"  OpenAI configured: {settings.has_openai}")
    logger.info(f"  Twilio configured: {settings.has_twilio}")
    logger.info(f"  Supabase configured: {settings.has_supabase}")

    if not settings.has_openai:
        logger.warning("OpenAI API key not configured — simulator will use development fallback.")
    if not settings.has_twilio:
        logger.warning("Twilio credentials not configured — real telephone calls unavailable.")
    if not settings.has_supabase:
        logger.warning("Supabase not configured — using in-memory storage for development.")

    yield

    logger.info("Walter AI Backend shutting down...")


app = FastAPI(
    title="Walter AI",
    description="Personal AI Telephone Assistant — Backend API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------------
# API Routes
# -------------------------------------------------------------------

from app.api import router as api_router  # noqa: E402

app.include_router(api_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "walter-ai-backend",
        "version": "0.1.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "integrations": {
            "openai": "configured" if settings.has_openai else "not_configured",
            "twilio": "configured" if settings.has_twilio else "not_configured",
            "supabase": "configured" if settings.has_supabase else "not_configured",
        },
    }
