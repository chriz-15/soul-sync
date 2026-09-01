from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/time-capsules", tags=["Time Capsules & Scheduled Release"])

@router.get("", response_model=List[schemas.TimeCapsuleOut], summary="List Sealed & Released Time Capsules")
def list_capsules(db: Session = Depends(get_db)):
    return db.query(models.TimeCapsule).order_by(models.TimeCapsule.unlock_date.asc()).all()

@router.post("", response_model=schemas.TimeCapsuleOut, status_code=status.HTTP_201_CREATED, summary="Seal New Time Capsule")
def seal_capsule(capsule_in: schemas.TimeCapsuleCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    user_id = user.id if user else 1

    capsule = models.TimeCapsule(
        title=capsule_in.title,
        description=capsule_in.description,
        unlock_date=capsule_in.unlock_date,
        is_locked=True,
        sensory_payload=capsule_in.sensory_payload or "Sensory Audio & High-Fidelity Memories",
        media_url=capsule_in.media_url,
        release_message=capsule_in.release_message or "A timeless treasure unlocked for your future self.",
        user_id=user_id
    )
    db.add(capsule)
    db.commit()
    db.refresh(capsule)
    return capsule

@router.post("/{capsule_id}/unlock", response_model=schemas.TimeCapsuleOut, summary="Trigger Scheduled Capsule Release")
def unlock_capsule(capsule_id: int, db: Session = Depends(get_db)):
    capsule = db.query(models.TimeCapsule).filter(models.TimeCapsule.id == capsule_id).first()
    if not capsule:
        raise HTTPException(status_code=404, detail="Time capsule not found")
    capsule.is_locked = False
    db.commit()
    db.refresh(capsule)
    return capsule

@router.delete("/{capsule_id}", summary="Delete Time Capsule")
def delete_capsule(capsule_id: int, db: Session = Depends(get_db)):
    capsule = db.query(models.TimeCapsule).filter(models.TimeCapsule.id == capsule_id).first()
    if not capsule:
        raise HTTPException(status_code=404, detail="Time capsule not found")
    db.delete(capsule)
    db.commit()
    return {"message": "Time capsule erased", "id": capsule_id}
