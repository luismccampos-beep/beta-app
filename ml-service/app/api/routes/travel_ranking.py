"""Wikivoyage destination ranking via content embeddings."""

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import joblib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/travel", tags=["travel-ranking"])

_model = None
_model_mtime: float | None = None


class TravelRankCandidate(BaseModel):
    item_id: Optional[str] = None
    destino_id: Optional[int] = None
    iata: Optional[str] = None
    lang: Optional[str] = "pt"
    nome: Optional[str] = None


class TravelRankRequest(BaseModel):
    preferences: Dict[str, Any] = Field(default_factory=dict)
    candidates: List[TravelRankCandidate] = Field(default_factory=list)
    limit: int = Field(default=20, ge=1, le=200)


class TravelRankItem(BaseModel):
    id: str
    destino_id: Optional[int] = None
    iata: Optional[str] = None
    nome: Optional[str] = None
    score: float
    confidence: float
    rank: int
    method: str = "embedding"


class TravelRankResponse(BaseModel):
    success: bool
    rankings: List[TravelRankItem]
    model_loaded: bool
    processing_time: float
    timestamp: str


def _model_path() -> str:
    return os.environ.get(
        "ML_SERVICE_DESTINATION_MODEL_PATH",
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "models",
            "trained",
            "destination_embeddings.pkl",
        ),
    )


def _load_model():
    global _model, _model_mtime
    path = os.path.normpath(_model_path())
    if not os.path.exists(path):
        return None
    mtime = os.path.getmtime(path)
    if _model is not None and _model_mtime == mtime:
        return _model
    try:
        _model = joblib.load(path)
        _model_mtime = mtime
        logger.info("Loaded destination embedding model from %s", path)
        return _model
    except Exception as e:
        logger.error("Failed to load destination model: %s", e)
        return None


@router.get("/rank/health")
async def travel_rank_health():
    model = _load_model()
    path = os.path.normpath(_model_path())
    return {
        "ok": model is not None,
        "model_path": path,
        "model_exists": os.path.exists(path),
        "items": len(model.item_ids) if model else 0,
    }


@router.post("/rank", response_model=TravelRankResponse)
async def rank_destinations(body: TravelRankRequest):
    start = datetime.now(timezone.utc)
    model = _load_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Destination embedding model not trained. Run: npm run travel:ml:train",
        )

    candidates = [c.model_dump(exclude_none=True) for c in body.candidates]
    raw = model.rank(
        body.preferences,
        candidates=candidates if candidates else None,
        limit=body.limit,
    )

    rankings = [
        TravelRankItem(
            id=str(r["id"]),
            destino_id=r.get("destino_id"),
            iata=r.get("iata"),
            nome=r.get("nome"),
            score=float(r["score"]),
            confidence=float(r["confidence"]),
            rank=int(r["rank"]),
            method=str(r.get("method", "embedding")),
        )
        for r in raw
    ]

    elapsed = (datetime.now(timezone.utc) - start).total_seconds()
    return TravelRankResponse(
        success=True,
        rankings=rankings,
        model_loaded=True,
        processing_time=elapsed,
        timestamp=start.isoformat(),
    )
