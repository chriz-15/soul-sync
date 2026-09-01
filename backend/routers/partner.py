from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/partner", tags=["Partner Space & Shared Repository"])

@router.get("", response_model=schemas.PartnerSpaceOut, summary="Get Active Shared Partner Space")
def get_partner_space(db: Session = Depends(get_db)):
    space = db.query(models.PartnerSpace).first()
    if not space:
        space = models.PartnerSpace(
            name="Nanba & Alex Sanctuary",
            partner_name="Alex",
            partner_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
            shared_memories_count=42,
            sync_status="Active Sync (Heartbeat 98%)",
            last_interaction="Just now",
            cover_image="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
            love_notes="Always cherish the laughter during our midnight walks under the stars."
        )
        db.add(space)
        db.commit()
        db.refresh(space)
    return space

@router.post("/pulse", summary="Send Real-Time Heartbeat Sync Pulse")
def send_heartbeat_pulse(db: Session = Depends(get_db)):
    space = db.query(models.PartnerSpace).first()
    if space:
        space.last_interaction = "Just now"
        space.sync_status = "Instant Sync Pulse Received ❤️"
        db.commit()
        db.refresh(space)
    return {"message": "Heartbeat pulse sent to partner", "pulse": "❤️ Sync Active"}

@router.post("/note", summary="Add Shared Whisper / Love Note")
def add_love_note(payload: dict, db: Session = Depends(get_db)):
    note = payload.get("note", "")
    space = db.query(models.PartnerSpace).first()
    if not space:
        raise HTTPException(status_code=404, detail="Partner space not found")
    space.love_notes = note
    space.last_interaction = "Just now"
    db.commit()
    db.refresh(space)
    return space
