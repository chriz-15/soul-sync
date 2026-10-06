-- =============================================
-- Soul Sync Relational SQL Database Schema
-- Compatible with SQLite & Supabase PostgreSQL
-- =============================================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    cover_url TEXT,
    bio TEXT,
    location TEXT DEFAULT 'Kerala, India',
    followers_count INTEGER DEFAULT 12400,
    following_count INTEGER DEFAULT 386,
    posts_count INTEGER DEFAULT 248,
    is_verified BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    caption TEXT,
    media_url TEXT NOT NULL,
    location TEXT,
    likes_count INTEGER DEFAULT 1284,
    comments_count INTEGER DEFAULT 48,
    shares_count INTEGER DEFAULT 24,
    is_saved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    media_url TEXT NOT NULL,
    is_viewed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    last_message TEXT,
    last_message_time TEXT,
    unread_count INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER,
    text TEXT,
    media_url TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'like', 'comment', 'follow', 'mention'
    text TEXT NOT NULL,
    target_media_url TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE(user_id, post_id)
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER PRIMARY KEY,
    theme TEXT DEFAULT 'liquid-dark',
    private_account BOOLEAN DEFAULT 0,
    message_requests BOOLEAN DEFAULT 1,
    push_notifications BOOLEAN DEFAULT 1,
    email_notifications BOOLEAN DEFAULT 0,
    language TEXT DEFAULT 'English (US)',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS moment_collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '✨',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS soul_moments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER,
    memory_type TEXT DEFAULT 'on_this_day', -- 'on_this_day', 'milestone', 'saved', 'custom'
    memory_date TEXT NOT NULL,
    years_ago INTEGER DEFAULT 1,
    title TEXT,
    caption TEXT,
    media_url TEXT NOT NULL,
    location TEXT,
    people_involved TEXT,
    private_note TEXT,
    collection_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,
    FOREIGN KEY (collection_id) REFERENCES moment_collections(id) ON DELETE SET NULL
);

-- =============================================
-- Permanent Account-Bound Channels
-- =============================================
CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id TEXT UNIQUE NOT NULL,
    owner_user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    channel_type TEXT DEFAULT 'channel',
    avatar_url TEXT,
    is_pinned BOOLEAN DEFAULT 0,
    show_on_profile BOOLEAN DEFAULT 0,
    allow_replies BOOLEAN DEFAULT 0,
    theme_type TEXT DEFAULT 'default',
    theme_color TEXT DEFAULT NULL,
    wallpaper_url TEXT DEFAULT NULL,
    custom_wallpaper TEXT DEFAULT NULL,
    invite_code TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT 0,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS channel_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(channel_id, user_id)
);
