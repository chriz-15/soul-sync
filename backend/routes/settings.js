const express = require('express');
const router = express.Router();
const { dbAsync } = require('../db/database');

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User preferences and account configurations
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Retrieve user settings
 *     tags: [Settings]
 */
router.get('/', async (req, res) => {
  try {
    const settings = await dbAsync.get('SELECT * FROM user_settings WHERE user_id = 1') || {
      user_id: 1,
      theme: 'liquid-dark',
      private_account: 0,
      push_notifications: 1,
      language: 'English (US)'
    };
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve settings' });
  }
});

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Update user settings
 *     tags: [Settings]
 */
router.post('/', async (req, res) => {
  try {
    const { private_account, push_notifications, language } = req.body;
    await dbAsync.run(`
      INSERT INTO user_settings (user_id, private_account, push_notifications, language)
      VALUES (1, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        private_account = excluded.private_account,
        push_notifications = excluded.push_notifications,
        language = excluded.language
    `, [private_account ? 1 : 0, push_notifications ? 1 : 0, language || 'English (US)']);

    return res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error saving settings' });
  }
});

module.exports = router;
