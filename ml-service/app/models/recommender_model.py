from typing import Any, Dict, List
import numpy as np

class RecommenderModel:
    def __init__(self, user_index: Dict[int, int], item_index: Dict[str, int], user_factors: np.ndarray, item_factors: np.ndarray, item_meta: Dict[str, Dict[str, Any]], popular: List[Dict[str, Any]]):
        self.user_index = user_index
        self.item_index = item_index
        self.user_factors = user_factors
        self.item_factors = item_factors
        self.item_meta = item_meta
        self.popular = popular

    def predict(self, input_data: Any) -> List[Dict[str, Any]]:
        user_id = int(input_data["user_id"]) if isinstance(input_data, dict) else int(input_data)
        limit = int(input_data.get("limit", 10)) if isinstance(input_data, dict) else 10
        idx = self.user_index.get(user_id)
        if idx is None:
            return self.popular[:limit]
        u = self.user_factors[idx]
        scores = self.item_factors @ u
        order = np.argsort(-scores)
        recs: List[Dict[str, Any]] = []
        for i in order[:limit]:
            for item_id, j in self.item_index.items():
                if j == i:
                    meta = self.item_meta.get(item_id, {})
                    recs.append({"id": item_id, **meta})
                    break
        return recs