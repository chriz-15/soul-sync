from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/feelings", tags=["Emotional Resonance & Explore Feelings"])

FEELING_OPTIONS = [
    {"label": "Nostalgic Warmth", "emoji": "🌅", "description": "Gentle longing and gratitude for beloved times."},
    {"label": "Pure Radiance", "emoji": "✨", "description": "Uncontainable joy and celebratory energy."},
    {"label": "Quiet Serenity", "emoji": "🌿", "description": "Peaceful presence and grounded reflection."},
    {"label": "Deep Connection", "emoji": "💫", "description": "Soul-level intimacy with loved ones."},
    {"label": "Awe & Wonder", "emoji": "🌌", "description": "Struck by the beauty and vastness of life."}
]

@router.get("/options", summary="Available Emotion Resonances")
def get_feeling_options():
    return {"resonances": FEELING_OPTIONS}

@router.get("", response_model=List[schemas.FeelingLogOut], summary="List Emotional Resonance Logs")
def get_feeling_logs(db: Session = Depends(get_db)):
    return db.query(models.FeelingLog).order_by(models.FeelingLog.id.desc()).all()

@router.post("", response_model=schemas.FeelingLogOut, status_code=status.HTTP_201_CREATED, summary="Log Current Feeling Resonance")
def log_feeling(feeling_in: schemas.FeelingLogCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    user_id = user.id if user else 1

    log_entry = models.FeelingLog(
        mood_label=feeling_in.mood_label,
        emoji=feeling_in.emoji or "✨",
        intensity=feeling_in.intensity or 8,
        reflection=feeling_in.reflection or "Resonating deeply with the current moment.",
        user_id=user_id
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
