def test_incidents_lifecycle(client):
    payload = {
        "title": "US-East Transit Degradation",
        "service_name": "Edge CDN Gateway",
        "severity": "major",
        "description": "Transit provider observing 12% packet loss."
    }
    create_res = client.post("/api/v1/incidents", json=payload)
    assert create_res.status_code == 201
    incident_id = create_res.json()["id"]
    assert create_res.json()["status"] == "investigating"

    # Update incident to resolved
    patch_payload = {
        "status": "resolved",
        "post_mortem": "Traffic rerouted over backup fiber connection. All packets nominal."
    }
    patch_res = client.patch(f"/api/v1/incidents/{incident_id}", json=patch_payload)
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "resolved"
    assert patch_res.json()["resolved_at"] is not None

def test_system_and_edge_metrics(client):
    metrics_res = client.get("/api/v1/metrics/system")
    assert metrics_res.status_code == 200
    data = metrics_res.json()
    assert "cpu_usage_percent" in data
    assert "memory_usage_percent" in data
    assert "p99_latency_ms" in data

    edge_res = client.get("/api/v1/metrics/edge-regions")
    assert edge_res.status_code == 200
    regions = edge_res.json()
    assert len(regions) >= 3

def test_load_cpu_simulation(client):
    load_res = client.post("/api/v1/metrics/load-cpu?iterations=500")
    assert load_res.status_code == 200
    assert load_res.json()["status"] == "computed"
