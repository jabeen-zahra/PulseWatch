from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
import enum
from app.core.db import Base

class IncidentSeverity(str, enum.Enum):
    MINOR = "minor"
    MAJOR = "major"
    CRITICAL = "critical"

class IncidentStatus(str, enum.Enum):
    INVESTIGATING = "investigating"
    IDENTIFIED = "identified"
    MONITORING = "monitoring"
    RESOLVED = "resolved"

class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    service_name: Mapped[str] = mapped_column(String(100), nullable=False)
    severity: Mapped[IncidentSeverity] = mapped_column(SQLEnum(IncidentSeverity), default=IncidentSeverity.MINOR)
    status: Mapped[IncidentStatus] = mapped_column(SQLEnum(IncidentStatus), default=IncidentStatus.INVESTIGATING)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    post_mortem: Mapped[str] = mapped_column(Text, default="", nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    resolved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

