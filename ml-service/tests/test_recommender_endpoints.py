from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_recommendations_endpoint():
    r = client.get("/predictions/recommendations/1?limit=3")
    assert r.status_code == 200
    data = r.json()
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)

def test_analytics_endpoint():
    r = client.get("/predictions/analytics")
    assert r.status_code == 200
    data = r.json()
    assert "panorama" in data and "priorities" in data

def test_profile_endpoint():
    r = client.get("/predictions/profile/1")
    assert r.status_code == 200
    data = r.json()
    assert "segment" in data

def test_also_liked_endpoint():
    r = client.get("/predictions/also-liked/svc-hotel-1")
    assert r.status_code == 200
    data = r.json()
    assert "also_liked" in data

def test_add_interaction():
    r = client.post("/predictions/interactions", json={"user_id": 99, "item_id": "svc-activity-2", "score": 4})
    assert r.status_code == 200
    assert r.json().get("success") is True