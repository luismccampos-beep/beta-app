import pytest  # type: ignore
from app.models.model_loader import ModelLoader
from app.models.predictor import Predictor
from app.core.config import settings

def test_model_loading():
    loader = ModelLoader()
    
    # Test loading a model that doesn't exist - should return None as per implementation
    model = loader.load_model("test_model")
    assert model is None
    
    # Test loading a non-existent model
    with pytest.raises(ValueError):
        loader.load_model("nonexistent_model")

def test_prediction():
    # Create predictor and a simple fake model instead of using unittest.mock
    predictor = Predictor()
    
    class FakeModel:
        def predict(self, input_data):
            return [0.8, 0.9]
    
    # Manually inject the fake model to reflect real data structures
    predictor.models["test_model"] = FakeModel()
    
    result = predictor.predict("test_model", {"input": "test"})
    assert result == [0.8, 0.9]