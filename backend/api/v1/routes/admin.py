"""Admin routes for RemitBuddy API."""

from fastapi import APIRouter, HTTPException

import structlog

from infrastructure.proxy.manager import proxy_manager

logger = structlog.get_logger(__name__)

router = APIRouter()


@router.get(
    "/proxy/stats",
    summary="Get proxy statistics",
    description="Returns statistics for all configured proxies",
)
async def get_proxy_stats():
    """Get proxy statistics."""
    return {
        "proxy_count": len(proxy_manager.proxies),
        "proxy_stats": proxy_manager.get_proxy_stats(),
        "proxies": [{"ip": p.ip, "port": p.port} for p in proxy_manager.proxies],
    }


@router.post(
    "/proxy/health-check",
    summary="Run proxy health check",
    description="Execute health check on all proxies",
)
async def health_check_proxies():
    """Run health check on all proxies."""
    await proxy_manager.health_check_all_proxies()
    return {
        "message": "Health check completed",
        "stats": proxy_manager.get_proxy_stats(),
    }


@router.get(
    "/proxy/test/{proxy_ip}",
    summary="Test specific proxy",
    description="Test a specific proxy by IP address",
)
async def test_single_proxy(proxy_ip: str):
    """Test a specific proxy."""
    proxy = next((p for p in proxy_manager.proxies if p.ip == proxy_ip), None)
    if not proxy:
        raise HTTPException(status_code=404, detail="Proxy not found")

    is_working = await proxy_manager.test_proxy(proxy)
    return {
        "proxy_ip": proxy_ip,
        "is_working": is_working,
        "stats": proxy_manager.proxy_stats.get(proxy_ip, {}),
    }
