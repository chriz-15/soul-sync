const express = require('express');
const router = express.Router();
const { dbAsync } = require('../db/database');

/**
 * @swagger
 * tags:
 *   name: Messaging
 *   description: Real-time direct messaging and chats
 */

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
  if (req.query && (req.query.user_id || req.query.id)) {
    return parseInt(req.query.user_id || req.query.id, 10);
  }
  return 1;
}

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Retrieve list of conversations with partner avatars and last messages
 *     tags: [Messaging]
 */
router.get('/conversations', async (req, res) => {
  try {
    const currentUserId = getAuthUserId(req);
    const conversations = await dbAsync.all(`
      SELECT c.*, 
        u.id as partner_id, u.name as partner_name, u.username as partner_username, u.avatar_url as partner_avatar
      FROM conversations c
      JOIN users u ON (c.user1_id = u.id AND c.user2_id = ?) OR (c.user2_id = u.id AND c.user1_id = ?)
      WHERE c.user1_id = ? OR c.user2_id = ?
      ORDER BY c.updated_at DESC
    `, [currentUserId, currentUserId, currentUserId, currentUserId]);

    return res.json({ success: true, conversations });
  } catch (err) {
    console.error('Fetch conversations error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
});

/**
 * @swagger
 * /api/messages/conversations/{id}:
 *   get:
 *     summary: Retrieve message history for a conversation
 *     tags: [Messaging]
 */
router.get('/conversations/:id', async (req, res) => {
  try {
    const convId = req.params.id;
    const currentUserId = getAuthUserId(req);

    // Check if this conversation ID corresponds to a channel
    const channel = await dbAsync.get('SELECT * FROM channels WHERE (channel_id = ? OR id = ?) AND is_deleted = 0', [convId, convId]);

    const messages = await dbAsync.all(`
      SELECT m.*, u.name as sender_name, u.username as sender_username, u.avatar_url as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ? OR m.conversation_id = ?
      ORDER BY m.id ASC
    `, [channel ? channel.channel_id : convId, String(convId)]);

    // Mark as read
    await dbAsync.run('UPDATE messages SET is_read = 1 WHERE conversation_id = ? OR conversation_id = ?', [channel ? channel.channel_id : convId, String(convId)]);
    if (!channel) {
      await dbAsync.run('UPDATE conversations SET unread_count = 0 WHERE id = ?', [convId]);
    }

    return res.json({ success: true, messages });
  } catch (err) {
    console.error('Fetch messages error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a text or media message in a conversation or channel
 *     tags: [Messaging]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversation_id, text]
 *             properties:
 *               conversation_id: { type: string, example: "1" }
 *               text: { type: string, example: "Looks amazing! Wish we were there together! 🔥" }
 *               media_url: { type: string }
 */
router.post('/send', async (req, res) => {
  try {
    const { conversation_id, text, media_url } = req.body;
    const sender_id = req.body.sender_id || getAuthUserId(req) || 1;

    if (!conversation_id || (!text && !media_url)) {
      return res.status(400).json({ success: false, message: 'Conversation ID and message content are required' });
    }

    let conv = await dbAsync.get('SELECT * FROM conversations WHERE id = ?', [conversation_id]);
    let channel = null;

    if (!conv) {
      channel = await dbAsync.get('SELECT * FROM channels WHERE (channel_id = ? OR id = ?) AND is_deleted = 0', [conversation_id, conversation_id]);
    }

    if (!conv && !channel) {
      return res.status(404).json({ success: false, message: 'Conversation or channel not found' });
    }

    let receiver_id;
    const displayMsg = text || 'Sent a photo';

    if (channel) {
      // Validate channel reply policy
      if (!channel.allow_replies && channel.owner_user_id !== sender_id) {
        return res.status(403).json({
          success: false,
          message: 'Broadcast only: Only the channel owner can post messages to this channel.'
        });
      }

      receiver_id = channel.owner_user_id;

      const insertRes = await dbAsync.run(`
        INSERT INTO messages (conversation_id, sender_id, receiver_id, text, media_url, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
      `, [channel.channel_id, sender_id, receiver_id, text || null, media_url || null]);

      await dbAsync.run('UPDATE channels SET updated_at = CURRENT_TIMESTAMP WHERE channel_id = ?', [channel.channel_id]);

      const sender = await dbAsync.get('SELECT name, username, avatar_url FROM users WHERE id = ?', [sender_id]);

      const newMsg = {
        id: insertRes ? insertRes.lastID : Date.now(),
        conversation_id: channel.channel_id,
        sender_id,
        receiver_id,
        text,
        media_url,
        is_read: 0,
        sender_name: sender ? sender.name : 'Owner',
        sender_username: sender ? sender.username : 'owner',
        sender_avatar: sender ? sender.avatar_url : null,
        created_at: new Date().toISOString()
      };

      return res.status(201).json({ success: true, message: newMsg });
    } else {
      receiver_id = conv.user1_id === sender_id ? conv.user2_id : conv.user1_id;

      const insertRes = await dbAsync.run(`
        INSERT INTO messages (conversation_id, sender_id, receiver_id, text, media_url, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
      `, [conversation_id, sender_id, receiver_id, text || null, media_url || null]);

      await dbAsync.run(`
        UPDATE conversations 
        SET last_message = ?, last_message_time = 'Just now', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [displayMsg, conversation_id]);

      const sender = await dbAsync.get('SELECT name, username, avatar_url FROM users WHERE id = ?', [sender_id]);

      const newMsg = {
        id: insertRes ? insertRes.lastID : Date.now(),
        conversation_id,
        sender_id,
        receiver_id,
        text,
        media_url,
        is_read: 0,
        sender_name: sender ? sender.name : 'User',
        sender_username: sender ? sender.username : 'User',
        sender_avatar: sender ? sender.avatar_url : null,
        created_at: new Date().toISOString()
      };

      return res.status(201).json({ success: true, message: newMsg });
    }
  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

module.exports = router;
