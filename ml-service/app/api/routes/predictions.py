from __future__ import annotations

import csv
import logging
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Query, status
from pydantic import BaseModel

from app.core.config import settings
from app.core.errors import sanitized_error
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
        start_time = datetime.now(timezone.utc)

        predictor = Predictor()
        result = predictor.predict(model_name=settings.MODEL_NAME, input_data=request.input_data)

        processing_time = (datetime.now(timezone.utc) - start_time).total_seconds()
        logger.info("Successfully completed prediction. Processing time: %.2fs", processing_time)

        return PredictionResponse(
            prediction=result,
            timestamp=datetime.now(timezone.utc).isoformat(),
            processing_time=processing_time,
        )
    except Exception:
        logger.exception("Error processing prediction")
        sanitized_error(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, public_message="Prediction failed")


@router.get("/recommendations/{user_id}")
async def get_recommendations(
    user_id: str,
    limit: int = Query(default=10, ge=1, le=50),
) -> Dict[str, Any]:
    try:
        start_time = datetime.now(timezone.utc)
        predictor = Predictor()
        result = predictor.predict(model_name="recommender", input_data={"user_id": user_id, "limit": limit})
        processing_time = (datetime.now(timezone.utc) - start_time).total_seconds()
        recommendations = result if isinstance(result, list) else result.get("items", [])
        return {
            "user_id": user_id,
            "recommendations": recommendations[:limit],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "processing_time": processing_time,
        }
    except Exception:
        logger.exception("Error in get_recommendations")
        sanitized_error(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, public_message="Recommendations lookup failed")


@router.get("/analytics")
async def get_analytics() -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return {
            "panorama": panorama(inter, items),
            "priorities": priorities(inter, items),
        }
    except Exception:
        logger.exception("Error in get_analytics")
        sanitized_error(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, public_message="Analytics lookup failed")


@router.get("/profile/{user_id}")
async def get_profile(user_id: str) -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return user_affinity(inter, items, user_id)
    except Exception:
        logger.exception("Error in get_profile")
        sanitized_error(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, public_message="Profile lookup failed")


@router.get("/also-liked/{item_id}")
async def get_also_liked(item_id: str) -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return {"item_id": item_id, "also_liked": cross_suggestions(inter, items, item_id)}
    except Exception:
        logger.exception("Error in get_also_liked")
        sanitized_error(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, public_message="Cross-suggestions lookup failed")


class Interaction(BaseModel):
    user_id: str
    item_id: str
    score: float = 1.0


_CSV_FORMULA_PREFIXES = ("=", "+", "-", "@", "\t", "\r", "\u00ef")


def _sanitize_csv_cell(value: str) -> str:
    """Neutralize spreadsheet formula injection in CSV cells."""
    if value.startswith(_CSV_FORMULA_PREFIXES):
        return "'" + value
    return value


@router.post("/interactions")
async def add_interaction(interaction: Interaction) -> Dict[str, Any]:
    try:
        path = "app/data/interactions.csv"
        with open(path, "a", encoding="utf-8", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([
                interaction.user_id,
                _sanitize_csv_cell(interaction.item_id),
                interaction.score,
            ])
        return {"success": True}
    except Exception:
        logger.exception("Error appending interaction")
        sanitized_error(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, public_message="Failed to record interaction")
