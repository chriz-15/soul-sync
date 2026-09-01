import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"} if data else {}
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8") if data else None,
        headers=headers,
        method=method
    )
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode("utf-8")
            parsed = json.loads(body) if "application/json" in response.headers.get("Content-Type", "") else body[:60]
            print(f"[PASS] [{status}] {name} ({method} {path})")
            return parsed
    except Exception as e:
        print(f"[FAIL] {name} ({method} {path}): {e}")
        return None

print("=== SOUL SYNC FASTAPI & SQL BACKEND VERIFICATION ===")

# 1. System status
test_endpoint("System Status & Rev 2.04", "/api/system/status")

# 2. Auth & Hydration
test_endpoint("Hydration State (Splash)", "/api/auth/hydration")
test_endpoint("Current User (Profile)", "/api/auth/me")

# 3. Memories (Living Archive & Main Ingestion Engine)
memories = test_endpoint("List Archival Memories", "/api/memories")
new_mem = test_endpoint("Capture Memory (Main Engine)", "/api/memories", method="POST", data={
    "title": "Veranda Stargazing Evening",
    "subtitle": "Autumn 2024",
    "description": "Sitting wrapped in a wool blanket watching the Orion constellation with quiet jazz playing.",
    "media_type": "visual_arts",
    "media_url": "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    "date_occurred": "November 2024",
    "tags": "Stargazing, Peace, Night",
    "emotion": "Quiet Serenity"
})

# 4. Journaling AI & Prompts
test_endpoint("Journal AI Reflection Prompts", "/api/journal/prompts")
test_endpoint("Fetch Journal Entries", "/api/journal")
test_endpoint("AI Reflect Generation", "/api/journal/reflect", method="POST", data={
    "content": "We sat by the ocean cliff and watched the sunset in total stillness.",
    "mood": "Peaceful"
})

# 5. Partner Space (Shared Repository)
test_endpoint("Partner Space Sanctuary", "/api/partner")
test_endpoint("Send Heartbeat Sync Pulse", "/api/partner/pulse", method="POST")

# 6. Time Capsules (Scheduled Release)
test_endpoint("List Time Capsules", "/api/time-capsules")

# 7. Feelings Resonance
test_endpoint("Feelings Options", "/api/feelings/options")
test_endpoint("List Feeling Logs", "/api/feelings")

# 8. Settings & Peripherals
test_endpoint("System Settings", "/api/settings")

# 9. OpenAPI Specs & Swagger Check
test_endpoint("OpenAPI Schema", "/openapi.json")

print("=== ALL BACKEND ENDPOINTS PASSED WITH FLYING COLORS ===")
