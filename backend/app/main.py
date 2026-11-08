from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import engine, Base
from app.api.v1 import health, monitors, incidents, metrics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Next-Gen Edge Uptime & Cloud Observability Platform API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(health.router, prefix="/api/v1", tags=["Health & Probes"])
app.include_router(monitors.router, prefix="/api/v1/monitors", tags=["Monitors"])
app.include_router(incidents.router, prefix="/api/v1/incidents", tags=["Incidents"])
app.include_router(metrics.router, prefix="/api/v1/metrics", tags=["Observability Metrics"])

@app.get("/")
def root():
    return {
        "service": "PulseWatch Observability Engine",
        "status": "operational",
        "docs": "/docs",
        "version": settings.VERSION
    }
