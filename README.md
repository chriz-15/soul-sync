# Soul Sync — Premium Liquid Glass Web Application 🔮

> *"Different Souls. Same Frequency."*  
> *"Real People. Deeper Connections. Not just a social app, it's a feeling."*

A next-generation social web application built with **React (JavaScript)** on the frontend, an **Express + SQL (SQLite / Supabase)** relational backend, and **Swagger/OpenAPI** interactive documentation — strictly adhering to the master reference design sheet.

---

## 🚀 Live Servers & Endpoints

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5005](http://localhost:5005)
- **Interactive Swagger Documentation**: [http://localhost:5005/api-docs](http://localhost:5005/api-docs)
- **Swagger JSON Specification**: [http://localhost:5005/api-docs.json](http://localhost:5005/api-docs.json)

---

## 🎨 Screens Implemented (100% Reference Design Fidelity)

### Row 1: Authentication & Onboarding Flow
1. **`01. Splash Screen`**:
   - Central 3D iridescent ribbon emblem with glow bloom.
   - Typography: *"Soul Sync"* + *"Real People. Deeper Connections. / Not just a social app, it's a feeling."*
   - Top right `SKIP >` button & bottom slider dots.
   - Primary `Enter Soul Sync` gradient action.
2. **`02. Login Screen`**:
   - Split layout: Left brand quote (*"Better People / Create Better Connections."*), Right Liquid Glass card (*"Welcome Back"*).
   - Username/Email, Password (eye visibility toggle), Remember Me, Forgot Password.
   - Primary gradient button, Social login dividers (Google, Apple, Instagram).
   - Navigation to Create Account.
3. **`03. Create Account Screen`**:
   - Split layout: Left quote (*"Same People. / New Stories."*), Right Liquid Glass card.
   - Full Name, Username, Email Address, Password, Terms & Conditions checkbox.
   - Transitions smoothly to OTP Verification.
4. **`04. OTP Verification Screen`**:
   - Glowing circular mail beacon icon.
   - 6 individual OTP digit boxes with auto-focus and keyboard backspace handling.
   - Countdown timer (*"Resend (00:45)"*) and `Continue` action into Main App.

### Row 2: Core Social Experience
5. **`05. Main Home / Feed Experience`**:
   - Persistent Liquid Glass Left Sidebar (Home, Explore, Messages [3], Notifications [5], Create, Community, Profile, Saved, Settings, Swagger API, User Card).
   - Stories Bar: Circular avatars with gradient rings (*Your Story +*, *Megha*, *Arjun*, *Sahana*, *Vikram*, *Priya*, *Karthik*).
   - Post Cards: Megha K at Varkala Beach, golden hour sunset photography, engagement controls (Heart, Comment, Share, Save), comment thread, interactive comment box.
   - Right Panels: Search bar, Suggested for you (*+ Follow*), Trending Frequencies (*#VarkalaSunset*, *#LiquidAndroidLive*), and *"Different Souls. Same Frequency."* quote banner.
6. **`06. Messaging / DM Screen`**:
   - 3-column layout: Persistent sidebar + Conversation list (Search, Tabs: All/Personal/Groups, online status dots, unread badges) + Active Chat Panel.
   - Chat with Megha: Incoming golden hour photo, incoming bubble (*"This place is so beautiful..."*), outgoing gradient bubble (*"Wow! Where is this?"*), incoming (*"Kovalam Beach, Kerala"*), outgoing (*"Looks amazing! Wish we were there together! 🔥"*).
   - Real-time message input bar with mic, attachment, emoji, and send buttons.
7. **`07. Profile Screen`**:
   - Panoramic cover banner, avatar with glowing purple/cyan ring, bio (*"Travel | Photography | Music / Kerala, India"*), stats (*248 Posts, 12.4K Followers, 386 Following*).
   - Follow & Message buttons, Highlights circles (*Travel, Friends, Sunsets, Vibes*).
   - Media Tabs (*Posts, Reels, Tagged*) and full 3x3 photo grid.
   - Right About panel: Location, joined date, resonance frequency.

### Row 3: Feature Views & Additional States
8. **`08. Create Post / Story / Reel`**:
   - Tabs: `Post`, `Story`, `Reel`.
   - Dashed glass dropzone with "+" icon (*"Drag & drop photos or videos / or Click to upload"*).
   - Live photo preview card with author and caption.
   - Caption textarea, Add Location, Tag People, More Options, and Share button.
9. **`09. Explore / Discover`**:
   - Search bar + Category filter pills: `For You`, `People`, `Places`, `Tags`.
   - Masonry-style discover grid with gradient overlays, titles, and like counters.
10. **`10. Notifications`**:
    - Filter tabs: `All`, `Likes`, `Comments`, `Follows`, `Mentions`.
    - Rich interactive cards with actor avatars, action icons, timestamps, and Follow back actions.
11. **`11. Settings`**:
    - Account, Privacy & Security (Private account toggle), Notifications (Push toggle), Messages, Appearance, Language, Help & Support, About Soul Sync, and Logout.
12. **`12. Additional Screens & States`**:
    - **Saved**: Saved posts collection grid.
    - **Archive**: Empty state (*"No archives yet / Only you can see the posts you archive"*).
    - **Report Modal**: Interactive dialog to report posts or users.
    - **Empty State**: Friendly illustration and *"Explore"* CTA.

---

## 💾 Relational SQL Database Architecture

- **SQLite Database** (`backend/db/soulsync.db`) pre-seeded with complete data for all screens.
- **Supabase Integration**: Frontend (`frontend/src/services/supabaseClient.js`) and backend are configured to plug in your cloud Supabase credentials whenever desired.
- **SQL Tables**:
  - `users`: User identity, credentials, avatars, follower counts.
  - `posts`: Media URLs, captions, locations, likes, shares, comments count.
  - `comments`: Comment strings, timestamps, user associations.
  - `stories`: Active user stories.
  - `conversations`: Chat rooms, last message snippets, unread counters.
  - `messages`: Individual message texts, media URLs, timestamps.
  - `notifications`: Alerts, actor associations, read status.
  - `saved_posts`: Bookmarked posts collection.
  - `user_settings`: Preferences, theme, privacy flags.

---

## 🛠️ Running Locally

1. **Install Dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5005
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:3000
   ```
