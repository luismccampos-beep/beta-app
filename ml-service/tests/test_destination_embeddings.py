"""Tests for Wikivoyage destination embedding model."""

import pytest

from app.models.destination_embedding_model import (
    DestinationEmbeddingModel,
    build_preference_document,
)
from app.pipelines.train_destination_embeddings import train


@pytest.mark.unit
def test_build_preference_document():
    doc = build_preference_document(
        {
            "travelStyles": ["luxury", "adventure"],
            "activityTypes": ["beach", "cultural"],
            "budgetRange": [3000, 8000],
            "pacePreference": "relaxed",
        }
    )
    assert "luxury" in doc
    assert "beach" in doc


@pytest.mark.unit
def test_train_and_rank(tmp_path, monkeypatch):
    csv = tmp_path / "wikivoyage_destinations.csv"
    csv.write_text(
        "item_id,destino_id,type,nome,pais,pais_code,iata,continente,tipo,clima,lang,tags,text_doc\n"
        'wv-pt-1,1,destination,Lisboa,Portugal,PT,LIS,Europa,cidade,mediterrânico,pt,cidade|mediterrânico,"Lisboa Portugal cidade praia cultura"\n'
        'wv-pt-2,2,destination,Porto,Portugal,PT,OPO,Europa,cidade,continental,pt,cidade,"Porto vinho cidade histórica"\n'
        'wv-en-3,3,destination,Barcelona,Spain,ES,BCN,Europa,cidade,mediterrânico,en,cidade,"Barcelona beach city culture"\n',
        encoding="utf-8",
    )
    out = tmp_path / "model.pkl"
    path = train({"csv_path": str(csv), "out_path": str(out), "k": 2, "max_features": 100})
    assert path == str(out)

    import joblib

    model: DestinationEmbeddingModel = joblib.load(out)
    ranked = model.rank(
        {"activityTypes": ["beach"], "travelStyles": ["luxury"]},
        candidates=[{"destino_id": 1, "lang": "pt"}, {"destino_id": 3, "lang": "en"}],
        limit=2,
    )
    assert len(ranked) >= 1
    assert ranked[0]["score"] >= ranked[-1]["score"]
