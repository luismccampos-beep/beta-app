"""Wikivoyage destination ranking via content embeddings + collaborative filtering.

Hybrid serve-time scoring:
    final = w_emb * embedding_similarity + w_cf * CF_score + w_pop * popularity

- Embedding score: TF-IDF+SVD similarity between preference document and destination docs.
- CF score: matrix-factorization factors trained on real interactions.csv
  (exported from Postgres by tools/data-pipeline/scripts/export-db-signals.mjs).
- Popularity: global interaction count rank (from recommender.pkl).

Cold start (unknown/absent user_id): pure embedding ranking, method="embedding".
Weights are env-tunable (ML_HYBRID_CF_WEIGHT, ML_HYBRID_POP_WEIGHT).
"""

from __future__ import annotations

import logging
import os
import threading
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/travel", tags=["travel-ranking"])

_model = None
_model_mtime: float | None = None
_model_lock = threading.Lock()

_cf_model = None
_cf_model_mtime: float | None = None
_cf_model_lock = threading.Lock()

_DEFAULT_CF_WEIGHT = 0.35
_DEFAULT_POP_WEIGHT = 0.10


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
    user_id: Optional[str] = Field(default=None, max_length=64)


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
        Path(__file__).resolve().parent.parent.parent
        / "models"
        / "trained"
        / "destination_embeddings.pkl"
    )


def _cf_model_path() -> Path:
    override = os.environ.get("ML_SERVICE_RECOMMENDER_MODEL_PATH")
    if override:
        return Path(override).expanduser().resolve()

    return (
        Path(__file__).resolve().parent.parent.parent
        / "models"
        / "trained"
        / "recommender.pkl"
    )


def _load_joblib_cached(path: Path, cache_attr: str, mtime_attr: str, lock: threading.Lock):
    """Shared mtime-cached joblib loader (models are trusted local artifacts)."""
    globals_state = globals()
    cached = globals_state[cache_attr]
    cached_mtime = globals_state[mtime_attr]
    if not path.exists():
        return None

    mtime = path.stat().st_mtime
    if cached is not None and cached_mtime == mtime:
        return cached

    with lock:
        # Re-check after acquiring lock (avoid double loads under concurrency).
        mtime = path.stat().st_mtime
        if cached is not None and cached_mtime == mtime:
            return cached

        try:
            # SECURITY: joblib.load can execute arbitrary code — only load
            # model artifacts you control from the trusted model path.
            loaded = joblib.load(str(path))
            globals_state[cache_attr] = loaded
            globals_state[mtime_attr] = mtime
            logger.info("Loaded model artifact from %s", str(path))
            return loaded
        except Exception as e:
            logger.error("Failed to load model artifact %s: %s", str(path), e)
            return None


def _load_model():
    return _load_joblib_cached(_model_path(), "_model", "_model_mtime", _model_lock)


def _load_cf_model():
    return _load_joblib_cached(_cf_model_path(), "_cf_model", "_cf_model_mtime", _cf_model_lock)


def _env_weight(name: str, default: float) -> float:
    try:
        value = float(os.environ.get(name, ""))
    except ValueError:
        return default
    return value if 0.0 <= value <= 1.0 else default


def _minmax(scores: np.ndarray) -> np.ndarray:
    lo = float(scores.min())
    hi = float(scores.max())
    if hi - lo < 1e-9:
        return np.zeros_like(scores)
    return (scores - lo) / (hi - lo)


def _popularity_lookup(cf_model) -> Dict[str, float]:
    popular = getattr(cf_model, "popular", None) or []
    total = max(len(popular), 1)
    return {str(entry.get("id")): 1.0 - (pos / total) for pos, entry in enumerate(popular)}


def _apply_hybrid(
    cf_model,
    emb_items: List[Dict[str, Any]],
    user_id: str,
    limit: int,
) -> List[Dict[str, Any]]:
    """Blend embedding scores with CF factors + popularity for a known user."""
    if not emb_items:
        return []

    w_cf = _env_weight("ML_HYBRID_CF_WEIGHT", _DEFAULT_CF_WEIGHT)
    w_pop = _env_weight("ML_HYBRID_POP_WEIGHT", _DEFAULT_POP_WEIGHT)
    w_emb = max(0.05, 1.0 - w_cf - w_pop)

    ids = [str(item["id"]) for item in emb_items]
    emb = np.array([float(item["score"]) for item in emb_items], dtype=np.float64)
    emb_n = _minmax(emb)

    user_idx = cf_model.user_index.get(str(user_id))
    if user_idx is None:
        # Unknown user → cold start: keep pure embedding ranking as-is.
        return emb_items[:limit]

    u_vec = cf_model.user_factors[user_idx]
    cf_raw = np.full(len(ids), -1.0, dtype=np.float64)
    known_mask = np.zeros(len(ids), dtype=bool)
    for pos, iid in enumerate(ids):
        col = cf_model.item_index.get(iid)
        if col is not None:
            cf_raw[pos] = float(u_vec @ cf_model.item_factors[col])
            known_mask[pos] = True

    # Items absent from CF training data stay neutral (median of known scores).
    if known_mask.any():
        neutral = float(np.median(cf_raw[known_mask]))
        cf_raw[~known_mask] = neutral
        cf_n = _minmax(np.where(known_mask, cf_raw, neutral))
    else:
        cf_n = np.zeros_like(emb_n)

    pop_map = _popularity_lookup(cf_model)
    pop_n = np.array([pop_map.get(iid, 0.0) for iid in ids], dtype=np.float64)

    final = w_emb * emb_n + w_cf * cf_n + w_pop * pop_n
    order = np.argsort(-final)

    out: List[Dict[str, Any]] = []
    for rank, pos in enumerate(order[:limit], start=1):
        src = emb_items[int(pos)]
        blended = float(final[int(pos)])
        out.append(
            {
                **src,
                "score": round(blended, 6),
                "confidence": float(1 / (1 + np.exp(-5 * (blended - 0.15)))),
                "rank": rank,
                "method": "hybrid",
            }
        )
    return out


@router.get("/rank/health")
async def travel_rank_health():
    model = _load_model()
    cf_model = _load_cf_model()
    path = _model_path()
    return {
        "ok": model is not None,
        "model_path": str(path),
        "model_exists": path.exists(),
        "items": len(model.item_ids) if model else 0,
        "cf_model_loaded": cf_model is not None,
        "hybrid_enabled": cf_model is not None,
        "weights": {
            "embedding": max(0.05, 1.0
                             - _env_weight("ML_HYBRID_CF_WEIGHT", _DEFAULT_CF_WEIGHT)
                             - _env_weight("ML_HYBRID_POP_WEIGHT", _DEFAULT_POP_WEIGHT)),
            "cf": _env_weight("ML_HYBRID_CF_WEIGHT", _DEFAULT_CF_WEIGHT),
            "popularity": _env_weight("ML_HYBRID_POP_WEIGHT", _DEFAULT_POP_WEIGHT),
        },
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
        # Over-fetch so CF blending can rescue strong-collaborative items that
        # sit below the embedding cutoff, then truncate to the requested limit.
        blend_limit = body.limit * 5 if body.user_id else body.limit
        raw = model.rank(
            body.preferences,
            candidates=candidates if candidates else None,
            limit=min(blend_limit, len(candidates)) if candidates else blend_limit,
        )

        if body.user_id:
            cf_model = _load_cf_model()
            if cf_model is not None:
                raw = _apply_hybrid(cf_model, raw, body.user_id, body.limit)
            else:
                logger.warning("CF model missing — falling back to embedding-only ranking")
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
