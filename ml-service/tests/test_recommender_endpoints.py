from fastapi.testclient import TestClient

from app.main import app

AUTH = {"x-api-key": "test-api-key"}


def test_recommendations_endpoint():
    with TestClient(app) as client:
        r = client.get("/v1/predictions/recommendations/1?limit=3", headers=AUTH)
        assert r.status_code == 200
        data = r.json()
        assert "recommendations" in data
        assert isinstance(data["recommendations"], list)


def test_analytics_endpoint():
    with TestClient(app) as client:
        r = client.get("/v1/predictions/analytics", headers=AUTH)
        assert r.status_code == 200
        data = r.json()
        assert "panorama" in data and "priorities" in data


def test_profile_endpoint():
    with TestClient(app) as client:
        r = client.get("/v1/predictions/profile/1", headers=AUTH)
        assert r.status_code == 200
        data = r.json()
        assert "segment" in data


def test_also_liked_endpoint():
    with TestClient(app) as client:
        r = client.get("/v1/predictions/also-liked/svc-hotel-1", headers=AUTH)
        assert r.status_code == 200
        data = r.json()
        assert "also_liked" in data


def test_add_interaction():
    with TestClient(app) as client:
        r = client.post(
            "/v1/predictions/interactions",
            json={"user_id": "99", "item_id": "svc-activity-2", "score": 4},
            headers=AUTH,
        )
        assert r.status_code == 200
        assert r.json().get("success") is True