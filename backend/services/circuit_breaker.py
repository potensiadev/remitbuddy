"""Circuit Breaker implementation for provider resilience."""

import time
from enum import Enum
from typing import Dict, Optional, Callable, Any
from dataclasses import dataclass, field

import structlog

logger = structlog.get_logger(__name__)


class CircuitState(Enum):
    """Circuit breaker states."""
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing fast, no requests allowed
    HALF_OPEN = "half_open"  # Testing if service recovered


@dataclass
class CircuitStats:
    """Statistics for a circuit breaker."""
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    consecutive_failures: int = 0
    last_failure_time: float = 0
    last_success_time: float = 0
    state_changed_at: float = field(default_factory=time.time)

    @property
    def success_rate(self) -> float:
        """Calculate success rate percentage."""
        if self.total_requests == 0:
            return 100.0
        return (self.successful_requests / self.total_requests) * 100


class CircuitBreaker:
    """
    Circuit Breaker for a single provider.

    States:
    - CLOSED: Normal operation, requests pass through
    - OPEN: Requests fail immediately (after failure_threshold consecutive failures)
    - HALF_OPEN: Allow one test request after recovery_timeout
    """

    def __init__(
        self,
        name: str,
        failure_threshold: int = 5,
        recovery_timeout: int = 60,
        half_open_max_calls: int = 1,
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max_calls = half_open_max_calls

        self._state = CircuitState.CLOSED
        self._stats = CircuitStats()
        self._half_open_calls = 0

    @property
    def state(self) -> CircuitState:
        """Get current state, checking for automatic transitions."""
        if self._state == CircuitState.OPEN:
            # Check if recovery timeout has passed
            if time.time() - self._stats.state_changed_at >= self.recovery_timeout:
                self._transition_to(CircuitState.HALF_OPEN)
        return self._state

    @property
    def stats(self) -> CircuitStats:
        """Get current statistics."""
        return self._stats

    def _transition_to(self, new_state: CircuitState) -> None:
        """Transition to a new state."""
        old_state = self._state
        self._state = new_state
        self._stats.state_changed_at = time.time()

        if new_state == CircuitState.HALF_OPEN:
            self._half_open_calls = 0

        logger.info(
            "circuit_breaker_state_change",
            provider=self.name,
            old_state=old_state.value,
            new_state=new_state.value,
        )

    def is_available(self) -> bool:
        """Check if requests are allowed."""
        current_state = self.state

        if current_state == CircuitState.CLOSED:
            return True
        elif current_state == CircuitState.OPEN:
            return False
        else:  # HALF_OPEN
            return self._half_open_calls < self.half_open_max_calls

    def record_success(self) -> None:
        """Record a successful request."""
        self._stats.total_requests += 1
        self._stats.successful_requests += 1
        self._stats.consecutive_failures = 0
        self._stats.last_success_time = time.time()

        current_state = self.state

        if current_state == CircuitState.HALF_OPEN:
            # Success in half-open state, close the circuit
            self._transition_to(CircuitState.CLOSED)
            logger.info(
                "circuit_breaker_recovered",
                provider=self.name,
            )

    def record_failure(self) -> None:
        """Record a failed request."""
        self._stats.total_requests += 1
        self._stats.failed_requests += 1
        self._stats.consecutive_failures += 1
        self._stats.last_failure_time = time.time()

        current_state = self.state

        if current_state == CircuitState.HALF_OPEN:
            self._half_open_calls += 1
            # Failure in half-open state, reopen the circuit
            self._transition_to(CircuitState.OPEN)
            logger.warning(
                "circuit_breaker_reopened",
                provider=self.name,
            )
        elif current_state == CircuitState.CLOSED:
            if self._stats.consecutive_failures >= self.failure_threshold:
                self._transition_to(CircuitState.OPEN)
                logger.warning(
                    "circuit_breaker_opened",
                    provider=self.name,
                    consecutive_failures=self._stats.consecutive_failures,
                )

    def get_stats_dict(self) -> Dict[str, Any]:
        """Get statistics as a dictionary."""
        return {
            "name": self.name,
            "state": self.state.value,
            "total_requests": self._stats.total_requests,
            "successful_requests": self._stats.successful_requests,
            "failed_requests": self._stats.failed_requests,
            "success_rate": f"{self._stats.success_rate:.1f}%",
            "consecutive_failures": self._stats.consecutive_failures,
            "failure_threshold": self.failure_threshold,
            "recovery_timeout": self.recovery_timeout,
        }


class CircuitBreakerRegistry:
    """Registry to manage circuit breakers for all providers."""

    def __init__(
        self,
        default_failure_threshold: int = 5,
        default_recovery_timeout: int = 60,
    ):
        self._breakers: Dict[str, CircuitBreaker] = {}
        self._default_failure_threshold = default_failure_threshold
        self._default_recovery_timeout = default_recovery_timeout

    def get_or_create(
        self,
        name: str,
        failure_threshold: Optional[int] = None,
        recovery_timeout: Optional[int] = None,
    ) -> CircuitBreaker:
        """Get existing circuit breaker or create a new one."""
        if name not in self._breakers:
            self._breakers[name] = CircuitBreaker(
                name=name,
                failure_threshold=failure_threshold or self._default_failure_threshold,
                recovery_timeout=recovery_timeout or self._default_recovery_timeout,
            )
        return self._breakers[name]

    def get(self, name: str) -> Optional[CircuitBreaker]:
        """Get circuit breaker by name."""
        return self._breakers.get(name)

    def get_all_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics for all circuit breakers."""
        return {
            name: breaker.get_stats_dict()
            for name, breaker in self._breakers.items()
        }

    def reset(self, name: str) -> bool:
        """Reset a circuit breaker to closed state."""
        breaker = self._breakers.get(name)
        if breaker:
            breaker._transition_to(CircuitState.CLOSED)
            breaker._stats = CircuitStats()
            return True
        return False

    def reset_all(self) -> None:
        """Reset all circuit breakers."""
        for name in self._breakers:
            self.reset(name)


# Global registry instance
circuit_registry = CircuitBreakerRegistry(
    default_failure_threshold=5,
    default_recovery_timeout=60,
)
