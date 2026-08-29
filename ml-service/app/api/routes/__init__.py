"""
API Routes
Router principal avec toutes les routes de l'API ML Service

DESIGN (fail fast): all routers are imported eagerly. If a route module or one
of its dependencies is broken (typo, bad merge, missing optional dep), the
service refuses to start with a loud traceback instead of booting with that
feature surface silently missing. A missing feature shows up to clients as
mysterious 404s, which is much harder to debug than a crashed boot.
"""

import logging

from fastapi import APIRouter, Depends

from app.api.deps import require_api_key

logger = logging.getLogger(__name__)

# Import routers — eager, no try/except: a broken import must crash the boot.
from .rag import router as rag_router
from .personalization import router as personalization_router
from .xai import router as xai_router
from .unified import router as unified_router
from .recommendations import router as recommendations_router
from .chat import router as chat_router
from .travel_ranking import router as travel_ranking_router
from .travel_distance import router as travel_distance_router
from .validate_image import router as validate_image_router
from .predictions import router as predictions_router

# Router principal — every route mounted below requires the API key.
api_router = APIRouter(dependencies=[Depends(require_api_key)])

# Backward-compat export: some modules import `router` from this package
router = api_router

api_router.include_router(predictions_router)
api_router.include_router(recommendations_router)
api_router.include_router(chat_router)
api_router.include_router(personalization_router)
api_router.include_router(rag_router)
api_router.include_router(xai_router)
api_router.include_router(unified_router)
api_router.include_router(travel_ranking_router)
api_router.include_router(travel_distance_router)
api_router.include_router(validate_image_router)

# Export pour compatibilité
__all__ = [
    "router",
    "api_router",
    "predictions_router",
    "recommendations_router",
    "chat_router",
    "personalization_router",
    "rag_router",
    "xai_router",
    "unified_router",
    "travel_ranking_router",
    "travel_distance_router",
    "validate_image_router",
]
