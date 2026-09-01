from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/memories", tags=["Memory Ingestion & Living Archive"])

@router.get("", response_model=List[schemas.MemoryOut], summary="Fetch Archival Memories & Sensory Stream")
def list_memories(
    media_type: Optional[str] = Query(None, description="Filter by format: visual_arts, motion, oral_history, journaling"),
    emotion: Optional[str] = Query(None, description="Filter by emotion"),
    search: Optional[str] = Query(None, description="Search keyword in title, description or tags"),
    is_favorite: Optional[bool] = Query(None, description="Filter favorite memories"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Memory)
    if media_type:
        query = query.filter(models.Memory.media_type == media_type)
    if emotion:
        query = query.filter(models.Memory.emotion.ilike(f"%{emotion}%"))
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (models.Memory.title.ilike(search_fmt)) |
            (models.Memory.description.ilike(search_fmt)) |
            (models.Memory.tags.ilike(search_fmt))
        )
    if is_favorite is not None:
        query = query.filter(models.Memory.is_favorite == is_favorite)
    
    return query.order_by(models.Memory.id.desc()).all()

@router.post("", response_model=schemas.MemoryOut, status_code=status.HTTP_201_CREATED, summary="Capture Memory (Main Ingestion Engine)")
def create_memory(memory_in: schemas.MemoryCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    user_id = user.id if user else 1

    new_memory = models.Memory(
        title=memory_in.title,
        subtitle=memory_in.subtitle or "Archival Preservation",
        description=memory_in.description,
        media_type=memory_in.media_type or "visual_arts",
        media_url=memory_in.media_url or "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
        date_occurred=memory_in.date_occurred or "Summer 2023",
        tags=memory_in.tags or "Family, Legacy",
        emotion=memory_in.emotion or "Warm Nostalgia",
        sensory_audio_url=memory_in.sensory_audio_url,
        is_favorite=memory_in.is_favorite or False,
        is_restored=True,
        user_id=user_id
    )
    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)
    return new_memory

@router.get("/{memory_id}", response_model=schemas.MemoryOut, summary="Get Single Archival Memory")
def get_memory(memory_id: int, db: Session = Depends(get_db)):
    memory = db.query(models.Memory).filter(models.Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found in archive")
    return memory

@router.put("/{memory_id}", response_model=schemas.MemoryOut, summary="Update Memory Metadata")
def update_memory(memory_id: int, memory_in: schemas.MemoryCreate, db: Session = Depends(get_db)):
    memory = db.query(models.Memory).filter(models.Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found in archive")
    
    for key, value in memory_in.dict().items():
        setattr(memory, key, value)
    
    db.commit()
    db.refresh(memory)
    return memory

@router.delete("/{memory_id}", summary="Delete Archival Memory")
def delete_memory(memory_id: int, db: Session = Depends(get_db)):
    memory = db.query(models.Memory).filter(models.Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found in archive")
    db.delete(memory)
    db.commit()
    return {"message": "Memory removed from archive", "id": memory_id}

@router.post("/{memory_id}/restore", response_model=schemas.MemoryOut, summary="Intelligent AI Color & Sensory Restoration")
def restore_memory(memory_id: int, db: Session = Depends(get_db)):
    memory = db.query(models.Memory).filter(models.Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found in archive")
    memory.is_restored = True
    db.commit()
    db.refresh(memory)
    return memory
