const express = require('express');
const router = express.Router();
const { dbAsync } = require('../db/database');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Activity alerts, likes, comments, and mentions
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for current user
 *     tags: [Notifications]
 */
router.get('/', async (req, res) => {
  try {
    const userId = 1;
    const notifications = await dbAsync.all(`
      SELECT n.*, u.name as actor_name, u.username as actor_username, u.avatar_url as actor_avatar
      FROM notifications n
      JOIN users u ON n.actor_id = u.id
      WHERE n.user_id = ?
      ORDER BY n.id DESC
    `, [userId]);

    return res.json({ success: true, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve notifications' });
  }
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   post:
 *     summary: Mark single notification as read
 *     tags: [Notifications]
 */
router.post('/:id/read', async (req, res) => {
  try {
    await dbAsync.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

/**
 * @swagger
 * /api/notifications/read-all:
 *   post:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 */
router.post('/read-all', async (req, res) => {
  try {
    const userId = 1;
    await dbAsync.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
