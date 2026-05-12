from typing import Any, Dict, List
import pandas as pd

def load(interactions_path: str, items_path: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    inter = pd.read_csv(interactions_path)
    items = pd.read_csv(items_path)
    return inter, items

def panorama(inter: pd.DataFrame, items: pd.DataFrame) -> Dict[str, Any]:
    users = inter["user_id"].nunique()
    items_count = inter["item_id"].nunique()
    avg_score = float(inter["score"].mean()) if "score" in inter.columns else None
    by_type = inter.merge(items, on="item_id", how="left").groupby("type")["score"].mean().to_dict()
    return {
        "users": int(users),
        "items_evaluated": int(items_count),
        "avg_score": avg_score,
        "avg_score_by_type": by_type,
    }

def priorities(inter: pd.DataFrame, items: pd.DataFrame) -> Dict[str, Any]:
    merged = inter.merge(items, on="item_id", how="left")
    top = merged.groupby(["item_id", "type"]).agg(count=("user_id", "count"), avg_score=("score", "mean")).reset_index()
    highlights = top.sort_values(["avg_score", "count"], ascending=[False, False]).head(10).to_dict(orient="records")
    needs_attention = top[top["type"] == "transportation"].sort_values("avg_score").head(10).to_dict(orient="records")
    return {"highlights": highlights, "needs_attention": needs_attention}

def user_affinity(inter: pd.DataFrame, items: pd.DataFrame, user_id: int) -> Dict[str, Any]:
    merged = inter.merge(items, on="item_id", how="left")
    u = merged[merged["user_id"] == user_id]
    by_type = u.groupby("type")["score"].mean().sort_values(ascending=False)
    segment = "unknown"
    if not by_type.empty:
        best = by_type.index[0]
        segment = {
            "accommodation": "Hotel Lovers",
            "activity": "Adventure Seekers",
            "package": "Package Fans",
            "transportation": "Transit Users",
        }.get(str(best), "unknown")
    # Tag-based refinement
    tags = items.set_index("item_id")["tags"].to_dict()
    u_tags = inter[inter["user_id"] == user_id]["item_id"].map(lambda x: str(tags.get(x, ""))).str.split("|")
    tag_counts: Dict[str, int] = {}
    for lst in u_tags:
        if isinstance(lst, list):
            for t in lst:
                if t:
                    tag_counts[t] = tag_counts.get(t, 0) + 1
    if tag_counts:
        top_tag = max(tag_counts.items(), key=lambda kv: kv[1])[0]
        tag_segment_map = {
            "citybreak": "Citybreakers",
            "wellness": "Wellness",
            "retreat": "Wellness",
            "luxury": "Luxury Travellers",
            "family": "Family Travellers",
            "adventure": "Adventure Seekers",
        }
        segment = tag_segment_map.get(top_tag.lower(), segment)
    return {"user_id": user_id, "avg_by_type": by_type.to_dict(), "segment": segment, "top_tags": sorted(tag_counts.items(), key=lambda kv: kv[1], reverse=True)}

def cross_suggestions(inter: pd.DataFrame, items: pd.DataFrame, item_id: str) -> List[Dict[str, Any]]:
    users = inter[inter["item_id"] == item_id]["user_id"].unique()
    others = inter[inter["user_id"].isin(users) & (inter["item_id"] != item_id)]
    top = others.groupby("item_id").agg(count=("user_id", "count"), avg_score=("score", "mean")).reset_index()
    top = top.sort_values(["avg_score", "count"], ascending=[False, False]).head(10)
    meta = items.set_index("item_id")["type"].to_dict()
    return [{"item_id": str(r["item_id"]), "type": meta.get(r["item_id"], "item"), "avg_score": float(r["avg_score"]), "count": int(r["count"])} for _, r in top.iterrows()]