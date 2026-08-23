"""Sanitized error handling for FastAPI routes.

All routes must use :func:`sanitized_error` instead of passing raw
exception messages to ``HTTPException.detail``.  Internal details are
logged server-side but never leaked to callers.
"""

from __future__ import annotations

from fastapi import HTTPException
from typing import NoReturn


def sanitized_error(
    status_code: int,
    public_message: str,
    *,
    logger=None,
    exc_info: bool = True,
) -> NoReturn:
    """Raise an ``HTTPException`` with a user-safe message.

    The caller should already have logged the full exception via
    ``logger.exception(...)`` before calling this helper.  Only the
    *public_message* is exposed in the HTTP response body.
    """
    if logger is not None:
        logger.error(
            "Returning HTTP %s to caller: %s",
            status_code,
            public_message,
            exc_info=exc_info,
        )

    raise HTTPException(status_code=status_code, detail=public_message)