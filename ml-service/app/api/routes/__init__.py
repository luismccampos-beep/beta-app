"""
API Routes
Router principal com todas as rotas da API ML Service
"""

from fastapi import APIRouter, Depends
from typing import List
import logging

from app.api.deps import require_api_key

logger = logging.getLogger(__name__)

# Import routers específicos
try:
    from .rag import router as rag_router
    from .personalization import router as personalization_router
    from .xai import router as xai_router
    from .unified import router as unified_router
    from .recommendations import router as recommendations_router
    from .chat import router as chat_router
    from .travel_ranking import router as travel_ranking_router
    ADVANCED_ROUTES_AVAILABLE = True
except ImportError as e:
    logger.warning("Advanced routes not available: %s", e)
    rag_router = None
    personalization_router = None
    xai_router = None
    unified_router = None
    recommendations_router = None
    chat_router = None
    travel_ranking_router = None
    ADVANCED_ROUTES_AVAILABLE = False

try:
    from .travel_distance import router as travel_distance_router
except ImportError as e:
    logger.warning("Travel distance routes not available: %s", e)
    travel_distance_router = None

try:
    from .validate_image import router as validate_image_router
except ImportError as e:
    logger.warning("Validate image routes not available: %s", e)
    validate_image_router = None

# Import router de predictions (sempre deve existir)
try:
    from .predictions import router as predictions_router
except ImportError as e:
    logger.warning("Predictions routes not available: %s", e)
    predictions_router = APIRouter()

# Criar router principal — every route mounted below requires the API key.
api_router = APIRouter(dependencies=[Depends(require_api_key)])

# Backward-compat export: some modules import `router` from this package
router = api_router

# Incluir rotas de predictions (sempre disponível)
api_router.include_router(predictions_router)

# Incluir rotas avançadas se disponíveis
if ADVANCED_ROUTES_AVAILABLE:
    if recommendations_router:
        api_router.include_router(recommendations_router)
    if chat_router:
        api_router.include_router(chat_router)
    if personalization_router:
        api_router.include_router(personalization_router)
    if rag_router:
        api_router.include_router(rag_router)
    if xai_router:
        api_router.include_router(xai_router)
    if unified_router:
        api_router.include_router(unified_router)
    if travel_ranking_router:
        api_router.include_router(travel_ranking_router)
    if travel_distance_router:
        api_router.include_router(travel_distance_router)
    if validate_image_router:
        api_router.include_router(validate_image_router)

# Export para compatibilidade
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
    "validate_image_router"
]
