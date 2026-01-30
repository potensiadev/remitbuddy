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
from core.sentry import init_sentry
from core.metrics import init_metrics
from api.v1.router import api_router
from infrastructure.proxy.config import proxy_config_manager
from infrastructure.proxy.manager import proxy_manager

# Initialize Sentry first (before other setup)
init_sentry()

# Initialize Prometheus metrics
init_metrics(version=settings.api_version, env=settings.env)

# Setup structured logging
setup_logging()
logger = get_logger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
)


# Security middleware - Multi-layer protection for admin/debug endpoints
@app.middleware("http")
async def security_middleware(request: Request, call_next):
    path = request.url.path

    # Check if accessing admin or debug endpoints
    if path.startswith("/admin") or path.startswith("/debug"):
        # Layer 1: Master switch - if disabled, block all access
        if not settings.admin_endpoints_enabled:
            logger.warning("admin_access_blocked_disabled", path=path)
            return JSONResponse(status_code=404, content={"detail": "Not Found"})

        # Layer 2: Production environment - block completely
        if settings.is_production:
            logger.warning(
                "admin_access_blocked_production",
                path=path,
                client_ip=request.client.host if request.client else "unknown",
            )
            return JSONResponse(status_code=404, content={"detail": "Not Found"})

        # Layer 3: IP whitelist check (development/staging)
        client_ip = request.client.host if request.client else "unknown"
        if not settings.is_admin_ip_allowed(client_ip):
            logger.warning(
                "admin_access_blocked_ip",
                path=path,
                client_ip=client_ip,
                allowed_ips=settings.admin_allowed_ips,
            )
            return JSONResponse(status_code=404, content={"detail": "Not Found"})

        # Layer 4: Token validation (if configured)
        admin_token = request.headers.get("X-Admin-Token")
        if not settings.is_admin_token_valid(admin_token):
            logger.warning(
                "admin_access_blocked_token",
                path=path,
                client_ip=client_ip,
            )
            return JSONResponse(status_code=404, content={"detail": "Not Found"})

        logger.info("admin_access_granted", path=path, client_ip=client_ip)

    return await call_next(request)


# CORS configuration - environment-specific with no private IP ranges
def get_cors_origins() -> list:
    """Get CORS origins based on environment."""
    if settings.is_production:
        return settings.cors_allowed_origins
    elif settings.is_staging:
        return settings.cors_staging_origins
    else:
        return settings.cors_dev_origins


cors_origins = get_cors_origins()
logger.info(
    "cors_configured",
    env=settings.env,
    origins=cors_origins,
    allow_credentials=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=None,  # Private IP regex removed for security
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],  # Restricted to needed methods only
    allow_headers=["Content-Type", "Authorization", "X-Admin-Token"],  # Restricted headers
    expose_headers=["X-RateLimit-Remaining", "X-RateLimit-Reset"],
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
    # Validate production requirements
    config_errors = settings.validate_production_requirements()
    if config_errors:
        for error in config_errors:
            logger.warning("production_config_warning", issue=error)

        # In production, critical errors should prevent startup
        if settings.is_production and settings.require_redis_in_production and not settings.redis_url:
            logger.critical("production_startup_blocked", errors=config_errors)
            raise RuntimeError(f"Production startup blocked: {', '.join(config_errors)}")

    # Log environment info
    logger.info(
        "app_startup",
        env=settings.env,
        admin_endpoints_enabled=settings.admin_endpoints_enabled,
        admin_allowed_ips=settings.admin_allowed_ips,
        admin_token_configured=bool(settings.admin_secret_token),
    )

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
