from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from app.models.monitor import MonitorStatus, MonitorType

class MonitorBase(BaseModel):
    name: str = Field(..., max_length=100, json_schema_extra={"example": "Auth Service Gateway"})
    url: str = Field(..., max_length=255, json_schema_extra={"example": "https://auth.api.pulsewatch.dev/health"})
    monitor_type: MonitorType = MonitorType.HTTP
    interval_seconds: int = Field(60, ge=10, le=3600)

class MonitorCreate(MonitorBase):
    pass

class MonitorUpdate(BaseModel):
    name: str | None = None
    url: str | None = None
    status: MonitorStatus | None = None
    latency_ms: int | None = None

class MonitorResponse(MonitorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: MonitorStatus
    uptime_percentage: float
    latency_ms: int
    last_checked_at: datetime
    created_at: datetime
