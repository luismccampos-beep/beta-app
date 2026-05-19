"""Train TF-IDF + SVD embeddings for Wikivoyage destinations."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize

from app.models.destination_embedding_model import DestinationEmbeddingModel

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "app" / "data"
CSV_PATH = DATA_DIR / "wikivoyage_destinations.csv"
OUT_PATH = ROOT / "app" / "models" / "trained" / "destination_embeddings.pkl"


def load_destinations(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(
            f"Missing {path}. Run from repo root: npm run travel:ml:export"
        )
    return pd.read_csv(path)


def train(config: Dict[str, Any] | None = None) -> str:
    cfg = config or {}
    csv_path = Path(cfg.get("csv_path", CSV_PATH))
    out_path = Path(cfg.get("out_path", OUT_PATH))
    k = int(cfg.get("k", 64))
    max_features = int(cfg.get("max_features", 12000))

    df = load_destinations(csv_path)
    item_ids: List[str] = df["item_id"].astype(str).tolist()
    docs: List[str] = df["text_doc"].fillna("").astype(str).tolist()

    vectorizer = TfidfVectorizer(
        max_features=max_features,
        ngram_range=(1, 2),
        min_df=2,
        strip_accents="unicode",
        sublinear_tf=True,
    )
    tfidf = vectorizer.fit_transform(docs)

    n_components = min(k, max(2, tfidf.shape[1] - 1, tfidf.shape[0] - 1))
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    embeddings = svd.fit_transform(tfidf)
    embeddings = normalize(embeddings)

    item_meta: Dict[str, Dict[str, Any]] = {}
    id_by_destino: Dict[str, str] = {}
    id_by_iata: Dict[str, str] = {}

    for _, row in df.iterrows():
        iid = str(row["item_id"])
        dest_id = row.get("destino_id")
        if pd.isna(dest_id):
            parts = iid.split("-")
            dest_id = int(parts[-1]) if parts[-1].isdigit() else None
        lang = str(row.get("lang") or "pt")
        iata = str(row.get("iata") or "").strip().upper()

        meta = {
            "destino_id": int(dest_id) if dest_id is not None and not pd.isna(dest_id) else None,
            "nome": str(row.get("nome") or ""),
            "iata": iata or None,
            "pais": str(row.get("pais") or ""),
            "tipo": str(row.get("tipo") or ""),
            "clima": str(row.get("clima") or ""),
            "continente": str(row.get("continente") or ""),
            "lang": lang,
            "tags": str(row.get("tags") or "").split("|"),
        }
        item_meta[iid] = meta
        if meta["destino_id"] is not None:
            id_by_destino[f"{lang}:{meta['destino_id']}"] = iid
        if iata:
            if iata not in id_by_iata:
                id_by_iata[iata] = iid

    model = DestinationEmbeddingModel(
        vectorizer=vectorizer,
        svd=svd,
        item_embeddings=embeddings,
        item_ids=item_ids,
        item_meta=item_meta,
        id_by_destino=id_by_destino,
        id_by_iata=id_by_iata,
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, out_path)

    meta_out = {
        "items": len(item_ids),
        "dimensions": n_components,
        "explained_variance_ratio": float(svd.explained_variance_ratio_.sum()),
        "csv": str(csv_path),
        "model": str(out_path),
    }
    meta_path = DATA_DIR / "wikivoyage_model_meta.json"
    meta_path.write_text(json.dumps(meta_out, indent=2), encoding="utf-8")

    return str(out_path)


if __name__ == "__main__":
    path = train()
    print(f"Destination embedding model saved: {path}")
