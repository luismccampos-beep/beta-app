from typing import Any, Dict, List, Optional, Tuple
try:
    import numpy as np
except ImportError:
    raise ImportError("numpy is required for image preprocessing. Please install it with: pip install numpy")
import pandas as pd
from sklearn.preprocessing import StandardScaler
from app.core.config import settings
from app.core.logger import logger

def preprocess_text(data: str) -> Dict[str, Any]:
    """Preprocess text data"""
    try:
        # Convert to lowercase
        processed = {"text": data.lower().strip()}
        return processed
    except Exception as e:
        logger.error(f"Error during text preprocessing: {str(e)}")
        raise

def preprocess_numeric(data: Dict[str, Any]) -> Dict[str, Any]:
    """Preprocess numeric data"""
    try:
        # Convert to dataframe
        df = pd.DataFrame(data)
        
        # Separate features and labels if needed
        # (This is just an example, actual implementation depends on the model)
        
        # Scale features
        scaler = StandardScaler()
        features = scaler.fit_transform(df.drop("target", axis=1) if "target" in df.columns else df)
        
        return {"features": features.tolist()}
    except Exception as e:
        logger.error(f"Error during numeric preprocessing: {str(e)}")
        raise

def preprocess_image(image_data: bytes) -> Dict[str, Any]:
    """Preprocess image data"""
    try:
        # Convert to numpy array
        import cv2
        image = cv2.imdecode(np.frombuffer(image_data, dtype=np.uint8), cv2.IMREAD_COLOR)
        
        # Resize and normalize
        resized = cv2.resize(image, (224, 224))
        normalized = np.divide(resized, 255.0)
        
        # Add batch dimension
        processed = np.expand_dims(normalized, axis=0)
        
        return {"image": processed.tolist()}
    except ImportError:
        raise ImportError("opencv-python is required for image preprocessing. Please install it with: pip install opencv-python")
    except Exception as e:
        logger.error(f"Error during image preprocessing: {str(e)}")
        raise
