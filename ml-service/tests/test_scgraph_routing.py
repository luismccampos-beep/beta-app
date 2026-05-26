"""Tests for SCGraph routing helpers (no download required)."""

import math

from app.ml.scgraph_routing import batch_road_distances, haversine_km


def test_haversine_lisbon_porto():
    lis = {"lat": 38.7223, "lon": -9.1393}
    por = {"lat": 41.1579, "lon": -8.6291}
    km = haversine_km(lis, por)
    assert 250 < km < 350


def test_batch_haversine_fallback_without_scgraph(monkeypatch):
    monkeypatch.setattr("app.ml.scgraph_routing._load_geograph", lambda *_a, **_k: None)
    origin = {"lat": 38.72, "lon": -9.14}
    out = batch_road_distances(
        origin,
        [{"id": "a", "lat": 41.15, "lon": -8.63}],
    )
    assert len(out) == 1
    assert out[0]["method"] == "haversine"
    assert out[0]["distance_km"] is not None
    assert out[0]["distance_km"] > 0
