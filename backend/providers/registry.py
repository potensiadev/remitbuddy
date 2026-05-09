"""Provider registry for managing all remittance providers."""

from typing import Dict, List, Type

from providers.base import BaseProvider
from providers.hanpass import HanpassProvider
from providers.cross import CrossProvider
from providers.gmoneytrans import GmoneytransProvider
from providers.gmeremit import GmeremitProvider
from providers.jpremit import JpremitProvider
from providers.themoin import ThemoinProvider
from providers.e9pay import E9payProvider
from providers.coinshot import CoinshotProvider


class ProviderRegistry:
    """Registry for all remittance providers."""

    def __init__(self):
        self._providers: Dict[str, BaseProvider] = {}
        self._register_default_providers()

    def _register_default_providers(self) -> None:
        """Register all default providers."""
        default_providers: List[Type[BaseProvider]] = [
            HanpassProvider,
            CrossProvider,  # TODO: 개선 필요
            GmoneytransProvider,
            GmeremitProvider,
            JpremitProvider,
            ThemoinProvider,
            E9payProvider,
            CoinshotProvider,
        ]

        for provider_class in default_providers:
            self.register(provider_class())

    def register(self, provider: BaseProvider) -> None:
        """Register a provider instance."""
        self._providers[provider.name] = provider

    def unregister(self, name: str) -> None:
        """Unregister a provider by name."""
        if name in self._providers:
            del self._providers[name]

    def get(self, name: str) -> BaseProvider | None:
        """Get a provider by name."""
        return self._providers.get(name)

    def get_all(self) -> List[BaseProvider]:
        """Get all registered providers."""
        return list(self._providers.values())

    def get_names(self) -> List[str]:
        """Get names of all registered providers."""
        return list(self._providers.keys())

    def __len__(self) -> int:
        return len(self._providers)

    def __contains__(self, name: str) -> bool:
        return name in self._providers


# Global provider registry instance
provider_registry = ProviderRegistry()


def get_all_providers() -> List[BaseProvider]:
    """Get all registered providers."""
    return provider_registry.get_all()
