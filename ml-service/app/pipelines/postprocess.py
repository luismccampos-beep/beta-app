from typing import Any, Dict, List, Optional, Tuple
try:
    import numpy as np  # type: ignore
except ImportError:
    # Fallback for environments where numpy is not available
    import sys
    sys.path.append('/path/to/numpy')  # Adjust path as needed
    import numpy as np  # type: ignore
import pandas as pd # type: ignore
from app.core.config import settings
from app.core.logger import logger

def postprocess_classification(prediction: np.ndarray) -> Dict[str, Any]:
    """Postprocess classification prediction"""
    try:
        # Convert to probabilities
        probabilities = np.exp(prediction)
        probabilities /= probabilities.sum()
        
        # Get top 3 predictions
        top3 = np.argsort(probabilities.flatten())[::-1][:3]
        
        return {
            "class0": int(top3[0]),
            "class1": int(top3[1]),
            "class2": int(top3[2]),
            "probabilities": {
                f"class_{i}": float(probabilities.flatten()[i])
                for i in range(min(5, probabilities.shape[1]))
            }
        }
    except Exception as e:
        logger.error(f"Error during classification postprocessing: {str(e)}")
        raise

def postprocess_regression(prediction: np.ndarray) -> Dict[str, Any]:
    """Postprocess regression prediction"""
    try:
        # Convert to float and round appropriately
        return {"prediction": float(prediction[0])}
    except Exception as e:
        logger.error(f"Error during regression postprocessing: {str(e)}")
        raise

def postprocess_clustering(prediction: np.ndarray) -> Dict[str, Any]:
    """Postprocess clustering prediction"""
    try:
        # Convert to readable format if needed
        return {"cluster": int(prediction[0]), "score": float(prediction[1])}
    except Exception as e:
        logger.error(f"Error during clustering postprocessing: {str(e)}")
        raise