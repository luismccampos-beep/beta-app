from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
import pytest  # type: ignore
import json

@pytest.fixture
def test_client():
    with TestClient(app) as client:
        yield client

def test_end_to_end_prediction(test_client):
    # Test the entire prediction flow
    with TestClient(app) as client:
        # Make a request to the prediction endpoint
        response = client.post(
            "/api/v1/predictions",
            json={"input_data": {"feature1": 1.0, "feature2": 2.0}}
        )
        
        # Verify the response
        assert response.status_code == 200
        assert "prediction" in response.json()
        assert isinstance(response.json()["prediction"], list)