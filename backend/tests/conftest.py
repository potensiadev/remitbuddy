"""Pytest configuration and fixtures for RemitBuddy tests."""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

# Import will be available after Step 7 implementation
# from main import app


@pytest.fixture
def anyio_backend():
    """Use asyncio for async tests."""
    return "asyncio"


# Uncomment after Step 7
# @pytest_asyncio.fixture
# async def client():
#     """Create async test client."""
#     async with AsyncClient(
#         transport=ASGITransport(app=app),
#         base_url="http://test"
#     ) as ac:
#         yield ac
