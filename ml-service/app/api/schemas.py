from pydantic import BaseModel
from typing import Any, List, Optional
from datetime import datetime
from app.core.config import settings

class PredictionRequest(BaseModel):
    input_data: Any

class PredictionResponse(BaseModel):
    prediction: Any
    timestamp: str
    processing_time: float

class ErrorResponse(BaseModel):
    error: str
    details: Optional[str]
    timestamp: str

class HealthCheckResponse(BaseModel):
    status: str
    time: str
    version: str