from fastapi.testclient import TestClient

from app.main import app

AUTH = {"x-api-key": "test-api-key"}


def test_end_to_end_prediction():
    with TestClient(app) as client:
        response = client.post(
            "/v1/predictions/",
            json={"input_data": {"feature1": 1.0, "feature2": 2.0}},
            headers=AUTH,
        )

        assert response.status_code == 200
        prediction = response.json()["prediction"]
        assert isinstance(prediction, dict)
        assert "items" in prediction
        assert isinstance(prediction["items"], list)