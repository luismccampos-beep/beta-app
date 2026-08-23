"""Request correlation (``x-request-id``) middleware and logging integration.

Adds ``CorrelationMiddleware`` to FastAPI so every incoming request has a
correlation ID (preserving the header from the web frontend or generating a
new UUID v4).  The ID is also added to log records so all log lines for the
same request share it.
"""

from __future__ import annotations

import contextvars
import logging
import uuid

from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

_request_id_var: contextvars.ContextVar[str] = contextvars.ContextVar(
    "request_id", default="-"
)


class CorrelationMiddleware(BaseHTTPMiddleware):
    """Extract or generate ``x-request-id``, store it, and echo it back."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = request.headers.get(
            "x-request-id", str(uuid.uuid4())
        ).strip()
        _request_id_var.set(request_id)

        response = await call_next(request)
        response.headers["x-request-id"] = request_id
        return response


def add_correlation_middleware(app: FastAPI) -> None:
    """Install the correlation middleware on a FastAPI application."""
    app.add_middleware(CorrelationMiddleware)


def get_request_id() -> str:
    """Return the correlation ID for the current request context."""
    return _request_id_var.get()


class CorrelationFilter(logging.Filter):
    """Inject ``request_id`` into every log record."""

    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = get_request_id()  # type: ignore[attr-defined]
        return True