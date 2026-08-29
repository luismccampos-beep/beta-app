"""Unit tests for hybrid (embedding + CF) blending in travel_ranking."""

from types import SimpleNamespace

import numpy as np

from app.api.routes.travel_ranking import _apply_hybrid, _minmax


def _fake_cf(user_id: str = "u1", popular_ids=None):
    item_ids = ["wv-pt-1", "wv-pt-2", "wv-pt-3"]
    item_index = {iid: i for i, iid in enumerate(item_ids)}
    user_index = {user_id: 0}
    # User vector chosen so CF ranks: pt-3 > pt-2 >> pt-1 (opposite of the
    # embedding order below) — proves blending can override content scores.
    item_factors = np.array(
        [
            [1.0, 0.0],
            [0.0, 1.0],
            [1.0, 1.0],
        ],
        dtype=np.float64,
    )
    user_factors = np.array([[0.5, 2.0]], dtype=np.float64)
    return SimpleNamespace(
        user_index=user_index,
        item_index=item_index,
        user_factors=user_factors,
        item_factors=item_factors,
        popular=[{"id": iid} for iid in (popular_ids or ["wv-pt-2"])],
    )


def _emb_items():
    return [
        {"id": "wv-pt-1", "score": 0.9, "destino_id": 1, "iata": "AAA", "nome": "One", "confidence": 0.9, "rank": 1, "method": "embedding"},
        {"id": "wv-pt-2", "score": 0.5, "destino_id": 2, "iata": "BBB", "nome": "Two", "confidence": 0.6, "rank": 2, "method": "embedding"},
        {"id": "wv-pt-3", "score": 0.1, "destino_id": 3, "iata": "CCC", "nome": "Three", "confidence": 0.2, "rank": 3, "method": "embedding"},
    ]


def test_minmax_constant_vector_returns_zeros():
    out = _minmax(np.array([0.7, 0.7, 0.7]))
    assert out.tolist() == [0.0, 0.0, 0.0]


def test_minmax_spans_unit_interval():
    out = _minmax(np.array([1.0, 2.0, 4.0]))
    assert abs(out[0]) < 1e-9
    assert abs(out[-1] - 1.0) < 1e-9


def test_hybrid_overrides_embedding_with_strong_cf_signal():
    result = _apply_hybrid(_fake_cf(), _emb_items(), "u1", limit=3)
    ids = [r["id"] for r in result]
    # Embedding alone puts pt-1 first; CF ranks pt-2/pt-3 far higher, so the
    # blended top pick must not be the embedding winner.
    assert ids[0] == "wv-pt-2"
    assert all(r["method"] == "hybrid" for r in result)
    ranks = sorted(r["rank"] for r in result)
    assert ranks == [1, 2, 3]


def test_hybrid_unknown_user_returns_embedding_order():
    emb = _emb_items()
    result = _apply_hybrid(_fake_cf(), emb, "ghost-user", limit=3)
    assert result == emb[:3]
    assert all(r["method"] == "embedding" for r in result)


def test_hybrid_respects_limit_and_ranks_sequentially():
    result = _apply_hybrid(_fake_cf(), _emb_items(), "u1", limit=2)
    assert len(result) == 2
    assert [r["rank"] for r in result] == [1, 2]


def test_hybrid_empty_input_returns_empty():
    assert _apply_hybrid(_fake_cf(), [], "u1", limit=5) == []
