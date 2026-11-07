from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
import enum
from app.core.db import Base

class MonitorStatus(str, enum.Enum):
    OPERATIONAL = "operational"
    DEGRADED = "degraded"
    OUTAGE = "outage"

class MonitorType(str, enum.Enum):
    HTTP = "http"
    PING = "ping"
    SSL = "ssl"

class Monitor(Base):
    __tablename__ = "monitors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    monitor_type: Mapped[MonitorType] = mapped_column(SQLEnum(MonitorType), default=MonitorType.HTTP)
    status: Mapped[MonitorStatus] = mapped_column(SQLEnum(MonitorStatus), default=MonitorStatus.OPERATIONAL)
    uptime_percentage: Mapped[float] = mapped_column(Float, default=99.99)
    latency_ms: Mapped[int] = mapped_column(Integer, default=24)
    interval_seconds: Mapped[int] = mapped_column(Integer, default=60)
    last_checked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

