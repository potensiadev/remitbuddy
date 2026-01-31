"""Admin routes for RemitBuddy API."""

from fastapi import APIRouter, HTTPException

import structlog

from infrastructure.proxy.manager import proxy_manager
from services.circuit_breaker import circuit_registry

logger = structlog.get_logger(__name__)

router = APIRouter()


# Circuit Breaker endpoints
@router.get(
    "/circuit-breaker/stats",
    summary="Get circuit breaker statistics",
    description="Returns statistics for all provider circuit breakers",
)
async def get_circuit_breaker_stats():
    """Get circuit breaker statistics for all providers."""
    return {
        "circuit_breakers": circuit_registry.get_all_stats(),
    }


@router.post(
    "/circuit-breaker/reset/{provider_name}",
    summary="Reset circuit breaker",
    description="Reset a specific provider's circuit breaker to closed state",
)
async def reset_circuit_breaker(provider_name: str):
    """Reset a provider's circuit breaker."""
    if circuit_registry.reset(provider_name):
        logger.info("circuit_breaker_reset", provider=provider_name)
        return {"message": f"Circuit breaker for {provider_name} has been reset"}
    raise HTTPException(status_code=404, detail=f"Circuit breaker for {provider_name} not found")


@router.post(
    "/circuit-breaker/reset-all",
    summary="Reset all circuit breakers",
    description="Reset all provider circuit breakers to closed state",
)
async def reset_all_circuit_breakers():
    """Reset all circuit breakers."""
    circuit_registry.reset_all()
    logger.info("all_circuit_breakers_reset")
    return {"message": "All circuit breakers have been reset"}


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
