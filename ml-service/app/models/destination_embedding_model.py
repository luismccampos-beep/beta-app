"""Content-based destination ranking from Wikivoyage features (TF-IDF + SVD)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Sequence
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import normalize


def build_preference_document(preferences: Dict[str, Any]) -> str:
    """Turn compact travel preferences into a text profile for TF-IDF matching."""
    parts: List[str] = []

    for key in (
        "travelStyles",
        "activityTypes",
        "travelPurpose",
        "experienceTypes",
        "ecoPreferences",
        "accommodationType",
        "preferredDestinations",
    ):
        val = preferences.get(key)
        if isinstance(val, list):
            parts.extend(str(v) for v in val)
        elif isinstance(val, str) and val:
            parts.append(val)

    for key in ("pacePreference", "budgetPriority", "sustainabilityLevel", "cabinClass"):
        val = preferences.get(key)
        if isinstance(val, str) and val:
            parts.append(val)

    budget = preferences.get("budgetRange")
    if isinstance(budget, list) and len(budget) >= 2:
        lo, hi = budget[0], budget[1]
        parts.append(f"budget {lo} {hi}")
        mid = (float(lo) + float(hi)) / 2
        if mid < 2000:
            parts.append("budget-friendly economy")
        elif mid > 8000:
            parts.append("luxury premium")

    return " ".join(parts).strip() or "travel general balanced"


class DestinationEmbeddingModel:
    def __init__(
        self,
        vectorizer: TfidfVectorizer,
        svd: TruncatedSVD,
        item_embeddings: np.ndarray,
        item_ids: List[str],
        item_meta: Dict[str, Dict[str, Any]],
        id_by_destino: Dict[str, str],
        id_by_iata: Dict[str, str],
    ):
        self.vectorizer = vectorizer
        self.svd = svd
        self.item_embeddings = item_embeddings
        self.item_ids = item_ids
        self.item_meta = item_meta
        self.id_by_destino = id_by_destino
        self.id_by_iata = id_by_iata
        self._id_to_idx = {iid: i for i, iid in enumerate(item_ids)}

    def predict(self, input_data: Any) -> List[Dict[str, Any]]:
        if not isinstance(input_data, dict):
            raise ValueError("input_data must be a dict")

        preferences = input_data.get("preferences") or {}
        candidates = input_data.get("candidates") or []
        limit = int(input_data.get("limit", 50))

        return self.rank(preferences, candidates=candidates, limit=limit)

    def rank(
        self,
        preferences: Dict[str, Any],
        candidates: Optional[Sequence[Dict[str, Any]]] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        pref_doc = build_preference_document(preferences)
        q_tfidf = self.vectorizer.transform([pref_doc])
        q_vec = self.svd.transform(q_tfidf)
        q_norm = normalize(q_vec)

        if candidates:
            indices: List[int] = []
            resolved_ids: List[str] = []
            for c in candidates:
                iid = self._resolve_item_id(c)
                if not iid:
                    continue
                idx = self._id_to_idx.get(iid)
                if idx is not None:
                    indices.append(idx)
                    resolved_ids.append(iid)
            if not indices:
                return []
            emb = self.item_embeddings[indices]
            scores = (emb @ q_norm.T).ravel()
            order = np.argsort(-scores)
            out: List[Dict[str, Any]] = []
            for rank, pos in enumerate(order[:limit], start=1):
                i = indices[int(pos)]
                iid = self.item_ids[i]
                meta = self.item_meta.get(iid, {})
                raw = float(scores[int(pos)])
                confidence = float(1 / (1 + np.exp(-5 * (raw - 0.15))))
                out.append(
                    {
                        "id": iid,
                        "destino_id": meta.get("destino_id"),
                        "iata": meta.get("iata"),
                        "nome": meta.get("nome"),
                        "score": raw,
                        "confidence": confidence,
                        "rank": rank,
                        "method": "embedding",
                    }
                )
            return out

        scores = (self.item_embeddings @ q_norm.T).ravel()
        order = np.argsort(-scores)[:limit]
        out = []
        for rank, idx in enumerate(order, start=1):
            iid = self.item_ids[int(idx)]
            meta = self.item_meta.get(iid, {})
            raw = float(scores[int(idx)])
            confidence = float(1 / (1 + np.exp(-5 * (raw - 0.15))))
            out.append(
                {
                    "id": iid,
                    "destino_id": meta.get("destino_id"),
                    "iata": meta.get("iata"),
                    "nome": meta.get("nome"),
                    "score": raw,
                    "confidence": confidence,
                    "rank": rank,
                    "method": "embedding",
                }
            )
        return out

    def _resolve_item_id(self, candidate: Dict[str, Any]) -> Optional[str]:
        if candidate.get("item_id"):
            return str(candidate["item_id"])
        if candidate.get("id") and str(candidate["id"]).startswith("wv-"):
            return str(candidate["id"])
        dest_id = candidate.get("destino_id")
        if dest_id is not None:
            lang = candidate.get("lang") or "pt"
            key = f"{lang}:{dest_id}"
            if key in self.id_by_destino:
                return self.id_by_destino[key]
            key_en = f"en:{dest_id}"
            if key_en in self.id_by_destino:
                return self.id_by_destino[key_en]
        iata = candidate.get("iata")
        if iata:
            return self.id_by_iata.get(str(iata).upper())
        return None
