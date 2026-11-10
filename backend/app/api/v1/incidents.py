from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.db import get_db
from app.models.incident import Incident, IncidentSeverity, IncidentStatus
from app.schemas.incident import IncidentCreate, IncidentResponse, IncidentUpdate

router = APIRouter()

@router.get("", response_model=list[IncidentResponse])
def list_incidents(db: Session = Depends(get_db)):
    incidents = db.scalars(select(Incident).order_by(Incident.created_at.desc())).all()
    if not incidents:
        seed_incident = Incident(
            title="Elevated Edge Latency on AP-South Edge Nodes",
            service_name="Edge Network Router",
            severity=IncidentSeverity.MINOR,
            status=IncidentStatus.RESOLVED,
            description="Upstream transit provider packet loss resulted in 80ms latency jitter. Traffic rerouted automatically to secondary transit partner.",
            post_mortem="BGP routing table optimized and automated failover threshold decreased from 120s to 30s.",
            resolved_at=datetime.now(timezone.utc)
        )
        db.add(seed_incident)
        db.commit()
        incidents = db.scalars(select(Incident).order_by(Incident.created_at.desc())).all()
    return incidents

@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(incident_in: IncidentCreate, db: Session = Depends(get_db)):
    incident = Incident(
        title=incident_in.title,
        service_name=incident_in.service_name,
        severity=incident_in.severity,
        description=incident_in.description,
        status=IncidentStatus.INVESTIGATING
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(incident_id: int, incident_in: IncidentUpdate, db: Session = Depends(get_db)):
    incident = db.scalar(select(Incident).where(Incident.id == incident_id))
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if incident_in.status:
        incident.status = incident_in.status
        if incident_in.status == IncidentStatus.RESOLVED and not incident.resolved_at:
            incident.resolved_at = datetime.now(timezone.utc)
    if incident_in.post_mortem is not None:
        incident.post_mortem = incident_in.post_mortem

    db.commit()
    db.refresh(incident)
    return incident
