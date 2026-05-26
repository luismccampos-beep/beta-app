"""Road distance via SCGraph (world_highways) for travel ranking."""

from __future__ import annotations

import asyncio
import logging
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.ml.scgraph_routing import (
    batch_road_distances,
    haversine_km,
    road_distance_km,
    scgraph_available,
    _env_geograph_name,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/travel", tags=["travel-distance"])


class LatLonPoint(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)


class DistanceRequest(BaseModel):
    origin: LatLonPoint
    destination: LatLonPoint
    geograph: Optional[str] = None


class DistanceResponse(BaseModel):
    success: bool
    distance_km: float
    method: str
    geograph: str
    scgraph_available: bool
    processing_time: float
    timestamp: str


class BatchDestination(BaseModel):
    id: Optional[str] = None
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)


class BatchDistanceRequest(BaseModel):
    origin: LatLonPoint
    destinations: List[BatchDestination] = Field(default_factory=list, max_length=50)
    geograph: Optional[str] = None


class BatchDistanceItem(BaseModel):
    id: Optional[str] = None
    distance_km: Optional[float] = None
    method: str
    error: Optional[str] = None


class BatchDistanceResponse(BaseModel):
    success: bool
    results: List[BatchDistanceItem]
    geograph: str
    scgraph_available: bool
    processing_time: float
    timestamp: str


@router.get("/distance/health")
async def travel_distance_health():
    geograph = _env_geograph_name()
    return {
        "ok": True,
        "scgraph_installed": scgraph_available(),
        "geograph": geograph,
        "hint": "pip install scgraph  # first query may download network data",
    }


@router.post("/distance", response_model=DistanceResponse)
async def travel_distance(body: DistanceRequest):
    started_at = datetime.now(timezone.utc)
    t0 = time.perf_counter()
    geograph = (body.geograph or _env_geograph_name()).strip()
    origin = {"lat": body.origin.lat, "lon": body.origin.lon}
    dest = {"lat": body.destination.lat, "lon": body.destination.lon}

    km, method = await asyncio.to_thread(
        road_distance_km,
        origin,
        dest,
        geograph_name=geograph,
    )

    elapsed = time.perf_counter() - t0
    return DistanceResponse(
        success=True,
        distance_km=round(km, 2),
        method=method,
        geograph=geograph,
        scgraph_available=scgraph_available(),
        processing_time=elapsed,
        timestamp=started_at.isoformat(),
    )


@router.post("/distance/batch", response_model=BatchDistanceResponse)
async def travel_distance_batch(body: BatchDistanceRequest):
    started_at = datetime.now(timezone.utc)
    t0 = time.perf_counter()
    geograph = (body.geograph or _env_geograph_name()).strip()
    origin = {"lat": body.origin.lat, "lon": body.origin.lon}
    dests = [d.model_dump() for d in body.destinations]

    raw = await asyncio.to_thread(
        batch_road_distances,
        origin,
        dests,
        geograph_name=geograph,
    )

    results = [
        BatchDistanceItem(
            id=r.get("id"),
            distance_km=r.get("distance_km"),
            method=str(r.get("method", "error")),
            error=r.get("error"),
        )
        for r in raw
    ]

    elapsed = time.perf_counter() - t0
    logger.info(
        "SCGraph batch distance: n=%d elapsed=%.3fs scgraph=%s",
        len(results),
        elapsed,
        scgraph_available(),
    )
    return BatchDistanceResponse(
        success=True,
        results=results,
        geograph=geograph,
        scgraph_available=scgraph_available(),
        processing_time=elapsed,
        timestamp=started_at.isoformat(),
    )


@router.post("/distance/haversine")
async def travel_haversine(body: DistanceRequest):
    """Fast great-circle distance (no SCGraph)."""
    km = haversine_km(
        {"lat": body.origin.lat, "lon": body.origin.lon},
        {"lat": body.destination.lat, "lon": body.destination.lon},
    )
    return {"success": True, "distance_km": round(km, 2), "method": "haversine"}
