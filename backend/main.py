from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from database import engine, Base, get_db
import models
from routers import auth, memories, journal, partner, capsules, feelings, settings
from seed import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Soul Sync - Archival & Sensory Middleware API",
    description="""
    ## Soul Sync API — Living Archive & Sensory Ingestion Engine
    
    This middleware powers the **Soul Sync** ecosystem, enabling:
    - **Identity Gateway & Hydration**: User authentication and session states.
    - **Main Capture Engine**: High-fidelity ingestion for Visual Arts, Motion, Oral History & Journaling.
    - **Chronological Timeline & Living Archive**: Preserving moments and family legacy.
    - **Journaling AI & Narrative Logs**: Context-aware reflection prompts and emotional resonance.
    - **Partner Space**: Shared repositories, heartbeat synchronization, and joint vaulting.
    - **Time Capsules**: Scheduled future releases, encrypted vaults, and release countdowns.
    - **Explore Feelings**: Real-time emotional logging and resonance trends.
    - **Global Configuration**: Privacy controls and sensory hardware integrations.
    
    *Revision: 2.04 — Mapping Logical Flow & Interaction Nodes*
    """,
    version="2.04",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Enable CORS for React frontend (Vite default port 5173 + custom ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(memories.router)
app.include_router(journal.router)
app.include_router(partner.router)
app.include_router(capsules.router)
app.include_router(feelings.router)
app.include_router(settings.router)

@app.on_event("startup")
def on_startup():
    # Automatically seed database on first launch
    seed_database()

@app.get("/api/system/status", summary="System Health & Revision 2.04 Status")
def get_system_status(db: Session = Depends(get_db)):
    memories_count = db.query(models.Memory).count()
    journal_count = db.query(models.JournalEntry).count()
    capsules_count = db.query(models.TimeCapsule).count()
    
    return {
        "status": "healthy",
        "version": "2.04",
        "app_name": "Soul Sync",
        "active_engine": "Capture Memory Engine",
        "database_connected": True,
        "total_memories": memories_count,
        "total_journal_entries": journal_count,
        "total_time_capsules": capsules_count,
        "swagger_docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/", summary="Root Health Check & Welcome")
def root():
    return {
        "message": "Welcome to Soul Sync API — Capture, Cherish, Relive.",
        "documentation": "/docs",
        "version": "2.04"
    }
