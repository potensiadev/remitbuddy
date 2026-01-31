"""Base provider abstract class."""

from abc import ABC, abstractmethod
from typing import Dict, Optional

import aiohttp
import structlog

from services.circuit_breaker import circuit_registry, CircuitState

logger = structlog.get_logger(__name__)


class BaseProvider(ABC):
    """Abstract base class for all remittance providers."""

    name: str = "BaseProvider"
    link: str = ""

    # Circuit breaker settings (can be overridden by subclasses)
    failure_threshold: int = 5
    recovery_timeout: int = 60

    @property
    def circuit_breaker(self):
        """Get or create circuit breaker for this provider."""
        return circuit_registry.get_or_create(
            self.name,
            failure_threshold=self.failure_threshold,
            recovery_timeout=self.recovery_timeout,
        )

    async def get_quote_with_circuit_breaker(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """
        Fetch a quote with circuit breaker protection.

        This method wraps get_quote() with circuit breaker logic.
        """
        cb = self.circuit_breaker

        # Check if circuit is available
        if not cb.is_available():
            self._log_debug(
                "circuit_breaker_blocked",
                state=cb.state.value,
            )
            return None

        try:
            result = await self.get_quote(
                session, send_amount, receive_currency, receive_country
            )

            if result is not None:
                cb.record_success()
            else:
                # None result is treated as a failure for circuit breaker
                # but only if it's not due to unsupported country/currency
                # We'll let individual providers handle this distinction
                pass

            return result

        except Exception as e:
            cb.record_failure()
            self._log_error(e)
            return None

    @abstractmethod
    async def get_quote(
        self,
        session: aiohttp.ClientSession,
        send_amount: int,
        receive_currency: str,
        receive_country: str,
    ) -> Optional[Dict]:
        """
        Fetch a quote from the provider.

        Args:
            session: aiohttp client session
            send_amount: Amount to send in KRW
            receive_currency: Currency code to receive (e.g., VND, PHP)
            receive_country: Country name to receive in (e.g., vietnam, philippines)

        Returns:
            Quote dict with provider, exchange_rate, fee, recipient_gets, link
            or None if the provider doesn't support this route or an error occurs
        """
        pass

    def _build_result(
        self,
        exchange_rate: float,
        fee: float,
        recipient_gets: float,
    ) -> Dict:
        """Build a standardized quote result."""
        return {
            "provider": self.name,
            "exchange_rate": exchange_rate,
            "fee": fee,
            "recipient_gets": recipient_gets,
            "link": self.link,
        }

    def _log_error(self, error: Exception) -> None:
        """Log an error with provider context."""
        logger.error(
            "provider_error",
            provider=self.name,
            error_type=type(error).__name__,
            error_message=str(error),
        )

    def _log_debug(self, message: str, **kwargs) -> None:
        """Log a debug message with provider context."""
        logger.debug(message, provider=self.name, **kwargs)

    def _log_info(self, message: str, **kwargs) -> None:
        """Log an info message with provider context."""
        logger.info(message, provider=self.name, **kwargs)
