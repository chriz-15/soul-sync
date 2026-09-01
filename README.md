# Soul Sync — Capture, Cherish, Relive

<div align="center">
  <h3>Living Archive & Sensory Memory Sanctuary</h3>
  <p>A luxury archival web application powered by <strong>React, Tailwind CSS v3, FastAPI, SQLAlchemy, and SQLite</strong> with interactive <strong>Swagger UI</strong>.</p>
</div>

---

## ✨ Key Features & Screen Flows

1. **🌸 Splash Screen (Picture 4)**: Radiant glowing bokeh heart particles, Soul Sync crimson emblem, luxury typography, and smooth navigation flow.
2. **01 Introduction (Picture 3)**: Split-card layout with dark *Living Archive* panel and clean white *Capture Moments That Matter* onboarding card.
3. **02 Personalization (Picture 2)**: *Your Story, Your Way.* with 4 interactive preservation formats (**Visual Arts**, **Motion**, **Oral History**, and **Journaling**).
4. **03 Connection (Picture 5)**: *Relive the Feelings.* with 3D tilted layered polaroid stack (*The Golden Hour Picnic*, handwritten letter, lakehouse view) and floating **● MEMORY RESTORED** badge.
5. **⚡ Home Dashboard (Picture 1)**: Full Obsidian & Gold Dashboard (Revision 2.04) with sidebar navigation, node flow architecture (*Splash* ➔ *Login/Sign Up*), **— MAIN ENGINE: CAPTURE MEMORY** hero card, 4 action cards (*Timeline*, *Journal*, *Partner Space*, *Time Capsule*), quick action toolbar, Settings & Log Out.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Tailwind CSS v3, Vite, Lucide Icons, Canvas Bokeh Particle Animation, Canvas Confetti.
- **Middleware API**: FastAPI, Uvicorn, Pydantic, CORS.
- **Database / ORM**: SQLite (`soulsync.db`), SQLAlchemy.
- **Documentation**: Interactive OpenAPI / Swagger UI at `/docs` and ReDoc at `/redoc`.

---

## 🚀 Quick Start Guide

### 1. Start the FastAPI Middleware Backend
```bash
cd backend
python -m pip install fastapi uvicorn sqlalchemy pydantic python-multipart
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger docs will be available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend web application will be live at: [http://localhost:5173/](http://localhost:5173/)
