"""Main API v1 router combining all route modules."""

from fastapi import APIRouter

from api.v1.routes import admin, debug, health, quotes

api_router = APIRouter()

# Include all route modules
api_router.include_router(quotes.router, prefix="/api", tags=["quotes"])
api_router.include_router(health.router, tags=["health"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(debug.router, prefix="/debug", tags=["debug"])
