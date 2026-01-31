"""Pytest configuration and fixtures for RemitBuddy tests."""

import sys
from pathlib import Path

import pytest

# Add backend directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@pytest.fixture
def anyio_backend():
    """Use asyncio for async tests."""
    return "asyncio"
