const express = require('express');
const router = express.Router();
const { dbAsync } = require('../db/database');

/**
 * @swagger
 * tags:
 *   name: Feed & Posts
 *   description: Post creation, stories, feeds, likes, and bookmarks
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieve main feed posts with author and comments
 *     tags: [Feed & Posts]
 *     responses:
 *       200:
 *         description: List of feed posts
 */
router.get('/', async (req, res) => {
  try {
    const posts = await dbAsync.all(`
      SELECT p.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id ASC
    `);

    // Fetch comments for each post
    for (const post of posts) {
      const comments = await dbAsync.all(`
        SELECT c.*, u.username, u.avatar_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.id ASC
      `, [post.id]);
      post.comments = comments;
    }

    return res.json({ success: true, posts });
  } catch (err) {
    console.error('Fetch posts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve posts' });
  }
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Publish a new Post, Story, or Reel
 *     tags: [Feed & Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [media_url]
 *             properties:
 *               caption: { type: string }
 *               media_url: { type: string }
 *               location: { type: string }
 *               type: { type: string, enum: [post, story, reel] }
 *     responses:
 *       201:
 *         description: Post published
 */
router.post('/', async (req, res) => {
  try {
    const { caption, media_url, location, type } = req.body;
    const userId = req.body.user_id || 1;

    if (!media_url) {
      return res.status(400).json({ success: false, message: 'Media URL is required' });
    }

    if (type === 'story') {
      const result = await dbAsync.run(
        'INSERT INTO stories (user_id, media_url) VALUES (?, ?)',
        [userId, media_url]
      );
      return res.status(201).json({ success: true, message: 'Story published', storyId: result.lastID });
    }

    const result = await dbAsync.run(
      `INSERT INTO posts (user_id, caption, media_url, location, likes_count, comments_count, shares_count)
       VALUES (?, ?, ?, ?, 0, 0, 0)`,
      [userId, caption || '', media_url, location || 'Liquid Realm']
    );

    await dbAsync.run('UPDATE users SET posts_count = posts_count + 1 WHERE id = ?', [userId]);

    const newPost = await dbAsync.get(`
      SELECT p.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [result.lastID]);

    newPost.comments = [];

    return res.status(201).json({ success: true, message: 'Post shared to Soul Sync!', post: newPost });
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ success: false, message: 'Error publishing post' });
  }
});

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Toggle like on a post
 *     tags: [Feed & Posts]
 */
router.post('/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await dbAsync.get('SELECT likes_count FROM posts WHERE id = ?', [postId]);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const newCount = post.likes_count + 1;
    await dbAsync.run('UPDATE posts SET likes_count = ? WHERE id = ?', [newCount, postId]);

    return res.json({ success: true, likes_count: newCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error toggling like' });
  }
});

/**
 * @swagger
 * /api/posts/{id}/save:
 *   post:
 *     summary: Toggle save post to collection
 *     tags: [Feed & Posts]
 */
router.post('/:id/save', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = 1;

    const existing = await dbAsync.get('SELECT id FROM saved_posts WHERE user_id = ? AND post_id = ?', [userId, postId]);
    if (existing) {
      await dbAsync.run('DELETE FROM saved_posts WHERE id = ?', [existing.id]);
      await dbAsync.run('UPDATE posts SET is_saved = 0 WHERE id = ?', [postId]);
      return res.json({ success: true, is_saved: false, message: 'Post removed from saved' });
    } else {
      await dbAsync.run('INSERT INTO saved_posts (user_id, post_id) VALUES (?, ?)', [userId, postId]);
      await dbAsync.run('UPDATE posts SET is_saved = 1 WHERE id = ?', [postId]);
      return res.json({ success: true, is_saved: true, message: 'Post saved to collection' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error saving post' });
  }
});

/**
 * @swagger
 * /api/posts/{id}/comment:
 *   post:
 *     summary: Add comment to post
 *     tags: [Feed & Posts]
 */
router.post('/:id/comment', async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.body.user_id || 1;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text required' });
    }

    const result = await dbAsync.run(
      'INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)',
      [postId, userId, text.trim()]
    );

    await dbAsync.run('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?', [postId]);

    const user = await dbAsync.get('SELECT username, avatar_url FROM users WHERE id = ?', [userId]);

    return res.status(201).json({
      success: true,
      comment: {
        id: result.lastID,
        post_id: Number(postId),
        user_id: userId,
        text: text.trim(),
        username: user.username,
        avatar_url: user.avatar_url,
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error posting comment' });
  }
});

/**
 * @swagger
 * /api/posts/saved/all:
 *   get:
 *     summary: Get all saved posts
 *     tags: [Feed & Posts]
 */
router.get('/saved/all', async (req, res) => {
  try {
    const userId = 1;
    const saved = await dbAsync.all(`
      SELECT p.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar
      FROM saved_posts sp
      JOIN posts p ON sp.post_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE sp.user_id = ?
      ORDER BY sp.id DESC
    `, [userId]);

    return res.json({ success: true, saved });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching saved posts' });
  }
});

module.exports = router;
