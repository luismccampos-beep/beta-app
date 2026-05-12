from typing import Any, Dict, List, Tuple
import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import normalize
import joblib
from app.models.recommender_model import RecommenderModel
from app.core.config import settings
import json

def load_interactions(path: str) -> pd.DataFrame:
    return pd.read_csv(path)

def load_items(path: str) -> pd.DataFrame:
    return pd.read_csv(path)

def build_mappings(users: pd.Series, items: pd.Series) -> Tuple[Dict[int, int], Dict[str, int]]:
    uid_map = {int(u): i for i, u in enumerate(sorted(set(users)))}
    iid_map = {str(it): i for i, it in enumerate(sorted(set(items)))}
    return uid_map, iid_map

def build_matrix(df: pd.DataFrame, uid_map: Dict[int, int], iid_map: Dict[str, int], items_df: pd.DataFrame, score_max: float = 5.0, type_weights: Dict[str, float] | None = None) -> np.ndarray:
    m = np.zeros((len(uid_map), len(iid_map)), dtype=np.float32)
    type_map = { str(row["item_id"]): str(row.get("type", "item")) for _, row in items_df.iterrows() }
    tw = type_weights or { "accommodation": 1.0, "activity": 1.0, "package": 1.0, "transportation": 0.7 }
    for _, row in df.iterrows():
        u = uid_map.get(int(row["user_id"]))
        iid = str(row["item_id"])
        i = iid_map.get(iid)
        if u is not None and i is not None:
            raw = float(row.get("score", 1.0))
            norm = raw / score_max if score_max and score_max > 0 else raw
            w = tw.get(type_map.get(iid, "item"), 1.0)
            m[u, i] += norm * w
    return m

def train_embeddings(M: np.ndarray, k: int = 32) -> Tuple[np.ndarray, np.ndarray]:
    svd = TruncatedSVD(n_components=k, random_state=42)
    U = svd.fit_transform(M)
    V = svd.components_.T
    U = normalize(U)
    V = normalize(V)
    return U, V

def build_meta(items_df: pd.DataFrame) -> Dict[str, Dict[str, Any]]:
    meta: Dict[str, Dict[str, Any]] = {}
    for _, row in items_df.iterrows():
        meta[str(row["item_id"])] = {
            "type": str(row.get("type", "item")),
            "tags": str(row.get("tags", "")).split("|") if isinstance(row.get("tags", ""), str) else [],
        }
    return meta

def popular_items(df: pd.DataFrame, items_df: pd.DataFrame, iid_map: Dict[str, int], top: int = 50) -> List[Dict[str, Any]]:
    counts = df.groupby("item_id").size().sort_values(ascending=False).head(top)
    out: List[Dict[str, Any]] = []
    meta = build_meta(items_df)
    for iid in counts.index:
        out.append({"id": str(iid), **meta.get(str(iid), {"type": "item"})})
    return out

def train_and_save(config: Dict[str, Any]) -> str:
    interactions = load_interactions(config["interactions_path"])
    items = load_items(config["items_path"])
    uid_map, iid_map = build_mappings(interactions["user_id"], interactions["item_id"])
    score_max = float(config.get("score_max", getattr(settings, "RECOMMENDER_SCORE_MAX", 5.0)))
    default_tw = getattr(settings, "RECOMMENDER_TYPE_WEIGHTS_JSON", "{\"accommodation\":1.0,\"activity\":1.0,\"package\":1.0,\"transportation\":0.7}")
    try:
        parsed_tw = json.loads(default_tw) if isinstance(default_tw, str) else default_tw
    except Exception:
        parsed_tw = { "accommodation": 1.0, "activity": 1.0, "package": 1.0, "transportation": 0.7 }
    type_weights = config.get("type_weights", parsed_tw)
    M = build_matrix(interactions, uid_map, iid_map, items, score_max=score_max, type_weights=type_weights)
    U, V = train_embeddings(M, k=int(config.get("k", 32)))
    meta = build_meta(items)
    popular = popular_items(interactions, items, iid_map)
    model = RecommenderModel(uid_map, iid_map, U, V, meta, popular)
    out_path = config.get("out_path", "app/models/trained/recommender.pkl")
    joblib.dump(model, out_path)
    return out_path