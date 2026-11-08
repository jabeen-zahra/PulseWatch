from fastapi import APIRouter, Response, status
from app.core.config import settings

router = APIRouter()

# Global state for deliberate failure demonstration (DevOps Requirement 9)
simulated_failure_state = {"active": False, "reason": ""}

@router.get("/healthz", summary="Liveness & Readiness probe for AWS ALB")
async def healthz(response: Response):
    """
    AWS Application Load Balancer health check endpoint.
    Returns 200 OK when operational, 503 Service Unavailable when simulated failure is active.
    """
    if simulated_failure_state["active"] or settings.SIMULATED_FAILURE:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "unhealthy",
            "service": "pulsewatch-backend",
            "version": settings.VERSION,
            "reason": simulated_failure_state["reason"] or "Deliberate failure triggered for alarm test",
        }
    return {
        "status": "healthy",
        "service": "pulsewatch-backend",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }

@router.get("/live", summary="Kubernetes / Docker container liveness probe")
async def live():
    return {"status": "alive"}

@router.get("/ready", summary="Service readiness probe")
async def ready():
    return {"status": "ready"}

@router.post("/healthz/simulate-outage", summary="Trigger deliberate outage for CloudWatch/SNS alarm demonstration")
async def simulate_outage(enable: bool = True, reason: str = "Simulated database connection pool exhaustion"):
    simulated_failure_state["active"] = enable
    simulated_failure_state["reason"] = reason if enable else ""
    return {
        "simulation_active": simulated_failure_state["active"],
        "reason": simulated_failure_state["reason"],
        "message": "ALB target will turn UNHEALTHY within 2 health check intervals. CloudWatch Alarm will fire to SNS." if enable else "Service restored to HEALTHY status."
    }

