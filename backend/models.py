from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), default="Nanba")
    subscription_status = Column(String(50), default="Premium Member")
    avatar_url = Column(String(500), default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80")
    created_at = Column(DateTime, default=datetime.utcnow)

    memories = relationship("Memory", back_populates="user", cascade="all, delete-orphan")
    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")
    time_capsules = relationship("TimeCapsule", back_populates="user", cascade="all, delete-orphan")
    feelings = relationship("FeelingLog", back_populates="user", cascade="all, delete-orphan")


class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    subtitle = Column(String(150), default="Archival Preservation")
    description = Column(Text, nullable=True)
    media_type = Column(String(50), default="visual_arts")  # visual_arts, motion, oral_history, journaling
    media_url = Column(String(500), nullable=True)
    date_occurred = Column(String(50), default="Summer 2023")
    tags = Column(String(200), default="Family, Legacy")
    emotion = Column(String(50), default="Warm Nostalgia")
    sensory_audio_url = Column(String(500), nullable=True)
    is_favorite = Column(Boolean, default=False)
    is_restored = Column(Boolean, default=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="memories")


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    prompt_used = Column(String(250), default="What made this moment unforgettable?")
    mood = Column(String(50), default="Grateful")
    ai_reflection = Column(Text, default="This entry radiates connection and timeless love.")
    tags = Column(String(100), default="Reflections, Deep Memory")
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="journal_entries")


class PartnerSpace(Base):
    __tablename__ = "partner_spaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Nanba & Alex Sanctuary")
    partner_name = Column(String(100), default="Alex")
    partner_avatar = Column(String(500), default="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80")
    shared_memories_count = Column(Integer, default=42)
    sync_status = Column(String(50), default="Active Sync (Heartbeat 98%)")
    last_interaction = Column(String(50), default="12 minutes ago")
    cover_image = Column(String(500), default="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80")
    love_notes = Column(Text, default="Always cherish the laughter during our midnight walks under the stars.")
    created_at = Column(DateTime, default=datetime.utcnow)


class TimeCapsule(Base):
    __tablename__ = "time_capsules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    unlock_date = Column(String(50), default="2027-01-01")
    is_locked = Column(Boolean, default=True)
    sensory_payload = Column(String(200), default="Audio, 4K Video, Handwritten note")
    media_url = Column(String(500), default="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80")
    release_message = Column(Text, default="A message from the past to remind you of your eternal roots.")
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="time_capsules")


class FeelingLog(Base):
    __tablename__ = "feeling_logs"

    id = Column(Integer, primary_key=True, index=True)
    mood_label = Column(String(50), nullable=False)
    emoji = Column(String(20), default="✨")
    intensity = Column(Integer, default=8)  # 1 to 10
    reflection = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)

    user = relationship("User", back_populates="feelings")


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True)
    value = Column(Text, nullable=False)
