from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = "Nanba"
    subscription_status: Optional[str] = "Premium Member"
    avatar_url: Optional[str] = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"

class UserCreate(UserBase):
    password: Optional[str] = "secret123"

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Memory Schemas
class MemoryBase(BaseModel):
    title: str = Field(..., example="The Golden Hour Picnic")
    subtitle: Optional[str] = Field("Summer 2023", example="Summer 2023")
    description: Optional[str] = Field("Sunset picnic on the vineyard hill surrounded by family laughter.", example="Sunset picnic on the vineyard hill")
    media_type: Optional[str] = Field("visual_arts", example="visual_arts") # visual_arts, motion, oral_history, journaling
    media_url: Optional[str] = Field("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80", example="https://images.unsplash.com/...")
    date_occurred: Optional[str] = Field("Summer 2023", example="Summer 2023")
    tags: Optional[str] = Field("Family, Golden Hour, Celebration", example="Family, Golden Hour")
    emotion: Optional[str] = Field("Pure Joy", example="Pure Joy")
    sensory_audio_url: Optional[str] = None
    is_favorite: Optional[bool] = False
    is_restored: Optional[bool] = True

class MemoryCreate(MemoryBase):
    pass

class MemoryOut(MemoryBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Journal Schemas
class JournalBase(BaseModel):
    title: str = Field(..., example="A Quiet Evening by the Lake")
    content: str = Field(..., example="Watching the rippling water reflections while listening to soft acoustic melodies...")
    prompt_used: Optional[str] = Field("What made this moment unforgettable?", example="What made this moment unforgettable?")
    mood: Optional[str] = Field("Serene", example="Serene")
    ai_reflection: Optional[str] = Field("A peaceful affirmation of mindfulness and presence.", example="A peaceful affirmation")
    tags: Optional[str] = Field("Reflection, Lake, Solitude", example="Reflection")

class JournalCreate(JournalBase):
    pass

class JournalOut(JournalBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Partner Space Schemas
class PartnerSpaceBase(BaseModel):
    name: str = Field(..., example="Nanba & Alex Sanctuary")
    partner_name: str = Field("Alex", example="Alex")
    partner_avatar: Optional[str] = Field(None)
    shared_memories_count: Optional[int] = 42
    sync_status: Optional[str] = "Active Sync (Heartbeat 98%)"
    last_interaction: Optional[str] = "12 minutes ago"
    cover_image: Optional[str] = None
    love_notes: Optional[str] = "Always cherish the laughter during our midnight walks under the stars."

class PartnerSpaceCreate(PartnerSpaceBase):
    pass

class PartnerSpaceOut(PartnerSpaceBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Time Capsule Schemas
class TimeCapsuleBase(BaseModel):
    title: str = Field(..., example="Letters for our 10th Anniversary")
    description: Optional[str] = Field("Photographs, voice notes and future wishes sealed until 2027.")
    unlock_date: str = Field("2027-01-01", example="2027-01-01")
    is_locked: Optional[bool] = True
    sensory_payload: Optional[str] = "Audio, 4K Video, Handwritten note"
    media_url: Optional[str] = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    release_message: Optional[str] = "Congratulations on a decade of growing together."

class TimeCapsuleCreate(TimeCapsuleBase):
    pass

class TimeCapsuleOut(TimeCapsuleBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Feeling Log Schemas
class FeelingLogBase(BaseModel):
    mood_label: str = Field(..., example="Serenity")
    emoji: Optional[str] = Field("🌿", example="🌿")
    intensity: Optional[int] = Field(8, example=8)
    reflection: Optional[str] = Field("Felt deeply centered after morning meditation.")

class FeelingLogCreate(FeelingLogBase):
    pass

class FeelingLogOut(FeelingLogBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# System Status Schema
class SystemStatus(BaseModel):
    status: str = "healthy"
    version: str = "2.04"
    app_name: str = "Soul Sync"
    active_engine: str = "Capture Memory Engine"
    database_connected: bool = True
    total_memories: int
    total_journal_entries: int
    total_time_capsules: int
