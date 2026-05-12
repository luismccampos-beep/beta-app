import os
import json
import pickle
try:
    import numpy as np  # type: ignore
except ImportError:
    np = None
try:
    import pandas as pd # type: ignore
except ImportError:
    pd = None
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime
from app.core.config import settings
from app.core.logger import logger

def load_config(config_path: str) -> Dict[str, Any]:
    """Load configuration file"""
    if not os.path.exists(config_path):
        logger.warning(f"Configuration file not found at {config_path}")
        return {}
    
    try:
        with open(config_path, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading configuration file: {str(e)}")
        return {}

def save_object(obj: Any, path: str) -> None:
    """Save object to file"""
    try:
        with open(path, "wb") as f:
            if np is not None and isinstance(obj, np.ndarray):
                np.save(f, obj)
            elif pd is not None and isinstance(obj, pd.DataFrame):
                obj.to_pickle(path)
            else:
                pickle.dump(obj, f)
    except Exception as e:
        logger.error(f"Error saving object: {str(e)}")

def load_object(path: str) -> Any:
    """Load object from file"""
    if not os.path.exists(path):
        logger.warning(f"File not found: {path}")
        return None
    
    try:
        if path.endswith(".npy"):
            if np is None:
                logger.error("NumPy not available, cannot load .npy file")
                return None
            return np.load(path)
        elif path.endswith(".pkl") or path.endswith(".pickle"):
            with open(path, "rb") as f:
                return pickle.load(f)
        else:
            logger.warning(f"Unsupported file format for loading: {path}")
            return None
    except Exception as e:
        logger.error(f"Error loading object: {str(e)}")
        return None

def get_cache_path(name: str) -> str:
    """Get path for cache file"""
    return os.path.join(settings.CACHE_DIR, f"{name}.pkl")

def init_dirs() -> None:
    """Initialize directories"""
    os.makedirs(settings.MODEL_DIR, exist_ok=True)
    os.makedirs(settings.DATA_DIR, exist_ok=True)
    os.makedirs(settings.LOG_DIR, exist_ok=True)
    os.makedirs(settings.CACHE_DIR, exist_ok=True)
    os.makedirs(settings.CONFIG_DIR, exist_ok=True)