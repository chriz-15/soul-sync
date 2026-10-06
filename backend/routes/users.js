const express = require('express');
const router = express.Router();
const { dbAsync } = require('../db/database');

/**
 * @swagger
 * tags:
 *   name: Users & Profiles
 *   description: Profiles, explore feed, and relationship graph
 */

/**
 * @swagger
 * /api/users/profile/{username}:
 *   get:
 *     summary: Get profile information and posts grid for a user
 *     tags: [Users & Profiles]
 */
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await dbAsync.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const posts = await dbAsync.all('SELECT * FROM posts WHERE user_id = ? ORDER BY id DESC', [user.id]);
    const { password_hash, ...safeUser } = user;

    return res.json({
      success: true,
      profile: {
        ...safeUser,
        posts
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

/**
 * @swagger
 * /api/users/explore:
 *   get:
 *     summary: Retrieve explore grid items with categories
 *     tags: [Users & Profiles]
 */
router.get('/explore', async (req, res) => {
  try {
    // High-resolution photography items matching Screen 09
    const exploreItems = [
      { id: 1, media_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', title: 'Sunset Serenity', category: 'Places', likes_count: 1240, user: 'Megha' },
      { id: 2, media_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80', title: 'Mountain Mist', category: 'Places', likes_count: 980, user: 'Arjun' },
      { id: 3, media_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80', title: 'Ocean Waves', category: 'Places', likes_count: 1450, user: 'Sahana' },
      { id: 4, media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', title: 'Neon Reflections', category: 'Tags', likes_count: 2100, user: 'Priya' },
      { id: 5, media_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80', title: 'Golden Hour Portrait', category: 'People', likes_count: 3400, user: 'Megha' },
      { id: 6, media_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80', title: 'Coastal Wanderer', category: 'People', likes_count: 1150, user: 'Vikram' }
    ];

    return res.json({ success: true, explore: exploreItems });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load explore feed' });
  }
});

/**
 * @swagger
 * /api/users/suggested:
 *   get:
 *     summary: Retrieve suggested users to follow
 *     tags: [Users & Profiles]
 */
router.get('/suggested', async (req, res) => {
  try {
    const suggested = await dbAsync.all('SELECT id, name, username, avatar_url, bio FROM users WHERE id != 1 LIMIT 5');
    return res.json({ success: true, suggested });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch suggested users' });
  }
});

/**
 * @swagger
 * /api/users/{id}/follow:
 *   post:
 *     summary: Follow or unfollow user
 *     tags: [Users & Profiles]
 */
router.post('/:id/follow', async (req, res) => {
  try {
    const targetUserId = req.params.id;
    // Toggle follow count
    await dbAsync.run('UPDATE users SET followers_count = followers_count + 1 WHERE id = ?', [targetUserId]);
    await dbAsync.run('UPDATE users SET following_count = following_count + 1 WHERE id = 1');
    return res.json({ success: true, message: 'User followed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error following user' });
  }
});

/**
 * @swagger
 * /api/users/profile/cover:
 *   put:
 *     summary: Update profile cover image
 *     tags: [Users & Profiles]
 */
router.put('/profile/cover', async (req, res) => {
  try {
    const { cover_url, user_id = 1 } = req.body;
    if (!cover_url) {
      return res.status(400).json({ success: false, message: 'cover_url is required' });
    }
    await dbAsync.run('UPDATE users SET cover_url = ? WHERE id = ?', [cover_url, user_id]);
    return res.json({ success: true, message: 'Cover updated successfully', cover_url });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update cover' });
  }
});

function getAuthUserId(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const parts = authHeader.split(' ');
    const token = parts.length === 2 ? parts[1] : parts[0];
    const match = token.match(/\d+$/);
    if (match) return parseInt(match[0], 10);
  }
  if (req.headers['x-user-id']) {
    return parseInt(req.headers['x-user-id'], 10);
  }
  if (req.body && (req.body.user_id || req.body.owner_user_id)) {
    return parseInt(req.body.user_id || req.body.owner_user_id, 10);
  }
  if (req.query && (req.query.user_id || req.query.id)) {
    return parseInt(req.query.user_id || req.query.id, 10);
  }
  return 1;
}

/**
 * @swagger
 * /api/users/profile/update:
 *   put:
 *     summary: Update full user profile details
 *     tags: [Users & Profiles]
 */
router.put('/profile/update', async (req, res) => {
  try {
    const {
      name,
      username,
      bio,
      avatar_url,
      location,
      caption,
      music,
      links,
      contact_email,
      contact_phone,
      contact_privacy,
      user_id
    } = req.body;

    const resolvedUserId = getAuthUserId(req);
    let targetUser;
    if (user_id) {
      targetUser = await dbAsync.get('SELECT * FROM users WHERE id = ?', [user_id]);
    }
    if (!targetUser && resolvedUserId) {
      targetUser = await dbAsync.get('SELECT * FROM users WHERE id = ?', [resolvedUserId]);
    }
    if (!targetUser && username) {
      targetUser = await dbAsync.get('SELECT * FROM users WHERE username = ?', [username]);
    }
    if (!targetUser) {
      targetUser = await dbAsync.get('SELECT * FROM users WHERE id = 1');
    }
    const targetId = targetUser ? targetUser.id : 1;

    const params = [
      name !== undefined ? name : null,
      username !== undefined ? username : null,
      bio !== undefined ? bio : null,
      avatar_url !== undefined ? avatar_url : null,
      location !== undefined ? location : null,
      targetId
    ];

    await dbAsync.run(
      `UPDATE users 
       SET name = COALESCE(?, name),
           username = COALESCE(?, username),
           bio = COALESCE(?, bio),
           avatar_url = COALESCE(?, avatar_url),
           location = COALESCE(?, location)
       WHERE id = ?`,
      params
    );

    // Keep all channels owned by this user synchronized with their latest avatar
    if (avatar_url) {
      await dbAsync.run(
        'UPDATE channels SET avatar_url = ? WHERE owner_user_id = ?',
        [avatar_url, targetId]
      );
    }

    const updatedUserRecord = await dbAsync.get('SELECT * FROM users WHERE id = ?', [targetId]);
    const { password_hash, ...safeUser } = updatedUserRecord;

    return res.json({
      success: true,
      message: 'Profile details saved successfully',
      user: safeUser,
      updated: {
        name,
        username,
        bio,
        avatar_url,
        location,
        caption,
        music,
        links,
        contact_email,
        contact_phone,
        contact_privacy
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile details', error: err.message });
  }
});

module.exports = router;
