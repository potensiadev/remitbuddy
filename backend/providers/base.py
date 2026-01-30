"""Base provider abstract class."""

from abc import ABC, abstractmethod
from typing import Dict, Optional

import aiohttp
import structlog

logger = structlog.get_logger(__name__)


class BaseProvider(ABC):
    """Abstract base class for all remittance providers."""

    name: str = "BaseProvider"
    link: str = ""

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
