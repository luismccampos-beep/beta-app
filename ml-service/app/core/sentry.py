"""
Sentry integration for the ML service FastAPI.
Initializes Sentry SDK for distributed tracing across Next.js ↔ ML service.

Architecture:
    Next.js (Sentry JS SDK)           ML Service (Sentry Python SDK)
            │                                     │
            ├── sentry-trace ──────────────────►  │
            ├── baggage      ──────────────────►  │
            │                                     │
    Auto-propagated via fetch          Picked up by SentryAsgiMiddleware
"""

import os
import logging

logger = logging.getLogger(__name__)


def init_sentry() -> None:
    """Initialize Sentry SDK for the ML service.

    Reads SENTRY_DSN from environment (same var as Next.js).
    In production, the trace context from Next.js fetch calls
    is automatically picked up by SentryAsgiMiddleware.
    """
    dsn = os.environ.get("SENTRY_DSN", "").strip()
    if not dsn:
        logger.info("Sentry DSN not configured — tracing disabled")
        return

    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.starlette import StarletteIntegration

        traces_sample_rate = float(os.environ.get("SENTRY_TRACES_SAMPLE_RATE", "0.2"))

        sentry_sdk.init(
            dsn=dsn,
            traces_sample_rate=traces_sample_rate,
            environment=os.environ.get("ENVIRONMENT", "development"),
            enable_tracing=True,
            integrations=[
                StarletteIntegration(transaction_style="url"),
                FastApiIntegration(transaction_style="url"),
            ],
        )

        logger.info(
            "Sentry initialized (env=%s, traces_rate=%.2f)",
            os.environ.get("ENVIRONMENT", "development"),
            traces_sample_rate,
        )
    except ImportError:
        logger.warning(
            "sentry-sdk not installed. Install with: pip install sentry-sdk[fastapi]"
        )
    except Exception as e:
        logger.error("Failed to initialize Sentry: %s", e)
