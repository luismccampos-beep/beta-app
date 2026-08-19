"""
Shared FastAPI dependencies.

Enforces API-key authentication for every route mounted on the main API
router. The whole service is meant to be called only by the AKMLEVA backend,
which sends the key in the ``x-api-key`` header.
"""

import secrets

from fastapi import Header, HTTPException, status

from app.core.config import settings


async def require_api_key(
    x_api_key: str | None = Header(default=None),
) -> None:
    """Validate the shared API key (constant-time comparison).

    - If ``ML_SERVICE_API_KEY`` is configured, a matching ``x-api-key``
      header is required.
    - If it is not configured, requests are allowed in non-production
      environments (local dev) and rejected in production (fail closed).
    """
    configured = settings.API_KEY

    if not configured:
        if settings.ENVIRONMENT.lower() == "production":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ML_SERVICE_API_KEY is not configured",
            )
        return

    if not x_api_key or not secrets.compare_digest(x_api_key, configured):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
