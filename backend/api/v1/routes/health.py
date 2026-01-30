"""Health check routes for RemitBuddy API."""

import time
from datetime import datetime

import psutil
from fastapi import APIRouter
from fastapi.responses import JSONResponse

import structlog

from services.cache_service import cache_service
from infrastructure.proxy.manager import proxy_manager

logger = structlog.get_logger(__name__)

router = APIRouter()


@router.get(
    "/health",
    summary="Basic health check",
    description="Returns basic health status of the service",
)
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "remitbuddy-api",
        "version": "1.0.0",
    }


@router.get(
    "/health/detailed",
    summary="Detailed health check",
    description="Returns detailed health status including system metrics",
)
async def detailed_health_check():
    """Detailed health check with system metrics."""
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    proxy_stats = proxy_manager.get_proxy_stats()
    active_proxies = len([p for p in proxy_manager.proxies if p.is_active])

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "remitbuddy-api",
        "version": "1.0.0",
        "system": {
            "cpu_percent": cpu_percent,
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
            },
            "disk": {
                "total": disk.total,
                "free": disk.free,
                "percent": (disk.used / disk.total) * 100,
            },
        },
        "proxies": {
            "total": len(proxy_manager.proxies),
            "active": active_proxies,
            "stats": proxy_stats,
        },
        "cache": {
            "size": cache_service.size,
            "max_size": cache_service.maxsize,
        },
    }


@router.get(
    "/health/ready",
    summary="Readiness check",
    description="Check if service is ready to accept traffic",
)
async def readiness_check():
    """Readiness check - checks if service can handle traffic."""
    try:
        if not proxy_manager.proxies:
            return JSONResponse(
                status_code=503,
                content={
                    "status": "not_ready",
                    "reason": "No proxies configured",
                    "timestamp": datetime.utcnow().isoformat(),
                },
            )

        active_proxies = [p for p in proxy_manager.proxies if p.is_active]
        if not active_proxies:
            return JSONResponse(
                status_code=503,
                content={
                    "status": "not_ready",
                    "reason": "No active proxies available",
                    "timestamp": datetime.utcnow().isoformat(),
                },
            )

        return {
            "status": "ready",
            "timestamp": datetime.utcnow().isoformat(),
            "active_proxies": len(active_proxies),
        }

    except Exception as e:
        logger.error("readiness_check_failed", error=str(e))
        return JSONResponse(
            status_code=503,
            content={
                "status": "not_ready",
                "reason": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            },
        )


@router.get(
    "/health/live",
    summary="Liveness check",
    description="Check if service is alive and responsive",
)
async def liveness_check():
    """Liveness check - checks if service is alive."""
    try:
        start_time = time.time()

        # Simple cache access test
        test_key = "health_check_test"
        cache_service.set(test_key, {"test": True})
        _ = cache_service.get(test_key)

        response_time = (time.time() - start_time) * 1000

        return {
            "status": "alive",
            "timestamp": datetime.utcnow().isoformat(),
            "response_time_ms": response_time,
        }

    except Exception as e:
        logger.error("liveness_check_failed", error=str(e))
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "reason": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            },
        )
