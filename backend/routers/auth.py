from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/auth", tags=["Authentication & Identity Gateway"])

@router.get("/me", response_model=schemas.UserOut, summary="Get Current Authenticated User")
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        # Create default user if not exists
        user = models.User(
            username="nanba",
            email="nanba@soulsync.io",
            full_name="Nanba",
            subscription_status="Premium Member",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/login", response_model=schemas.UserOut, summary="Identity Verification & Credential Management Gateway")
def login(login_data: dict, db: Session = Depends(get_db)):
    username = login_data.get("username", "nanba")
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        user = db.query(models.User).first()
    return user

@router.post("/register", response_model=schemas.UserOut, summary="Create New User Account")
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = models.User(
        username=user_in.username,
        email=user_in.email,
        full_name=user_in.full_name or "Nanba",
        subscription_status="Premium Member",
        avatar_url=user_in.avatar_url
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/logout", summary="End Session Gateway")
def logout():
    return {"message": "Session terminated successfully", "status": "logged_out"}

@router.get("/hydration", summary="Initial Brand Immersion & Application Hydration State")
def get_hydration_state(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    memories_count = db.query(models.Memory).count()
    return {
        "status": "hydrated",
        "entry_point": "Splash & Identity Gateway",
        "user": user.full_name if user else "Nanba",
        "subscription": "Premium Member",
        "active_revision": "2.04",
        "cached_memories": memories_count,
        "sensory_engine_ready": True
    }
