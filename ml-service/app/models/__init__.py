from app.core.config import settings
from app.models.model_loader import ModelLoader
from app.models.predictor import Predictor

# Create model loader instance
model_loader = ModelLoader(model_dir=settings.MODEL_DIR)

# Create predictor instance
predictor = Predictor()

# Export for imports
__all__ = ["model_loader", "predictor"] # pyright: ignore[reportUnsupportedDunderAll]