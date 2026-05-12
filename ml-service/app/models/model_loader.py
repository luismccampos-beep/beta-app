import os
import pickle
try:
    import torch  # type: ignore
except ImportError:
    torch = None
try:
    import tensorflow as tf  # type: ignore
except ImportError:
    tf = None
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel
from app.core.config import settings
from app.core.logger import logger
import importlib
import sys

class ModelLoader:
    """Class for loading and managing ML models"""
    
    def __init__(self, model_dir: str = "models") -> None:
        """Initialize model loader"""
        self.model_dir = model_dir
        self.models = {}
        self.cache_dir = "cache"
        self.model_types = {
            "torch": self.load_torch_model,
            "tf": self.load_tensorflow_model,
            "sklearn": self.load_sklearn_model,
            "custom": self.load_custom_model
        }
        self.init_dirs()

    def init_dirs(self) -> None:
        """Initialize directories"""
        os.makedirs(self.model_dir, exist_ok=True)
        os.makedirs(self.cache_dir, exist_ok=True)

    def load_model(self, model_name: str) -> Any:
        """Load model by name"""
        if model_name in self.models:
            return self.models[model_name]

        primary_path = os.path.join(self.model_dir, f"{model_name}.pkl")
        alt_path = os.path.join(self.model_dir, "trained", f"{model_name}.pkl")
        model_path = primary_path if os.path.exists(primary_path) else alt_path
        if not os.path.exists(model_path):
            logger.warning(f"Model file not found: {primary_path} or {alt_path}")
            return None

        try:
            with open(model_path, "rb") as f:
                model = pickle.load(f)
            if model is None:
                logger.warning(f"Failed to load model from {model_path}")
                return None
                
            self.models[model_name] = model
            logger.info(f"Model {model_name} loaded successfully")
            return model
        except Exception as e:
            logger.error(f"Error loading model {model_name} from {model_path}: {str(e)}")
            return None

    def load_torch_model(self, model_path: str) -> Any:
        """Load PyTorch model"""
        try:
            if torch is None:
                raise RuntimeError("PyTorch is not installed; cannot load torch model")
            return torch.load(model_path, map_location="cpu")
        except Exception as e:
            logger.error(f"Error loading PyTorch model: {str(e)}")
            raise

    def load_tensorflow_model(self, model_path: str) -> Any:
        """Load TensorFlow model"""
        try:
            if tf is None:
                raise RuntimeError("TensorFlow is not installed; cannot load TensorFlow model")
            return tf.keras.models.load_model(model_path)
        except Exception as e:
            logger.error(f"Error loading TensorFlow model: {str(e)}")
            raise

    def load_sklearn_model(self, model_path: str) -> Any:
        """Load scikit-learn model"""
        try:
            with open(model_path, "rb") as f:
                return pickle.load(f)
        except Exception as e:
            logger.error(f"Error loading scikit-learn model: {str(e)}")
            raise

    def load_custom_model(self, model_path: str) -> Any:
        """Load custom model"""
        try:
            module_name, _, class_name = model_path.rpartition("/")
            import importlib.util
            spec = importlib.util.spec_from_file_location("custom_model", module_name)
            if spec is None:
                raise ImportError(f"Cannot load spec from {module_name}")
            module = importlib.util.module_from_spec(spec)

            if spec.loader is None:
                raise ImportError(f"Cannot load loader from {module_name}")
            spec.loader.exec_module(module)
            sys.modules[spec.name] = module
            custom_module = importlib.import_module(model_path)
            model_class = getattr(custom_module, class_name)
            return model_class()
        except Exception as e:
            logger.error(f"Error loading custom model: {str(e)}")
            raise

    def predict(self, model_name: str, input_data: Any) -> Any:
        """Make prediction using loaded model"""
        model = self.models.get(model_name)
        if not model:
            raise ValueError(f"Model {model_name} not loaded")

        try:
            return model.predict(input_data)
        except Exception as e:
            logger.error(f"Error during prediction with model {model_name}: {str(e)}")
            raise