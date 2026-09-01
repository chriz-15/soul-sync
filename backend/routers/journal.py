from typing import List, Optional
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/journal", tags=["Journal & Narrative Logs"])

PROMPTS = [
    "What made this moment feel unforgettable and alive?",
    "If you could whisper one gratitude to this past version of yourself, what would it be?",
    "How did the sights, sounds, and ambient laughter shape this memory?",
    "What hidden lesson or timeless love did this experience reveal?",
    "Describe the feeling of warmth that remains when you look back on this day."
]

@router.get("", response_model=List[schemas.JournalOut], summary="Fetch Narrative Journal Logs")
def list_journal_entries(db: Session = Depends(get_db)):
    return db.query(models.JournalEntry).order_by(models.JournalEntry.id.desc()).all()

@router.post("", response_model=schemas.JournalOut, status_code=status.HTTP_201_CREATED, summary="Create Narrative Journal Entry")
def create_journal_entry(entry_in: schemas.JournalCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    user_id = user.id if user else 1

    # AI reflection generation simulation
    reflection = entry_in.ai_reflection or f"A profound testament to presence and emotional connection in '{entry_in.title}'."

    new_entry = models.JournalEntry(
        title=entry_in.title,
        content=entry_in.content,
        prompt_used=entry_in.prompt_used or random.choice(PROMPTS),
        mood=entry_in.mood or "Reflective",
        ai_reflection=reflection,
        tags=entry_in.tags or "Reflections, Story",
        user_id=user_id
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.get("/prompts", summary="Get Context-Aware Reflection Prompts (Journaling AI)")
def get_reflection_prompts():
    return {
        "prompts": PROMPTS,
        "active_recommendation": random.choice(PROMPTS)
    }

@router.post("/reflect", summary="Generate AI Context-Aware Reflection")
def generate_ai_reflection(payload: dict):
    text = payload.get("content", "")
    mood = payload.get("mood", "Warm")
    if not text:
        return {"reflection": "Every fleeting memory holds a thread of eternity. Capture its sensory essence."}
    
    reflections = [
        f"This moment shines with genuine {mood.lower()}. The emotional texture in your words captures what words alone often fail to preserve.",
        f"A beautiful capture of human connection. The subtle details here preserve a sacred layer of your family story.",
        f"Deeply resonant. Reliving this moment restores the exact warmth and perspective you felt."
    ]
    return {"reflection": random.choice(reflections)}

@router.delete("/{entry_id}", summary="Delete Journal Entry")
def delete_journal_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(models.JournalEntry).filter(models.JournalEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Journal entry deleted", "id": entry_id}
