"""Road / network distances via SCGraph (optional dependency)."""

from __future__ import annotations

import logging
import math
import os
import threading
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

_geograph = None
_geograph_name: str | None = None
_geograph_lock = threading.Lock()
_scgraph_import_error: str | None = None

LatLon = Dict[str, float]


def _env_geograph_name() -> str:
    return os.environ.get("ML_SERVICE_SCGRAPH_GEOGRAPH", "world_highways").strip() or "world_highways"


def haversine_km(a: LatLon, b: LatLon) -> float:
    """Great-circle distance in km (fallback when SCGraph unavailable)."""
    lat1, lon1 = math.radians(a["lat"]), math.radians(a["lon"])
    lat2, lon2 = math.radians(b["lat"]), math.radians(b["lon"])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    x = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371.0 * 2 * math.asin(min(1.0, math.sqrt(x)))


def scgraph_available() -> bool:
    global _scgraph_import_error
    if _scgraph_import_error is not None:
        return False
    try:
        import scgraph  # noqa: F401
        return True
    except ImportError as e:
        _scgraph_import_error = str(e)
        return False


def _load_geograph(name: Optional[str] = None):
    global _geograph, _geograph_name, _scgraph_import_error
    key = (name or _env_geograph_name()).strip()
    if _geograph is not None and _geograph_name == key:
        return _geograph

    if not scgraph_available():
        return None

    with _geograph_lock:
        if _geograph is not None and _geograph_name == key:
            return _geograph
        try:
            from scgraph import GeoGraph

            cache_dir = os.environ.get("ML_SERVICE_SCGRAPH_CACHE_DIR", "").strip() or None
            logger.info("Loading SCGraph geograph '%s' (first use may download data)…", key)
            if cache_dir:
                _geograph = GeoGraph.load_geograph(key, cache_dir=cache_dir)
            else:
                _geograph = GeoGraph.load_geograph(key)
            _geograph_name = key
            logger.info("SCGraph geograph '%s' ready", key)
            return _geograph
        except Exception as e:
            logger.error("Failed to load SCGraph geograph '%s': %s", key, e)
            return None


def road_distance_km(
    origin: LatLon,
    destination: LatLon,
    *,
    geograph_name: Optional[str] = None,
) -> Tuple[float, str]:
    """
    Network road distance in km, or haversine fallback.
    Returns (distance_km, method) where method is 'scgraph' | 'haversine'.
    """
    geo = _load_geograph(geograph_name)
    if geo is not None:
        try:
            out = geo.get_shortest_path(
                origin_node={"latitude": origin["lat"], "longitude": origin["lon"]},
                destination_node={"latitude": destination["lat"], "longitude": destination["lon"]},
                output_units="km",
                output_path=False,
            )
            length = out.get("length") if isinstance(out, dict) else None
            if length is not None and math.isfinite(float(length)) and float(length) > 0:
                return float(length), "scgraph"
        except Exception as e:
            logger.warning("SCGraph path failed, using haversine: %s", e)

    return haversine_km(origin, destination), "haversine"


def batch_road_distances(
    origin: LatLon,
    destinations: List[Dict[str, Any]],
    *,
    geograph_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Compute distance from origin to each destination (with optional id)."""
    results: List[Dict[str, Any]] = []
    for dest in destinations:
        dest_id = dest.get("id")
        lat = dest.get("lat")
        lon = dest.get("lon")
        if lat is None or lon is None:
            results.append(
                {
                    "id": dest_id,
                    "distance_km": None,
                    "method": "error",
                    "error": "lat and lon required",
                }
            )
            continue
        point = {"lat": float(lat), "lon": float(lon)}
        km, method = road_distance_km(origin, point, geograph_name=geograph_name)
        results.append({"id": dest_id, "distance_km": round(km, 2), "method": method})
    return results
