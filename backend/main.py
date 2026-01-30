"""RemitBuddy API - Real-time remittance rate comparison service."""

import sys
from pathlib import Path

# Add backend directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import settings
from core.logging import setup_logging, get_logger
from core.exceptions import RateLimitExceeded
from api.v1.router import api_router
from infrastructure.proxy.config import proxy_config_manager
from infrastructure.proxy.manager import proxy_manager

# Setup structured logging
setup_logging()
logger = get_logger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
)


# Security middleware - Block admin/debug in production
@app.middleware("http")
async def security_middleware(request: Request, call_next):
    if not settings.is_development:
        path = request.url.path
        if path.startswith("/admin") or path.startswith("/debug"):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
    return await call_next(request)


# CORS configuration
if settings.is_production:
    allowed_origins = settings.cors_allowed_origins
    allow_origin_regex = None
    logger.info("cors_production_mode", origins=allowed_origins)
else:
    allowed_origins = settings.cors_dev_origins
    allow_origin_regex = settings.cors_dev_origin_regex
    logger.info("cors_development_mode", origins=allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)


# Exception handlers
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exception_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"error": exc.message})


# Include API router
app.include_router(api_router)


# Root endpoint
@app.get("/")
def read_root():
    return {"status": "ok"}


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    try:
        proxy_configs = proxy_config_manager.get_proxy_configs()
        for proxy_config in proxy_configs:
            proxy_manager.add_proxy(proxy_config)

        logger.info("proxies_initialized", count=len(proxy_configs))

        if proxy_configs:
            await proxy_manager.health_check_all_proxies()

    except Exception as e:
        logger.error("startup_error", error=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
