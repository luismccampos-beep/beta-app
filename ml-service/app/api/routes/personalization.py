"""Personalization ranking API routes.

Implements Option A: caller provides a list of candidate results, and the ML
service re-ranks them based on user preferences.

This starts with a heuristic ranker that can be swapped later for an ML model.
"""

from __future__ import annotations

import re
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator


router = APIRouter(prefix="/personalization", tags=["Personalization"])

# ---------------------------------------------------------------------------
# Domain models
# ---------------------------------------------------------------------------


class SearchResultPrice(BaseModel):
    amount: float
    currency: str
    unit: str  # e.g. "per_night", "total", "per_person"


class SearchResultAvailability(BaseModel):
    available: bool
    seats: Optional[int] = None
    rooms: Optional[int] = None


class SearchResult(BaseModel):
    id: str
    type: str
    provider: str
    title: str
    description: str
    price: SearchResultPrice
    availability: SearchResultAvailability
    metadata: Dict[str, Any] = Field(default_factory=dict)
    imageUrl: Optional[str] = None
    rating: Optional[float] = None
    location: Optional[Dict[str, Any]] = None

    @field_validator("rating")
    @classmethod
    def clamp_rating(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            return max(0.0, min(float(v), 5.0))
        return v


# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------


class RankRequest(BaseModel):
    preferences: Dict[str, Any]
    candidates: List[SearchResult]
    queryId: Optional[str] = None

    @field_validator("candidates")
    @classmethod
    def candidates_not_empty(cls, v: List[SearchResult]) -> List[SearchResult]:
        if not v:
            raise ValueError("candidates must not be empty")
        return v


class ScoredCandidate(BaseModel):
    candidate: SearchResult
    score: float
    reasons: List[str]


class RankResponse(BaseModel):
    queryId: str
    rankedCandidates: List[SearchResult]
    # Parallel lists — same order as rankedCandidates for easy iteration.
    scores: Dict[str, float]
    reasons: Dict[str, List[str]]
    processingTimeMs: float


class ExplainRequest(BaseModel):
    preferences: Dict[str, Any]
    candidate: SearchResult


class ExplainResponse(BaseModel):
    explanation: str
    score: float
    reasons: List[str]


# ---------------------------------------------------------------------------
# Preference extraction
# ---------------------------------------------------------------------------


def _safe_str(value: Any) -> str:
    return str(value) if value is not None else ""


def _extract_destination(preferences: Dict[str, Any]) -> str:
    """Return the destination string from preferences, or '' if absent."""
    travel = preferences.get("travel")
    if isinstance(travel, dict):
        dest = travel.get("destination")
        if dest:
            return _safe_str(dest)

    dest2 = preferences.get("destination")
    if dest2:
        return _safe_str(dest2)

    return ""


def _extract_budget_max(preferences: Dict[str, Any]) -> Optional[float]:
    """Return the maximum budget in the preferences currency, or None.

    Supports both the nested ``budget.tripBudget.max`` shape and the flat
    ``budget.max`` / ``budget.total`` legacy shape.  Returns ``None`` — rather
    than a best-guess — when the budget key exists but has an unexpected shape
    so callers can distinguish "no budget preference" from "malformed input".
    """
    budget = preferences.get("budget")
    if not isinstance(budget, dict):
        return None

    trip_budget = budget.get("tripBudget")
    if isinstance(trip_budget, dict):
        max_val = trip_budget.get("max")
        if isinstance(max_val, (int, float)):
            return float(max_val)
        # Key present but value is missing/wrong type — treat as absent.
        return None

    for key in ("max", "total"):
        val = budget.get(key)
        if isinstance(val, (int, float)):
            return float(val)

    return None


# ---------------------------------------------------------------------------
# Tokenization helpers
# ---------------------------------------------------------------------------


def _tokenize_destination(destination: str) -> List[str]:
    """Split a destination string into lowercase tokens of ≥3 characters.

    Deduplicates while preserving insertion order so the most significant
    part of the string (usually the city) takes priority.
    """
    raw = re.split(r"\W+", destination.strip().lower())
    seen: set[str] = set()
    out: List[str] = []
    for tok in raw:
        if len(tok) >= 3 and tok not in seen:
            seen.add(tok)
            out.append(tok)
    return out


def _mentions_destination(candidate: SearchResult, dest_tokens: List[str]) -> bool:
    if not dest_tokens:
        return False
    hay = f"{candidate.title} {candidate.description}".lower()
    return any(tok in hay for tok in dest_tokens)


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

# Score weights — centralised so they're easy to tune or replace with a model.
_W_UNAVAILABLE = -50.0
_W_DESTINATION = 15.0
_W_RATING_PER_POINT = 3.0  # applied to the 0-5 clamped rating
_W_OVER_BUDGET_PER_RATIO = 20.0  # multiplied by (price/budget - 1)
_W_OVER_BUDGET_CAP = 30.0


@dataclass
class ScoreResult:
    score: float
    reasons: List[str] = field(default_factory=list)


def _score_candidate(
    candidate: SearchResult,
    dest_tokens: List[str],
    budget_max: Optional[float],
) -> ScoreResult:
    """Return a ScoreResult describing why ``candidate`` received its score.

    All scoring logic lives here; both ``/rank`` and ``/explain`` call this
    single function to guarantee they can never diverge.
    """
    score = 0.0
    reasons: List[str] = []

    # 1) Availability gate — dominates other signals.
    if not candidate.availability.available:
        score += _W_UNAVAILABLE
        reasons.append("unavailable")

    # 2) Destination relevance.
    if _mentions_destination(candidate, dest_tokens):
        score += _W_DESTINATION
        reasons.append("matches destination")

    # 3) Rating boost — rating is already clamped to [0, 5] by the validator.
    if candidate.rating is not None:
        boost = candidate.rating * _W_RATING_PER_POINT
        score += boost
        if candidate.rating >= 4.0:
            reasons.append("high rating")
        elif candidate.rating >= 3.0:
            reasons.append("average rating")
        else:
            reasons.append("low rating")

    # 4) Budget penalty — proportional to how far over budget the item is.
    #    We only compare when both currencies are the same; cross-currency
    #    comparison without an FX rate would be misleading.
    if budget_max is not None:
        amount = candidate.price.amount
        if amount > budget_max:
            ratio = amount / max(budget_max, 1.0)
            penalty = min(_W_OVER_BUDGET_CAP, (ratio - 1.0) * _W_OVER_BUDGET_PER_RATIO)
            score -= penalty
            reasons.append("over budget")

    return ScoreResult(score=score, reasons=reasons)


# ---------------------------------------------------------------------------
# Query ID
# ---------------------------------------------------------------------------


def _make_query_id() -> str:
    return f"q_{int(time.time() * 1000)}"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.post("/rank", response_model=RankResponse)
async def rank_candidates(request: RankRequest) -> RankResponse:
    """Re-rank ``candidates`` according to ``preferences``.

    The response includes per-candidate scores *and* the human-readable
    reasons behind each score so callers can surface explanations without a
    separate ``/explain`` round-trip.
    """
    start = time.perf_counter()

    destination = _extract_destination(request.preferences)
    dest_tokens = _tokenize_destination(destination)
    budget_max = _extract_budget_max(request.preferences)

    scored: List[Tuple[float, SearchResult, List[str]]] = []

    for c in request.candidates:
        result = _score_candidate(c, dest_tokens, budget_max)
        scored.append((result.score, c, result.reasons))

    scored.sort(key=lambda x: x[0], reverse=True)

    scores: Dict[str, float] = {c.id: s for s, c, _ in scored}
    reasons: Dict[str, List[str]] = {c.id: r for _, c, r in scored}

    return RankResponse(
        queryId=request.queryId or _make_query_id(),
        rankedCandidates=[c for _, c, _ in scored],
        scores=scores,
        reasons=reasons,
        processingTimeMs=(time.perf_counter() - start) * 1000.0,
    )


@router.post("/explain", response_model=ExplainResponse)
async def explain_ranking(request: ExplainRequest) -> ExplainResponse:
    """Explain why a single candidate would receive its ranking score."""
    destination = _extract_destination(request.preferences)
    dest_tokens = _tokenize_destination(destination)
    budget_max = _extract_budget_max(request.preferences)

    result = _score_candidate(request.candidate, dest_tokens, budget_max)

    parts: List[str] = []
    if destination:
        parts.append(f"Destination filter: {destination}.")
    if result.reasons:
        parts.append("Signals: " + ", ".join(sorted(set(result.reasons))) + ".")
    if budget_max is not None:
        parts.append(f"Budget ceiling: {budget_max}.")
    parts.append(f"Heuristic score: {result.score:.2f}.")

    return ExplainResponse(
        explanation=" ".join(parts),
        score=result.score,
        reasons=result.reasons,
    )