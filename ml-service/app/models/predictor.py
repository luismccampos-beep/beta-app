from typing import Any, Dict, List, Optional, Tuple
import numpy as np
try:
    import pandas as pd
except ImportError:
    pd = None
from app.core.config import settings
from app.core.logger import logger
from .model_loader import ModelLoader

class Predictor:
    """Class for handling model predictions"""
    
    def __init__(self) -> None:
        """Initialize predictor"""
        self.models = {}
        self.loader = ModelLoader(model_dir="models")

    def predict(self, model_name: str, input_data: Any) -> Any:
        """Generic prediction method"""
        if model_name not in self.models:
            model = self.loader.load_model(model_name)
            if model is None:
                logger.warning(f"Model {model_name} not available; using fallback")
                return self.fallback_predict(model_name, input_data)
            self.models[model_name] = model

        try:
            if isinstance(input_data, dict):
                if pd is None:
                    raise ImportError("pandas is required but not installed")
                input_data = pd.DataFrame([input_data])
                
            prediction = self.models[model_name].predict(input_data)
            return prediction
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            raise

    def fallback_predict(self, model_name: str, input_data: Any) -> Any:
        """Lightweight fallback when a model file is unavailable"""
        if model_name == "recommender":
            user_id = int(input_data) if not isinstance(input_data, dict) else int(input_data.get("user_id", 0))
            # Simple heuristic: recommend top items by popularity buckets
            popular_items = [
                {"id": "svc-hotel-1", "type": "accommodation"},
                {"id": "svc-activity-1", "type": "activity"},
                {"id": "svc-package-1", "type": "package"},
                {"id": "svc-transfer-1", "type": "transportation"},
            ]
            return {"user_id": user_id, "items": popular_items}
        return {"prediction": None}

    def preprocess(self, model_name: str, input_data: Any) -> Any:
        """Preprocess input data"""
        try:
            if model_name == "text_classifier":
                # Example preprocessing for text data
                if not isinstance(input_data, str):
                    raise ValueError("Input must be a string for text classification")
                return {"text": input_data.lower()}
            elif model_name == "image_classifier":
                # Example preprocessing for image data
                if not isinstance(input_data, np.ndarray):
                    raise ValueError("Input must be a numpy array for image classification")
                return input_data / 255.0  # Normalize pixel values
        except Exception as e:
            logger.error(f"Error during preprocessing: {str(e)}")
            raise

    def postprocess(self, model_name: str, prediction: Any) -> Any:
        """Postprocess prediction"""
        try:
            if model_name == "text_classifier":
                # Example postprocessing for text classification
                return {"class": prediction[0], "confidence": float(prediction[1])}
            elif model_name == "image_classifier":
                # Example postprocessing for image classification
                return {"class": int(prediction[0]), "confidence": float(np.max(prediction))}
            else:
                return {"prediction": prediction}
        except Exception as e:
            logger.error(f"Error during postprocessing: {str(e)}")
            raise