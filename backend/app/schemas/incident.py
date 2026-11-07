from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from app.models.incident import IncidentSeverity, IncidentStatus

class IncidentBase(BaseModel):
    title: str = Field(..., max_length=150, json_schema_extra={"example": "Increased API Latency in us-east-1"})
    service_name: str = Field(..., max_length=100, json_schema_extra={"example": "Payment Processing Gateway"})
    severity: IncidentSeverity = IncidentSeverity.MINOR
    description: str = Field(..., json_schema_extra={"example": "Observing elevated p99 latency above 450ms across ALB targets."})

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    status: IncidentStatus | None = None
    post_mortem: str | None = None
    resolved_at: datetime | None = None

class IncidentResponse(IncidentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: IncidentStatus
    post_mortem: str | None = None
    created_at: datetime
    resolved_at: datetime | None = None
