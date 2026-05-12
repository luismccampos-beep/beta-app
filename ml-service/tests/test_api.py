from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.api.routes import router as api_router
# unittest.mock removed to align with real data structures
import json

def test_health_check():
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json() == {
            "status": "ok",
            "time": "expect a timestamp string",
            "version": "1.0.0"

        }

def test_prediction_endpoint():
    with TestClient(app) as client:
        # Use the real prediction endpoint which will use fallback_predict
        # if no model is loaded in the test environment.
        response = client.post(
            "/api/v1/predictions",
            json={"input_data": {"feature1": 1, "feature2": 2}}
        )
        assert response.status_code == 200
        assert "prediction" in response.json()