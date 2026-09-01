from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/settings", tags=["Configuration & Hardware Integration"])

DEFAULT_SETTINGS = {
    "privacy_mode": "Encrypted Sanctuary",
    "cloud_sync": "Active",
    "sensory_audio_engine": "Spatial Binaural 3D",
    "color_restoration_ai": "Enabled (Intelligent Restoration)",
    "preferred_preservation_formats": ["visual_arts", "motion", "oral_history", "journaling"],
    "hardware_integration": {
        "spatial_mic": "Connected",
        "haptic_sync": "Enabled",
        "smart_display": "SoulSync Vault Frame"
    }
}

@router.get("", summary="Get Global Configuration & Hardware Settings")
def get_settings(db: Session = Depends(get_db)):
    settings_records = db.query(models.Setting).all()
    if not settings_records:
        return DEFAULT_SETTINGS
    
    result = {}
    for item in settings_records:
        result[item.key] = item.value
    return {**DEFAULT_SETTINGS, **result}

@router.post("", summary="Update Configuration & Hardware Integration")
def update_settings(payload: dict, db: Session = Depends(get_db)):
    for k, v in payload.items():
        val_str = str(v)
        rec = db.query(models.Setting).filter(models.Setting.key == k).first()
        if rec:
            rec.value = val_str
        else:
            db.add(models.Setting(key=k, value=val_str))
    db.commit()
    return {"message": "Settings updated successfully", "updated": payload}
