// Seed database with realistic data strictly matching the reference screens
function seedDatabase(db) {
  console.log('🌱 Seeding database with reference screens dataset...');

  // 1. Users
  const users = [
    {
      name: 'Christon Thomas',
      username: 'christon',
      email: 'christon@gmail.com',
      password_hash: Buffer.from('password123').toString('base64'),
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      bio: 'Creating experiences • Soul Sync explorer',
      location: 'Bangalore, India',
      followers_count: 1420,
      following_count: 412,
      posts_count: 36
    },
    {
      name: 'Megha',
      username: 'megha_official',
      email: 'megha@soulsync.io',
      password_hash: Buffer.from('password123').toString('base64'),
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      bio: 'Travel | Photography | Music\nKerala, India',
      location: 'Varkala, Kerala',
      followers_count: 12400,
      following_count: 386,
      posts_count: 248
    },
    {
      name: 'Arjun',
      username: 'arjun_v',
      email: 'arjun@soulsync.io',
      password_hash: Buffer.from('password123').toString('base64'),
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
      bio: 'Mountain seeker • Cinematic storyteller',
      location: 'Manali, India',
      followers_count: 8400,
      following_count: 290,
      posts_count: 112
    },
    {
      name: 'Sahana',
      username: 'sahana_m',
      email: 'sahana@soulsync.io',
      password_hash: Buffer.from('password123').toString('base64'),
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      bio: 'Architectural soul & ocean lover',
      location: 'Goa, India',
      followers_count: 5120,
      following_count: 310,
      posts_count: 84
    },
    {
      name: 'Vikram',
      username: 'vikram_r',
      email: 'vikram@soulsync.io',
      password_hash: Buffer.from('password123').toString('base64'),
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
      bio: 'Acoustic vibes & midnight thoughts',
      location: 'Kochi, Kerala',
      followers_count: 4230,
      following_count: 180,
      posts_count: 67
    },
    {
      name: 'Priya',
      username: 'priya_arts',
      email: 'priya@soulsync.io',
      password_hash: Buffer.from('password123').toString('base64'),
      avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      bio: 'Digital artist & aesthetic curator',
      location: 'Mumbai, India',
      followers_count: 9810,
      following_count: 440,
      posts_count: 154
    },
    {
      name: 'Karthik',
      username: 'karthik_lens',
      email: 'karthik@soulsync.io',
      password_hash: Buffer.from('password123').toString('base64'),
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      bio: 'Capturing untamed wilderness',
      location: 'Wayanad, Kerala',
      followers_count: 6700,
      following_count: 220,
      posts_count: 98
    }
  ];

  db.serialize(() => {
    const userStmt = db.prepare(`
      INSERT INTO users (id, name, username, email, password_hash, avatar_url, cover_url, bio, location, followers_count, following_count, posts_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    users.forEach((u, i) => {
      userStmt.run(i + 1, u.name, u.username, u.email, u.password_hash, u.avatar_url, u.cover_url, u.bio, u.location, u.followers_count, u.following_count, u.posts_count);
    });
    userStmt.finalize();

    // 2. Stories matching reference screen 05
    const stories = [
      { userId: 1, mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { userId: 2, mediaUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
      { userId: 3, mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { userId: 4, mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
      { userId: 5, mediaUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
      { userId: 6, mediaUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80' }
    ];

    const storyStmt = db.prepare('INSERT INTO stories (user_id, media_url) VALUES (?, ?)');
    stories.forEach((s) => storyStmt.run(s.userId, s.mediaUrl));
    storyStmt.finalize();

    // 3. Posts (Primary post: Megha's Varkala Beach sunset from Screen 05 & 07)
    const posts = [
      {
        userId: 2,
        caption: 'Golden hour hues never disappoint 🌅✨ When the sky turns into pure poetry over the Arabian Sea. Take a deep breath and let the frequency sink in.',
        mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
        location: 'Varkala Beach, Kerala',
        likesCount: 1284,
        commentsCount: 48,
        sharesCount: 24,
        isSaved: 1
      },
      {
        userId: 3,
        caption: 'Misty dawns and whispering pines. The silence here heals everything you did not know was broken. 🌲⛰️',
        mediaUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&auto=format&fit=crop&q=80',
        location: 'Munnar Hills, Kerala',
        likesCount: 940,
        commentsCount: 32,
        sharesCount: 18,
        isSaved: 0
      },
      {
        userId: 4,
        caption: 'Where the waves rewrite our stories with every tide. Forever in love with coastal sunsets. 🌊🧡',
        mediaUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1000&auto=format&fit=crop&q=80',
        location: 'Kovalam Beach, Kerala',
        likesCount: 1120,
        commentsCount: 56,
        sharesCount: 29,
        isSaved: 1
      },
      {
        userId: 6,
        caption: 'Neon soul reflections in midnight rain. Liquid glass dreaming. 🔮✨',
        mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
        location: 'Fort Kochi, Kerala',
        likesCount: 1540,
        commentsCount: 64,
        sharesCount: 45,
        isSaved: 0
      }
    ];

    const postStmt = db.prepare(`
      INSERT INTO posts (user_id, caption, media_url, location, likes_count, comments_count, shares_count, is_saved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    posts.forEach((p) => {
      postStmt.run(p.userId, p.caption, p.mediaUrl, p.location, p.likesCount, p.commentsCount, p.sharesCount, p.isSaved);
    });
    postStmt.finalize();

    // 4. Comments for Post 1
    const comments = [
      { postId: 1, userId: 3, text: 'Beautiful shot! 💖 The colors look unreal.' },
      { postId: 1, userId: 4, text: 'Varkala never gets old! Need to visit again soon.' },
      { postId: 1, userId: 1, text: 'Breathtaking view Megha! The horizon is sublime.' }
    ];
    const commStmt = db.prepare('INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)');
    comments.forEach((c) => commStmt.run(c.postId, c.userId, c.text));
    commStmt.finalize();

    // 5. Conversations & Messages (Screen 06 exact representation)
    const convStmt = db.prepare(`
      INSERT INTO conversations (id, user1_id, user2_id, last_message, last_message_time, unread_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    convStmt.run(1, 1, 2, 'Did you see sunset? 🔥', '10:45', 1);
    convStmt.run(2, 1, 3, 'That was crazy! 🚀', '10:42', 0);
    convStmt.run(3, 1, 4, "That's amazing! ✨", '11:20', 0);
    convStmt.run(4, 1, 5, 'Sure, let’s talk tonight.', '09:15', 0);
    convStmt.run(5, 1, 6, 'Haha true! 😂', 'Yesterday', 0);
    convStmt.run(6, 1, 7, 'Call ended', 'Yesterday', 0);
    convStmt.finalize();

    // Messages between Christon (1) and Megha (2)
    const msgStmt = db.prepare(`
      INSERT INTO messages (conversation_id, sender_id, receiver_id, text, media_url, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    // Megha sends beach sunset photo
    msgStmt.run(1, 2, 1, null, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', 1, '2026-09-20 10:38:00');
    // Megha says: "This place is so beautiful..."
    msgStmt.run(1, 2, 1, 'This place is so beautiful...', null, 1, '2026-09-20 10:39:00');
    // Christon says: "Wow! Where is this?"
    msgStmt.run(1, 1, 2, 'Wow! Where is this?', null, 1, '2026-09-20 10:40:00');
    // Megha says: "Kovalam Beach, Kerala"
    msgStmt.run(1, 2, 1, 'Kovalam Beach, Kerala', null, 1, '2026-09-20 10:42:00');
    // Christon says: "Looks amazing! Wish we were there together! 🔥"
    msgStmt.run(1, 1, 2, 'Looks amazing! Wish we were there together! 🔥', null, 1, '2026-09-20 10:44:00');
    // Megha sends final message: "Did you see sunset? 🔥"
    msgStmt.run(1, 2, 1, 'Did you see sunset? 🔥', null, 0, '2026-09-20 10:45:00');
    msgStmt.finalize();

    // 6. Notifications (Screen 10 exact representation)
    const notifs = [
      { userId: 1, actorId: 2, type: 'like', text: 'Megha liked your post', media: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=80' },
      { userId: 1, actorId: 3, type: 'comment', text: "Arjun commented: 'Beautiful shot! 💖'", media: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=80' },
      { userId: 1, actorId: 4, type: 'follow', text: 'Sahana started following you', media: null },
      { userId: 1, actorId: 5, type: 'like', text: 'Vikram liked your story', media: null },
      { userId: 1, actorId: 6, type: 'mention', text: 'Priya mentioned you in a comment', media: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80' },
      { userId: 1, actorId: 7, type: 'like', text: 'Karthik and 3 others liked your post', media: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=100&auto=format&fit=crop&q=80' }
    ];

    const notifStmt = db.prepare('INSERT INTO notifications (user_id, actor_id, type, text, target_media_url) VALUES (?, ?, ?, ?, ?)');
    notifs.forEach((n) => notifStmt.run(n.userId, n.actorId, n.type, n.text, n.media));
    notifStmt.finalize();

    // 7. Saved posts
    db.run('INSERT INTO saved_posts (user_id, post_id) VALUES (1, 1), (1, 3)');

    // 8. User settings
    db.run('INSERT INTO user_settings (user_id, theme, private_account, push_notifications) VALUES (1, "liquid-dark", 0, 1)');

    // 9. Soul Moments Collections (User 1)
    const collections = [
      { id: 1, userId: 1, name: '🌅 Travel Moments', icon: '🌅' },
      { id: 2, userId: 1, name: '❤️ Favorite Memories', icon: '❤️' },
      { id: 3, userId: 1, name: '✨ Special Days', icon: '✨' },
      { id: 4, userId: 1, name: '🎓 College Days', icon: '🎓' }
    ];
    const collStmt = db.prepare('INSERT INTO moment_collections (id, user_id, name, icon) VALUES (?, ?, ?, ?)');
    collections.forEach((c) => collStmt.run(c.id, c.userId, c.name, c.icon));
    collStmt.finalize();

    // 10. Soul Moments (User 1) - Realistic historical memories & "On This Day"
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

    console.log('✅ Database successfully populated with high-fidelity Soul Sync seed data.');
  });
}

module.exports = { seedDatabase };
