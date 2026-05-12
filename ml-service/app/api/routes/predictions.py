from __future__ import annotations

import logging
from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.config import settings
from app.models.predictor import Predictor
from app.pipelines.analytics import (
    cross_suggestions,
    load as load_analytics,
    panorama,
    priorities,
    user_affinity,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/predictions",
    tags=["predictions"],
    responses={404: {"description": "Not found"}},
)


class PredictionRequest(BaseModel):
    input_data: Any


class PredictionResponse(BaseModel):
    prediction: Any
    timestamp: str
    processing_time: float


@router.post("/", response_model=PredictionResponse)
async def predict(request: PredictionRequest) -> PredictionResponse:
    try:
        start_time = datetime.utcnow()

        predictor = Predictor()
        result = predictor.predict(model_name=settings.MODEL_NAME, input_data=request.input_data)

        processing_time = (datetime.utcnow() - start_time).total_seconds()
        logger.info("Successfully completed prediction. Processing time: %.2fs", processing_time)

        return PredictionResponse(
            prediction=result,
            timestamp=datetime.utcnow().isoformat(),
            processing_time=processing_time,
        )
    except Exception as e:
        logger.error("Error processing prediction: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal server error", "details": str(e)},
        )


@router.get("/recommendations/{user_id}")
async def get_recommendations(user_id: int, limit: int = 10) -> Dict[str, Any]:
    try:
        start_time = datetime.utcnow()
        predictor = Predictor()
        result = predictor.predict(model_name="recommender", input_data={"user_id": user_id, "limit": limit})
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        recommendations = result if isinstance(result, list) else result.get("items", [])
        return {
            "user_id": user_id,
            "recommendations": recommendations[:limit],
            "timestamp": datetime.utcnow().isoformat(),
            "processing_time": processing_time,
        }
    except Exception as e:
        logger.error("Error in get_recommendations: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal server error", "details": str(e)},
        )


@router.get("/analytics")
async def get_analytics() -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return {
            "panorama": panorama(inter, items),
            "priorities": priorities(inter, items),
        }
    except Exception as e:
        logger.error("Error in get_analytics: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal server error", "details": str(e)},
        )


@router.get("/profile/{user_id}")
async def get_profile(user_id: int) -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return user_affinity(inter, items, user_id)
    except Exception as e:
        logger.error("Error in get_profile: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal server error", "details": str(e)},
        )


@router.get("/also-liked/{item_id}")
async def get_also_liked(item_id: str) -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return {"item_id": item_id, "also_liked": cross_suggestions(inter, items, item_id)}
    except Exception as e:
        logger.error("Error in get_also_liked: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal server error", "details": str(e)},
        )


class Interaction(BaseModel):
    user_id: int
    item_id: str
    score: float = 1.0


@router.post("/interactions")
async def add_interaction(interaction: Interaction) -> Dict[str, Any]:
    try:
        path = "app/data/interactions.csv"
        with open(path, "a", encoding="utf-8") as f:
            f.write(f"\n{interaction.user_id},{interaction.item_id},{interaction.score}")
        return {"success": True}
    except Exception as e:
        logger.error("Error appending interaction: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal server error", "details": str(e)},
        )
