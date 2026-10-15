"""Walter AI Backend — API Router."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.profile import router as profile_router
from app.api.preferences import router as preferences_router
from app.api.calls import router as calls_router
from app.api.dashboard import router as dashboard_router
from app.api.simulator import router as simulator_router
from app.api.integrations import router as integrations_router
from app.api.twilio_webhooks import router as twilio_router

router = APIRouter(prefix="/api")

router.include_router(profile_router, tags=["Profile"])
router.include_router(preferences_router, tags=["Preferences"])
router.include_router(calls_router, tags=["Calls"])
router.include_router(dashboard_router, tags=["Dashboard"])
router.include_router(simulator_router, tags=["Simulator"])
router.include_router(integrations_router, tags=["Integrations"])
router.include_router(twilio_router, tags=["Twilio"])
