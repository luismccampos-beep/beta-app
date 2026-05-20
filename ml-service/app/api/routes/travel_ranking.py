"""Wikivoyage destination ranking via content embeddings."""

from __future__ import annotations

import logging
import os
import threading
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import joblib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/travel", tags=["travel-ranking"])

_model = None
_model_mtime: float | None = None
_model_lock = threading.Lock()


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


def _model_path() -> Path:
    override = os.environ.get("ML_SERVICE_DESTINATION_MODEL_PATH")
    if override:
        return Path(override).expanduser().resolve()

    return (
        Path(__file__).resolve().parent.parent
        / "models"
        / "trained"
        / "destination_embeddings.pkl"
    )


def _load_model():
    global _model, _model_mtime
    path = _model_path()
    if not path.exists():
        return None

    mtime = path.stat().st_mtime
    if _model is not None and _model_mtime == mtime:
        return _model

    with _model_lock:
        # Re-check after acquiring lock (avoid double loads under concurrency).
        mtime = path.stat().st_mtime
        if _model is not None and _model_mtime == mtime:
            return _model

        try:
            _model = joblib.load(str(path))
            _model_mtime = mtime
            logger.info("Loaded destination embedding model from %s", str(path))
            return _model
        except Exception as e:
            logger.error("Failed to load destination model: %s", e)
            return None


@router.get("/rank/health")
async def travel_rank_health():
    model = _load_model()
    path = _model_path()
    return {
        "ok": model is not None,
        "model_path": str(path),
        "model_exists": path.exists(),
        "items": len(model.item_ids) if model else 0,
    }


@router.post("/rank", response_model=TravelRankResponse)
async def rank_destinations(body: TravelRankRequest):
    started_at = datetime.now(timezone.utc)
    t0 = time.perf_counter()
    model = _load_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Destination embedding model not trained. Run: npm run travel:ml:train",
        )

    candidates = [c.model_dump(exclude_none=True) for c in body.candidates]
    try:
        raw = model.rank(
            body.preferences,
            candidates=candidates if candidates else None,
            limit=body.limit,
        )
    except Exception:
        logger.exception(
            "Destination ranking failed (candidates=%d, limit=%d)",
            len(candidates),
            body.limit,
        )
        raise HTTPException(status_code=500, detail="Ranking failed")

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

    elapsed = time.perf_counter() - t0
    logger.info(
        "Destination rank: candidates=%d limit=%d elapsed=%.4fs returned=%d",
        len(candidates),
        body.limit,
        elapsed,
        len(rankings),
    )
    return TravelRankResponse(
        success=True,
        rankings=rankings,
        model_loaded=True,
        processing_time=elapsed,
        timestamp=started_at.isoformat(),
    )
