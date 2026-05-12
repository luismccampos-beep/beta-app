from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Any, List, Optional, Dict
import logging
from datetime import datetime

# Import models
from app.models.predictor import Predictor
from app.pipelines.analytics import load as load_analytics, panorama, priorities, user_affinity, cross_suggestions
from app.core.config import settings
from pydantic import BaseModel

# Logger setup
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/predictions",
    tags=["predictions"],
    responses={404: {"description": "Not found"}},
)

# Request model
class PredictionRequest(BaseModel):
    input_data: Any

# Response model
class PredictionResponse(BaseModel):
    prediction: Any
    timestamp: str
    processing_time: float

# Prediction endpoint
@router.post("/", response_model=PredictionResponse)
async def predict(request: PredictionRequest) -> PredictionResponse:
    """
    Endpoint for making predictions using the trained ML model.
    """
    try:
        # Get start time
        start_time = datetime.utcnow()
        
        # Make prediction
        predictor = Predictor()
        result = predictor.predict(model_name=settings.MODEL_NAME, input_data=request.input_data)
        
        # Calculate processing time
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        
        # Log successful prediction
        logger.info(f"Successfully completed prediction. Processing time: {processing_time:.2f}s")
        
        # Return the prediction
        return PredictionResponse(
            prediction=result,
            timestamp=datetime.utcnow().isoformat(),
            processing_time=processing_time
        )
    except Exception as e:
        # Log error
        logger.error(f"Error processing prediction: {str(e)}")
        
        # Return error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal server error", "details": str(e)}
        )

# Recommendations endpoint
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
        logger.error(f"Error in get_recommendations: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": "Internal server error", "details": str(e)})

# Analytics endpoint
@router.get("/analytics")
async def get_analytics() -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return {
            "panorama": panorama(inter, items),
            "priorities": priorities(inter, items),
        }
    except Exception as e:
        logger.error(f"Error in get_analytics: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": "Internal server error", "details": str(e)})

# User profile endpoint
@router.get("/profile/{user_id}")
async def get_profile(user_id: int) -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return user_affinity(inter, items, user_id)
    except Exception as e:
        logger.error(f"Error in get_profile: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": "Internal server error", "details": str(e)})

# Cross suggestions endpoint
@router.get("/also-liked/{item_id}")
async def get_also_liked(item_id: str) -> Dict[str, Any]:
    try:
        inter, items = load_analytics("app/data/interactions.csv", "app/data/items.csv")
        return {"item_id": item_id, "also_liked": cross_suggestions(inter, items, item_id)}
    except Exception as e:
        logger.error(f"Error in get_also_liked: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": "Internal server error", "details": str(e)})
# Persist interaction endpoint (simple CSV append)
class Interaction(BaseModel):
    user_id: int
    item_id: str
    score: float = 1.0

@router.post("/interactions")
async def add_interaction(interaction: Interaction) -> Dict[str, Any]:
    try:
        path = "app/data/interactions.csv"
        # Append line to CSV for incremental ETL
        with open(path, "a") as f:
            f.write(f"\n{interaction.user_id},{interaction.item_id},{interaction.score}")
        return {"success": True}
    except Exception as e:
        logger.error(f"Error appending interaction: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": "Internal server error", "details": str(e)})