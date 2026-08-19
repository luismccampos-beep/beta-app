"""Shared test configuration.

Enables API-key auth for all endpoint tests: the API router is protected by
``require_api_key``, so tests must send the matching ``x-api-key`` header.
"""

from app.core.config import settings

settings.API_KEY = "test-api-key"
settings.ENVIRONMENT = "test"