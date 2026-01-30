"""Prometheus metrics for RemitBuddy API."""

from prometheus_client import Counter, Histogram, Gauge, Info, REGISTRY
from prometheus_client.exposition import generate_latest, CONTENT_TYPE_LATEST

import structlog

logger = structlog.get_logger(__name__)

# Request metrics
REQUEST_COUNT = Counter(
    "remitbuddy_requests_total",
    "Total number of requests",
    ["endpoint", "method", "status_code"],
)

REQUEST_LATENCY = Histogram(
    "remitbuddy_request_latency_seconds",
    "Request latency in seconds",
    ["endpoint"],
    buckets=[0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0],
)

# Quote metrics
QUOTE_REQUESTS = Counter(
    "remitbuddy_quote_requests_total",
    "Total number of quote requests",
    ["country", "currency"],
)

QUOTE_LATENCY = Histogram(
    "remitbuddy_quote_latency_seconds",
    "Quote fetch latency in seconds",
    ["country", "currency"],
    buckets=[0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0],
)

QUOTE_CACHE_HITS = Counter(
    "remitbuddy_quote_cache_hits_total",
    "Total number of cache hits for quotes",
    ["cache_layer"],  # l1, l2
)

QUOTE_CACHE_MISSES = Counter(
    "remitbuddy_quote_cache_misses_total",
    "Total number of cache misses for quotes",
)

# Provider metrics
PROVIDER_REQUESTS = Counter(
    "remitbuddy_provider_requests_total",
    "Total number of requests per provider",
    ["provider", "status"],  # status: success, failure, circuit_open
)

PROVIDER_LATENCY = Histogram(
    "remitbuddy_provider_latency_seconds",
    "Provider response latency in seconds",
    ["provider"],
    buckets=[0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0],
)

PROVIDER_SUCCESS_RATE = Gauge(
    "remitbuddy_provider_success_rate",
    "Current success rate per provider (0-100)",
    ["provider"],
)

# Circuit breaker metrics
CIRCUIT_BREAKER_STATE = Gauge(
    "remitbuddy_circuit_breaker_state",
    "Circuit breaker state (0=closed, 1=open, 2=half_open)",
    ["provider"],
)

CIRCUIT_BREAKER_TRIPS = Counter(
    "remitbuddy_circuit_breaker_trips_total",
    "Total number of circuit breaker trips (closed->open)",
    ["provider"],
)

# System info
APP_INFO = Info(
    "remitbuddy_app",
    "RemitBuddy application information",
)


def init_metrics(version: str = "1.0.0", env: str = "development") -> None:
    """Initialize application info metrics."""
    APP_INFO.info({
        "version": version,
        "environment": env,
    })
    logger.info("metrics_initialized", version=version, env=env)


def get_metrics() -> bytes:
    """Generate Prometheus metrics output."""
    return generate_latest(REGISTRY)


def get_metrics_content_type() -> str:
    """Get the content type for Prometheus metrics."""
    return CONTENT_TYPE_LATEST


# Helper functions for recording metrics
def record_request(endpoint: str, method: str, status_code: int) -> None:
    """Record a request metric."""
    REQUEST_COUNT.labels(
        endpoint=endpoint,
        method=method,
        status_code=str(status_code),
    ).inc()


def record_request_latency(endpoint: str, latency: float) -> None:
    """Record request latency."""
    REQUEST_LATENCY.labels(endpoint=endpoint).observe(latency)


def record_quote_request(country: str, currency: str) -> None:
    """Record a quote request."""
    QUOTE_REQUESTS.labels(country=country, currency=currency).inc()


def record_quote_latency(country: str, currency: str, latency: float) -> None:
    """Record quote fetch latency."""
    QUOTE_LATENCY.labels(country=country, currency=currency).observe(latency)


def record_cache_hit(layer: str) -> None:
    """Record a cache hit."""
    QUOTE_CACHE_HITS.labels(cache_layer=layer).inc()


def record_cache_miss() -> None:
    """Record a cache miss."""
    QUOTE_CACHE_MISSES.inc()


def record_provider_request(provider: str, success: bool) -> None:
    """Record a provider request."""
    status = "success" if success else "failure"
    PROVIDER_REQUESTS.labels(provider=provider, status=status).inc()


def record_provider_circuit_open(provider: str) -> None:
    """Record when a request is blocked by open circuit."""
    PROVIDER_REQUESTS.labels(provider=provider, status="circuit_open").inc()


def record_provider_latency(provider: str, latency: float) -> None:
    """Record provider response latency."""
    PROVIDER_LATENCY.labels(provider=provider).observe(latency)


def update_provider_success_rate(provider: str, rate: float) -> None:
    """Update provider success rate gauge."""
    PROVIDER_SUCCESS_RATE.labels(provider=provider).set(rate)


def update_circuit_breaker_state(provider: str, state: str) -> None:
    """Update circuit breaker state gauge."""
    state_map = {"closed": 0, "open": 1, "half_open": 2}
    CIRCUIT_BREAKER_STATE.labels(provider=provider).set(state_map.get(state, 0))


def record_circuit_breaker_trip(provider: str) -> None:
    """Record a circuit breaker trip (closed->open)."""
    CIRCUIT_BREAKER_TRIPS.labels(provider=provider).inc()
