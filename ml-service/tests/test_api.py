from fastapi.testclient import TestClient

from app.main import app
from app.api.routes import router as api_router
from app.core.config import settings

API_KEY = "test-api-key"
AUTH = {"x-api-key": API_KEY}


def test_health_check():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"
        assert body["version"] == "1.0.0"
        assert "time" in body


def test_prediction_endpoint():
    with TestClient(app) as client:
        response = client.post(
            "/v1/predictions/",
            json={"input_data": {"feature1": 1, "feature2": 2}},
            headers=AUTH,
        )
        assert response.status_code == 200
        assert "prediction" in response.json()


def test_missing_api_key_rejected():
    with TestClient(app) as client:
        response = client.post(
            "/v1/predictions/",
            json={"input_data": {"feature1": 1, "feature2": 2}},
        )
        assert response.status_code == 401


def test_invalid_api_key_rejected():
    with TestClient(app) as client:
        response = client.post(
            "/v1/predictions/",
            json={"input_data": {"feature1": 1, "feature2": 2}},
            headers={"x-api-key": "wrong-key"},
        )
        assert response.status_code == 401


def test_api_router_is_gated():
    assert any(
        getattr(route, "dependant", None)
        and any(getattr(dep, "call", None).__name__ == "require_api_key"
                for dep in route.dependant.dependencies)
        for route in api_router.routes
    )