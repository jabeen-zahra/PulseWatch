def test_create_and_list_monitors(client):
    payload = {
        "name": "Production Database Primary",
        "url": "https://db.internal.pulsewatch.dev/health",
        "monitor_type": "http",
        "interval_seconds": 30
    }
    create_res = client.post("/api/v1/monitors", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == payload["name"]
    assert created_data["status"] == "operational"

    list_res = client.get("/api/v1/monitors")
    assert list_res.status_code == 200
    monitors_list = list_res.json()
    assert len(monitors_list) >= 1

def test_get_and_ping_monitor(client):
    payload = {
        "name": "Stripe Webhook Gateway",
        "url": "https://api.stripe.com/healthcheck",
        "monitor_type": "http",
        "interval_seconds": 60
    }
    create_res = client.post("/api/v1/monitors", json=payload)
    monitor_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/monitors/{monitor_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == monitor_id

    ping_res = client.post(f"/api/v1/monitors/{monitor_id}/ping")
    assert ping_res.status_code == 200
    assert "latency_ms" in ping_res.json()

def test_delete_monitor(client):
    payload = {
        "name": "Temporary Test Node",
        "url": "https://test.pulsewatch.dev",
        "monitor_type": "http",
        "interval_seconds": 60
    }
    create_res = client.post("/api/v1/monitors", json=payload)
    monitor_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/monitors/{monitor_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/monitors/{monitor_id}")
    assert get_res.status_code == 404
