import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.db import get_db
from app.models.monitor import Monitor, MonitorStatus, MonitorType
from app.schemas.monitor import MonitorCreate, MonitorResponse, MonitorUpdate

router = APIRouter()

@router.get("", response_model=list[MonitorResponse])
def list_monitors(db: Session = Depends(get_db)):
    monitors = db.scalars(select(Monitor).order_by(Monitor.id.asc())).all()
    if not monitors:
        # Seed initial demo monitors if empty
        seed_monitors = [
            Monitor(name="Main API Gateway", url="https://api.pulsewatch.dev/healthz", monitor_type=MonitorType.HTTP, status=MonitorStatus.OPERATIONAL, uptime_percentage=99.99, latency_ms=18),
            Monitor(name="Authentication Service", url="https://auth.pulsewatch.dev/live", monitor_type=MonitorType.HTTP, status=MonitorStatus.OPERATIONAL, uptime_percentage=99.98, latency_ms=24),
            Monitor(name="Edge CDN POP (us-east-1)", url="https://cdn.pulsewatch.dev/ping", monitor_type=MonitorType.PING, status=MonitorStatus.OPERATIONAL, uptime_percentage=100.0, latency_ms=12),
            Monitor(name="Database Read Replica", url="https://db-ro.internal/health", monitor_type=MonitorType.PING, status=MonitorStatus.OPERATIONAL, uptime_percentage=99.95, latency_ms=8),
        ]
        for m in seed_monitors:
            db.add(m)
        db.commit()
        monitors = db.scalars(select(Monitor).order_by(Monitor.id.asc())).all()
    return monitors

@router.post("", response_model=MonitorResponse, status_code=status.HTTP_201_CREATED)
def create_monitor(monitor_in: MonitorCreate, db: Session = Depends(get_db)):
    monitor = Monitor(
        name=monitor_in.name,
        url=str(monitor_in.url),
        monitor_type=monitor_in.monitor_type,
        interval_seconds=monitor_in.interval_seconds,
        status=MonitorStatus.OPERATIONAL,
        uptime_percentage=100.0,
        latency_ms=random.randint(15, 45)
    )
    db.add(monitor)
    db.commit()
    db.refresh(monitor)
    return monitor

@router.get("/{monitor_id}", response_model=MonitorResponse)
def get_monitor(monitor_id: int, db: Session = Depends(get_db)):
    monitor = db.scalar(select(Monitor).where(Monitor.id == monitor_id))
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")
    return monitor

@router.post("/{monitor_id}/ping", response_model=MonitorResponse)
def ping_monitor(monitor_id: int, db: Session = Depends(get_db)):
    monitor = db.scalar(select(Monitor).where(Monitor.id == monitor_id))
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")
    
    # Simulate active ping check
    simulated_latency = random.randint(14, 55)
    monitor.latency_ms = simulated_latency
    monitor.last_checked_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(monitor)
    return monitor

@router.delete("/{monitor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_monitor(monitor_id: int, db: Session = Depends(get_db)):
    monitor = db.scalar(select(Monitor).where(Monitor.id == monitor_id))
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")
    db.delete(monitor)
    db.commit()
    return None
