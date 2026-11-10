def test_healthz_endpoint(client):
    response = client.get("/api/v1/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "pulsewatch-backend"

def test_live_and_ready_probes(client):
    res_live = client.get("/api/v1/live")
    assert res_live.status_code == 200
    assert res_live.json()["status"] == "alive"

    res_ready = client.get("/api/v1/ready")
    assert res_ready.status_code == 200
    assert res_ready.json()["status"] == "ready"

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"

def test_simulated_outage_endpoint(client):
    # Enable outage
    res_enable = client.post("/api/v1/healthz/simulate-outage?enable=true&reason=Test%20Failure")
    assert res_enable.status_code == 200
    assert res_enable.json()["simulation_active"] is True

    # Check healthz returns 503
    res_healthz_bad = client.get("/api/v1/healthz")
    assert res_healthz_bad.status_code == 503
    assert res_healthz_bad.json()["status"] == "unhealthy"

    # Restore health
    res_restore = client.post("/api/v1/healthz/simulate-outage?enable=false")
    assert res_restore.status_code == 200
    assert res_restore.json()["simulation_active"] is False

    # Check healthz returns 200 again
    res_healthz_ok = client.get("/api/v1/healthz")
    assert res_healthz_ok.status_code == 200
    assert res_healthz_ok.json()["status"] == "healthy"
