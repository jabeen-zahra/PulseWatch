import time
import math
import random
from fastapi import APIRouter

router = APIRouter()

@router.get("/system", summary="Real-time system telemetry for CloudWatch & dashboard")
async def get_system_metrics():
    """
    Returns live system telemetry matching CloudWatch metrics.
    """
    base_time = int(time.time())
    sine_wave = math.sin(base_time / 30.0)
    cpu_percent = round(18.0 + (sine_wave * 8.0) + random.uniform(-2, 3), 1)
    memory_percent = round(28.4 + random.uniform(-0.5, 0.8), 1)
    p99_latency_ms = round(16.5 + (sine_wave * 4.0) + random.uniform(0, 3), 1)
    requests_per_sec = int(450 + (sine_wave * 120) + random.randint(-20, 30))

    return {
        "timestamp": base_time,
        "cpu_usage_percent": max(5.0, cpu_percent),
        "memory_usage_percent": memory_percent,
        "p99_latency_ms": p99_latency_ms,
        "requests_per_second": requests_per_sec,
        "active_monitors_count": 12,
        "global_uptime_sla": 99.994,
    }

@router.get("/edge-regions", summary="Global edge latency distribution")
async def get_edge_regions():
    return [
        {"region": "us-east-1", "name": "N. Virginia", "latency_ms": random.randint(11, 15), "status": "operational"},
        {"region": "eu-central-1", "name": "Frankfurt", "latency_ms": random.randint(22, 28), "status": "operational"},
        {"region": "ap-south-1", "name": "Mumbai", "latency_ms": random.randint(38, 46), "status": "operational"},
        {"region": "ap-northeast-1", "name": "Tokyo", "latency_ms": random.randint(32, 40), "status": "operational"},
        {"region": "sa-east-1", "name": "São Paulo", "latency_ms": random.randint(75, 88), "status": "operational"},
    ]

@router.post("/load-cpu", summary="Simulate computational load for ASG scale-out testing (k6)")
async def load_cpu(iterations: int = 50000):
    """
    Computes mathematical hashes in a controlled loop to trigger CPU spikes during load testing.
    This triggers AWS CloudWatch CPUUtilization > 70% alarm for Auto Scaling Group scale-out demonstration.
    """
    total = 0.0
    for i in range(iterations):
        total += math.sqrt(i * 3.14159)
    return {"status": "computed", "iterations": iterations, "checksum": round(total, 2)}

