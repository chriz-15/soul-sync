from datetime import datetime
from database import engine, SessionLocal, Base
import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(models.User).first():
        print("Database already contains data, skipping initial seed.")
        db.close()
        return

    print("Seeding Soul Sync database with authentic archival memories...")

    # 1. Create Default User
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

    # 2. Seed Memories
    memories = [
        models.Memory(
            title="The Golden Hour Picnic",
            subtitle="Summer 2023",
            description="Warm sunlight filtering through the vineyard arbor as we toasted to new milestones and endless laughter.",
            media_type="visual_arts",
            media_url="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
            date_occurred="Summer 2023",
            tags="Family, Golden Hour, Celebration",
            emotion="Nostalgic Warmth",
            sensory_audio_url="https://actions.google.com/sounds/v1/ambiences/outdoor_park_gentle_breeze.ogg",
            is_favorite=True,
            is_restored=True,
            user_id=user.id
        ),
        models.Memory(
            title="A Handwritten Letter From 1946",
            subtitle="October 12th, 1946",
            description="A deeply touching cursive letter preserved across three generations. 'My Darling, I hope this letter finds you well...'",
            media_type="journaling",
            media_url="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=1200&q=85",
            date_occurred="October 12, 1946",
            tags="Heritage, Ancestry, Written Word",
            emotion="Quiet Serenity",
            sensory_audio_url=None,
            is_favorite=True,
            is_restored=True,
            user_id=user.id
        ),
        models.Memory(
            title="Sunset at the Lakehouse Sanctuary",
            subtitle="Autumn Solstice",
            description="Still glass waters reflecting the twilight gradients as dusk settled over the hills.",
            media_type="motion",
            media_url="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
            date_occurred="Autumn 2023",
            tags="Peace, Sanctuary, Solitude",
            emotion="Awe & Wonder",
            sensory_audio_url="https://actions.google.com/sounds/v1/water/gentle_lake_lapping.ogg",
            is_favorite=False,
            is_restored=True,
            user_id=user.id
        ),
        models.Memory(
            title="Grandfather's Storytelling Evening",
            subtitle="Oral History Archive",
            description="A spatial audio recording of stories told by the fireplace, capturing the exact cadence and warmth of his voice.",
            media_type="oral_history",
            media_url="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=85",
            date_occurred="Winter 2022",
            tags="Voice, Heritage, Oral History",
            emotion="Deep Connection",
            sensory_audio_url="https://actions.google.com/sounds/v1/ambiences/fireplace_crackling.ogg",
            is_favorite=True,
            is_restored=True,
            user_id=user.id
        )
    ]
    db.add_all(memories)

    # 3. Seed Journal Entries
    journal_entries = [
        models.JournalEntry(
            title="The Texture of a Sunday Morning",
            content="Woke up to soft morning light streaming through sheer linen curtains. The aroma of freshly brewed Ethiopian coffee mingled with the crisp autumn breeze. We spoke about where we want to be five years from now.",
            prompt_used="What made this moment feel unforgettable and alive?",
            mood="Grateful & Centered",
            ai_reflection="This entry preserves the delicate sensory beauty of an ordinary morning made extraordinary by intimacy and shared dreams.",
            tags="Morning, Presence, Love",
            user_id=user.id
        ),
        models.JournalEntry(
            title="Finding Peace Along the Coastal Ridge",
            content="Walking along the cliffs while the mist rolled off the Pacific. It felt as if time suspended itself. All worries faded into the rhythmic crashing of the waves below.",
            prompt_used="Describe the feeling of warmth that remains when you look back on this day.",
            mood="Serenity",
            ai_reflection="Nature's cadence brought you grounding clarity. A cornerstone memory to return to whenever life feels crowded.",
            tags="Nature, Ocean, Healing",
            user_id=user.id
        )
    ]
    db.add_all(journal_entries)

    # 4. Seed Partner Space
    partner_space = models.PartnerSpace(
        name="Nanba & Alex Sanctuary",
        partner_name="Alex",
        partner_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        shared_memories_count=42,
        sync_status="Active Sync (Heartbeat 98%)",
        last_interaction="5 minutes ago",
        cover_image="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
        love_notes="Always cherish the laughter during our midnight walks under the stars. Here is to a lifetime of shared stories."
    )
    db.add(partner_space)

    # 5. Seed Time Capsules
    capsules = [
        models.TimeCapsule(
            title="Our 10-Year Milestone Vault",
            description="A curated compilation of photographs, voice whispers, and handwritten vows sealed until 2027.",
            unlock_date="2027-01-01",
            is_locked=True,
            sensory_payload="Spatial Audio, 4K Cinema Reels, High-Res Letters",
            media_url="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
            release_message="A decade of shared growth, laughter, and unbreakable roots. Open with a bottle of aged wine.",
            user_id=user.id
        ),
        models.TimeCapsule(
            title="Future Wisdom Capsule: 2030",
            description="Reflections recorded on life lessons, hopes for our children, and the philosophy guiding our household.",
            unlock_date="2030-06-15",
            is_locked=True,
            sensory_payload="Oral History Master Track & Video Message",
            media_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            release_message="Remember where you started, how bravely you navigated uncertainty, and how much love surrounded you.",
            user_id=user.id
        )
    ]
    db.add_all(capsules)

    # 6. Seed Feeling Logs
    feelings = [
        models.FeelingLog(
            mood_label="Nostalgic Warmth",
            emoji="🌅",
            intensity=9,
            reflection="Looking over old family photo albums brought such a rush of profound gratitude.",
            user_id=user.id
        ),
        models.FeelingLog(
            mood_label="Deep Connection",
            emoji="💫",
            intensity=8,
            reflection="Shared a 2-hour conversation with Alex without looking at our phones once.",
            user_id=user.id
        )
    ]
    db.add_all(feelings)

    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
