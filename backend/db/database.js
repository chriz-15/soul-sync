const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'soulsync.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite:', err.message);
  } else {
    console.log('✨ Connected to Soul Sync database at:', dbPath);
    db.run('PRAGMA foreign_keys = ON;');
    initSchema();
  }
});

function initSchema() {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql, (err) => {
    if (err) {
      console.error('❌ Schema initialization error:', err.message);
    } else {
      console.log('✅ Soul Sync relational schema verified.');

      // Check and add theme/wallpaper columns if missing
      db.all("PRAGMA table_info(channels)", (pErr, cols) => {
        if (!pErr && Array.isArray(cols)) {
          const names = cols.map(c => c.name);
          if (!names.includes('theme_type')) db.run("ALTER TABLE channels ADD COLUMN theme_type TEXT DEFAULT 'default'");
          if (!names.includes('theme_color')) db.run("ALTER TABLE channels ADD COLUMN theme_color TEXT DEFAULT NULL");
          if (!names.includes('wallpaper_url')) db.run("ALTER TABLE channels ADD COLUMN wallpaper_url TEXT DEFAULT NULL");
          if (!names.includes('custom_wallpaper')) db.run("ALTER TABLE channels ADD COLUMN custom_wallpaper TEXT DEFAULT NULL");
          if (!names.includes('invite_code')) db.run("ALTER TABLE channels ADD COLUMN invite_code TEXT DEFAULT NULL");
        }
      });

      // Auto seed if users table is empty
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (!err && row && row.count === 0) {
          const { seedDatabase } = require('./seed');
          seedDatabase(db);
        } else {
          // If users exist but soul_moments is empty, seed moments
          db.get('SELECT COUNT(*) as count FROM soul_moments', (mErr, mRow) => {
            if (!mErr && mRow && mRow.count === 0) {
              console.log('🌱 Seeding initial Soul Moments...');
              const collections = [
                { id: 1, userId: 1, name: '✈️ Travel', icon: '✈️' },
                { id: 2, userId: 1, name: '❤️ Favorites', icon: '❤️' },
                { id: 3, userId: 1, name: '✨ Special Moments', icon: '✨' },
                { id: 4, userId: 1, name: '🎓 College Days', icon: '🎓' },
                { id: 5, userId: 1, name: '🎂 Birthdays', icon: '🎂' }
              ];
              const collStmt = db.prepare('INSERT OR IGNORE INTO moment_collections (id, user_id, name, icon) VALUES (?, ?, ?, ?)');
              collections.forEach((c) => collStmt.run(c.id, c.userId, c.name, c.icon));
              collStmt.finalize();

              const moments = [
                {
                  userId: 1,
                  postId: 1,
                  memoryType: 'on_this_day',
                  memoryDate: '2025-09-21',
                  yearsAgo: 1,
                  title: 'Varkala Cliff Sunset',
                  caption: 'A golden evening with the sea breeze that made time stand still. One year since this perfect dusk.',
                  mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
                  location: 'Varkala Cliff, Kerala',
                  peopleInvolved: 'Megha, Arjun',
                  privateNote: 'We sat by the cliff edge for 3 hours just talking about life and frequency. Still one of the most grounding days.',
                  collectionId: 1
                },
                {
                  userId: 1,
                  postId: 2,
                  memoryType: 'on_this_day',
                  memoryDate: '2024-09-21',
                  yearsAgo: 2,
                  title: 'Pine Mist Sunrise Hike',
                  caption: 'Morning trek through the Himalayan pines. Silence that spoke louder than any words.',
                  mediaUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&auto=format&fit=crop&q=80',
                  location: 'Old Manali, Himachal',
                  peopleInvolved: 'Arjun, Vikram',
                  privateNote: 'My first mountain expedition with the crew. The cold morning tea at the summit was priceless.',
                  collectionId: 2
                },
                {
                  userId: 1,
                  postId: null,
                  memoryType: 'milestone',
                  memoryDate: '2025-08-14',
                  yearsAgo: 1,
                  title: 'Midnight Acoustic Jam',
                  caption: 'Strumming ancient chords under the coastal moonlight. Pure vibrational connection.',
                  mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
                  location: 'Fort Kochi, Kerala',
                  peopleInvolved: 'Vikram',
                  privateNote: 'Vikram improvised the melody on his nylon guitar while we recorded ambient ocean sounds.',
                  collectionId: 3
                },
                {
                  userId: 1,
                  postId: 3,
                  memoryType: 'saved',
                  memoryDate: '2025-07-02',
                  yearsAgo: 1,
                  title: 'Old Town Heritage Walk',
                  caption: 'Cobblestone alleys, vintage balconies, and timeless Portuguese architecture.',
                  mediaUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1000&auto=format&fit=crop&q=80',
                  location: 'Fontainhas, Goa',
                  peopleInvolved: 'Sahana',
                  privateNote: 'Took 80+ photos with Sahana’s vintage film camera.',
                  collectionId: 1
                },
                {
                  userId: 1,
                  postId: null,
                  memoryType: 'milestone',
                  memoryDate: '2023-06-18',
                  yearsAgo: 3,
                  title: 'Campus Graduation Evening',
                  caption: 'Caps in the air, dreams in the heart. Here is to the souls who became lifelong family.',
                  mediaUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80',
                  location: 'Bangalore, India',
                  peopleInvolved: 'College Circle',
                  privateNote: 'The day we promised we would build Soul Sync together.',
                  collectionId: 4
                }
              ];

              const momentStmt = db.prepare(`
                INSERT INTO soul_moments (user_id, post_id, memory_type, memory_date, years_ago, title, caption, media_url, location, people_involved, private_note, collection_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `);
              moments.forEach((m) => {
                momentStmt.run(m.userId, m.postId, m.memoryType, m.memoryDate, m.yearsAgo, m.title, m.caption, m.mediaUrl, m.location, m.peopleInvolved, m.privateNote, m.collectionId);
              });
              momentStmt.finalize();
              console.log('✨ Soul Moments successfully seeded.');
            }
          });
        }
      });
    }
  });
}

const dbAsync = {
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  run: (sql, params = []) => {
    return new Promise(function (resolve, reject) {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = {
  db,
  dbAsync
};
