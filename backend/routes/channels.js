const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { dbAsync } = require('../db/database');

/**
 * @swagger
 * tags:
 *   name: Channels
 *   description: Permanent, Account-Bound Channels & Broadcasts
 */

/**
 * Extract authenticated user ID from Bearer token, custom header, or request parameters.
 * Defaults to 1 (primary active Soul Sync user) if not explicitly provided.
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
  if (req.body && (req.body.owner_user_id || req.body.user_id)) {
    return parseInt(req.body.owner_user_id || req.body.user_id, 10);
  }
  if (req.query && (req.query.owner_user_id || req.query.user_id)) {
    return parseInt(req.query.owner_user_id || req.query.user_id, 10);
  }
  return 1;
}

/**
 * Generate a cryptographically random, permanent unique Channel ID.
 * Example format: SS-CH-8F42A91C
 */
async function generateUniqueChannelId() {
  let isUnique = false;
  let channelId = '';
  while (!isUnique) {
    const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
    channelId = `SS-CH-${hex}`;
    const existing = await dbAsync.get('SELECT id FROM channels WHERE channel_id = ?', [channelId]);
    if (!existing) {
      isUnique = true;
    }
  }
  return channelId;
}

/**
 * Helper to fetch complete channel details including owner and member list.
 */
async function getChannelWithDetails(channelIdOrNumericId) {
  const channel = await dbAsync.get(`
    SELECT c.*, 
      u.name as owner_name, 
      u.username as owner_username, 
      u.avatar_url as owner_avatar
    FROM channels c
    JOIN users u ON c.owner_user_id = u.id
    WHERE c.channel_id = ? OR c.id = ?
  `, [channelIdOrNumericId, channelIdOrNumericId]);

  if (!channel) return null;

  // The channel's profile image is dynamically inherited from the owner user's profile photo
  const resolvedAvatar = channel.owner_avatar || channel.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  // Fetch members
  const members = await dbAsync.all(`
    SELECT u.id, u.name, u.username, u.avatar_url as avatar,
           CASE WHEN u.id = ? THEN 1 ELSE 0 END as is_owner
    FROM channel_members cm
    JOIN users u ON cm.user_id = u.id
    WHERE cm.channel_id = ?
    ORDER BY is_owner DESC, u.name ASC
  `, [channel.owner_user_id, channel.channel_id]);

  // Actual performance metrics from database
  const msgCountRow = await dbAsync.get(
    'SELECT COUNT(*) as count FROM messages WHERE conversation_id = ?',
    [channel.channel_id]
  );
  const totalMessages = msgCountRow ? msgCountRow.count : 0;

  const contributorsRow = await dbAsync.get(
    'SELECT COUNT(DISTINCT sender_id) as count FROM messages WHERE conversation_id = ?',
    [channel.channel_id]
  );
  const activeContributors = contributorsRow ? contributorsRow.count : 0;

  return {
    ...channel,
    avatar_url: resolvedAvatar,
    owner_avatar: resolvedAvatar,
    is_pinned: Boolean(channel.is_pinned),
    show_on_profile: Boolean(channel.show_on_profile),
    allow_replies: Boolean(channel.allow_replies),
    theme_type: channel.theme_type || 'default',
    theme_color: channel.theme_color || null,
    wallpaper_url: channel.wallpaper_url || null,
    custom_wallpaper: channel.custom_wallpaper || null,
    invite_code: channel.invite_code || channel.channel_id,
    members,
    stats: {
      total_members: members.length,
      total_messages: totalMessages,
      active_contributors: activeContributors,
      created_at: channel.created_at
    }
  };
}

/**
 * @swagger
 * /api/channels:
 *   get:
 *     summary: Retrieve all active permanent channels belonging to or accessible by current user
 *     tags: [Channels]
 *     responses:
 *       200:
 *         description: List of permanent channels
 */
router.get('/', async (req, res) => {
  try {
    const authUserId = getAuthUserId(req);

    const rows = await dbAsync.all(`
      SELECT c.*, 
        u.name as owner_name, 
        u.username as owner_username, 
        u.avatar_url as owner_avatar
      FROM channels c
      JOIN users u ON c.owner_user_id = u.id
      WHERE c.is_deleted = 0
        AND (
          c.owner_user_id = ? 
          OR c.channel_id IN (SELECT channel_id FROM channel_members WHERE user_id = ?)
        )
      ORDER BY c.is_pinned DESC, c.created_at DESC
    `, [authUserId, authUserId]);

    const channels = [];
    for (const ch of rows) {
      // Dynamic owner profile picture resolution
      const dynamicAvatar = ch.owner_avatar || ch.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      const members = await dbAsync.all(`
        SELECT u.id, u.name, u.username, u.avatar_url as avatar,
               CASE WHEN u.id = ? THEN 1 ELSE 0 END as is_owner
        FROM channel_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.channel_id = ?
        ORDER BY is_owner DESC, u.name ASC
      `, [ch.owner_user_id, ch.channel_id]);

      const msgCountRow = await dbAsync.get(
        'SELECT COUNT(*) as count FROM messages WHERE conversation_id = ?',
        [ch.channel_id]
      );
      const totalMessages = msgCountRow ? msgCountRow.count : 0;

      channels.push({
        ...ch,
        avatar_url: dynamicAvatar,
        owner_avatar: dynamicAvatar,
        is_pinned: Boolean(ch.is_pinned),
        show_on_profile: Boolean(ch.show_on_profile),
        allow_replies: Boolean(ch.allow_replies),
        theme_type: ch.theme_type || 'default',
        theme_color: ch.theme_color || null,
        wallpaper_url: ch.wallpaper_url || null,
        custom_wallpaper: ch.custom_wallpaper || null,
        invite_code: ch.invite_code || ch.channel_id,
        members,
        stats: {
          total_members: members.length,
          total_messages: totalMessages,
          created_at: ch.created_at
        }
      });
    }

    return res.json({ success: true, channels });
  } catch (err) {
    console.error('Fetch channels error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve channels' });
  }
});

/**
 * @swagger
 * /api/channels:
 *   post:
 *     summary: Create a permanent, account-bound channel in SQL
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Night Vibes" }
 *               description: { type: string, example: "Broadcast space for evening music and frequencies" }
 *               channel_type: { type: string, example: "channel" }
 *               audience: { type: array, items: { type: integer }, example: [2, 3, 4] }
 *               is_pinned: { type: boolean, example: true }
 *               show_on_profile: { type: boolean, example: true }
 *               allow_replies: { type: boolean, example: false }
 *     responses:
 *       201:
 *         description: Channel created permanently
 */
router.post('/', async (req, res) => {
  try {
    const authUserId = getAuthUserId(req);
    const {
      name,
      description,
      channel_type = 'channel',
      audience = [],
      is_pinned = false,
      isPinned,
      show_on_profile = false,
      showOnProfile,
      allow_replies = false,
      allowReplies,
      avatar_url
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Channel name is required' });
    }

    const trimmedName = name.trim();
    const finalPinned = is_pinned || isPinned ? 1 : 0;
    const finalShowProfile = show_on_profile || showOnProfile ? 1 : 0;
    const finalAllowReplies = allow_replies || allowReplies ? 1 : 0;

    // Automatically inherit owner user's current Soul Sync profile photo
    const ownerUser = await dbAsync.get('SELECT avatar_url, name, username FROM users WHERE id = ?', [authUserId]);
    const finalAvatar = (ownerUser && ownerUser.avatar_url)
      ? ownerUser.avatar_url
      : (avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

    // Generate permanent unique Channel ID (e.g. SS-CH-8F42A91C)
    const channelId = await generateUniqueChannelId();

    const insertResult = await dbAsync.run(`
      INSERT INTO channels (
        channel_id,
        owner_user_id,
        name,
        description,
        channel_type,
        avatar_url,
        is_pinned,
        show_on_profile,
        allow_replies,
        created_at,
        updated_at,
        is_deleted,
        deleted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, NULL)
    `, [
      channelId,
      authUserId,
      trimmedName,
      description || null,
      channel_type,
      finalAvatar,
      finalPinned,
      finalShowProfile,
      finalAllowReplies
    ]);

    // Save audience members in channel_members
    if (Array.isArray(audience) && audience.length > 0) {
      for (const item of audience) {
        const memberId = typeof item === 'object' && item !== null ? item.id : item;
        if (memberId && typeof memberId === 'number') {
          await dbAsync.run(`
            INSERT OR IGNORE INTO channel_members (channel_id, user_id, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
          `, [channelId, memberId]);
        }
      }
    }

    // Always ensure the owner is a member
    await dbAsync.run(`
      INSERT OR IGNORE INTO channel_members (channel_id, user_id, created_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `, [channelId, authUserId]);

    const createdChannel = await getChannelWithDetails(channelId);

    return res.status(201).json({
      success: true,
      message: `Channel "${trimmedName}" created permanently!`,
      channel: createdChannel
    });
  } catch (err) {
    console.error('Create channel error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create persistent channel', error: err.message });
  }
});

/**
 * @swagger
 * /api/channels/{channelId}:
 *   get:
 *     summary: Retrieve a single permanent channel by Channel ID
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *           example: "SS-CH-8F42A91C"
 *     responses:
 *       200:
 *         description: Channel retrieved successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Channel not found
 */
router.get('/:channelId', async (req, res) => {
  try {
    const authUserId = getAuthUserId(req);
    const { channelId } = req.params;

    const channel = await getChannelWithDetails(channelId);
    if (!channel || channel.is_deleted) {
      return res.status(404).json({ success: false, message: 'Channel not found or has been deleted' });
    }

    // Security Authorization Check:
    // Allow if user is owner OR an authorized member in channel_members
    const isOwner = channel.owner_user_id === authUserId;
    const isMember = channel.members.some((m) => m.id === authUserId);

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this channel'
      });
    }

    return res.json({ success: true, channel });
  } catch (err) {
    console.error('Get channel error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve channel' });
  }
});

/**
 * @swagger
 * /api/channels/{channelId}:
 *   patch:
 *     summary: Update an existing permanent channel
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel updated
 *       403:
 *         description: Not owner
 */
router.patch('/:channelId', async (req, res) => {
  try {
    const authUserId = getAuthUserId(req);
    const { channelId } = req.params;

    const channel = await dbAsync.get('SELECT * FROM channels WHERE (channel_id = ? OR id = ?) AND is_deleted = 0', [channelId, channelId]);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    // Only owner can modify channel settings
    if (channel.owner_user_id !== authUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only the channel owner can modify this channel'
      });
    }

    const {
      name,
      description,
      is_pinned,
      isPinned,
      show_on_profile,
      showOnProfile,
      allow_replies,
      allowReplies,
      avatar_url,
      theme_type,
      theme_color,
      wallpaper_url,
      custom_wallpaper,
      invite_code,
      audience
    } = req.body;

    const newName = name !== undefined ? name.trim() : channel.name;
    const newDesc = description !== undefined ? description : channel.description;
    const newPinned = is_pinned !== undefined ? (is_pinned ? 1 : 0) : (isPinned !== undefined ? (isPinned ? 1 : 0) : channel.is_pinned);
    const newShowProfile = show_on_profile !== undefined ? (show_on_profile ? 1 : 0) : (showOnProfile !== undefined ? (showOnProfile ? 1 : 0) : channel.show_on_profile);
    const newAllowReplies = allow_replies !== undefined ? (allow_replies ? 1 : 0) : (allowReplies !== undefined ? (allowReplies ? 1 : 0) : channel.allow_replies);
    const newAvatar = avatar_url !== undefined ? avatar_url : channel.avatar_url;
    const newThemeType = theme_type !== undefined ? theme_type : (channel.theme_type || 'default');
    const newThemeColor = theme_color !== undefined ? theme_color : channel.theme_color;
    const newWallpaper = wallpaper_url !== undefined ? wallpaper_url : channel.wallpaper_url;
    const newCustomWallpaper = custom_wallpaper !== undefined ? custom_wallpaper : channel.custom_wallpaper;
    const newInviteCode = invite_code !== undefined ? invite_code : (channel.invite_code || channel.channel_id);

    await dbAsync.run(`
      UPDATE channels
      SET name = ?,
          description = ?,
          is_pinned = ?,
          show_on_profile = ?,
          allow_replies = ?,
          avatar_url = ?,
          theme_type = ?,
          theme_color = ?,
          wallpaper_url = ?,
          custom_wallpaper = ?,
          invite_code = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE channel_id = ?
    `, [newName, newDesc, newPinned, newShowProfile, newAllowReplies, newAvatar, newThemeType, newThemeColor, newWallpaper, newCustomWallpaper, newInviteCode, channel.channel_id]);

    // Update audience if provided
    if (Array.isArray(audience)) {
      await dbAsync.run('DELETE FROM channel_members WHERE channel_id = ? AND user_id != ?', [channel.channel_id, authUserId]);
      for (const item of audience) {
        const memberId = typeof item === 'object' && item !== null ? item.id : item;
        if (memberId && typeof memberId === 'number' && memberId !== authUserId) {
          await dbAsync.run(`
            INSERT OR IGNORE INTO channel_members (channel_id, user_id, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
          `, [channel.channel_id, memberId]);
        }
      }
    }

    const updated = await getChannelWithDetails(channel.channel_id);
    return res.json({ success: true, message: 'Channel updated successfully', channel: updated });
  } catch (err) {
    console.error('Update channel error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update channel' });
  }
});

/**
 * @swagger
 * /api/channels/{channelId}:
 *   delete:
 *     summary: Explicitly soft delete a permanent channel
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel deleted
 *       403:
 *         description: Unauthorized
 */
router.delete('/:channelId', async (req, res) => {
  try {
    const authUserId = getAuthUserId(req);
    const { channelId } = req.params;

    const channel = await dbAsync.get('SELECT * FROM channels WHERE (channel_id = ? OR id = ?) AND is_deleted = 0', [channelId, channelId]);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found or already deleted' });
    }

    // Only owner can delete channel
    if (channel.owner_user_id !== authUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only the channel owner can delete this channel'
      });
    }

    // Soft delete according to policy: is_deleted = 1, deleted_at = CURRENT_TIMESTAMP
    await dbAsync.run(`
      UPDATE channels
      SET is_deleted = 1,
          deleted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE channel_id = ?
    `, [channel.channel_id]);

    return res.json({
      success: true,
      message: `Channel "${channel.name}" deleted successfully.`,
      channel_id: channel.channel_id
    });
  } catch (err) {
    console.error('Delete channel error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete channel' });
  }
});

module.exports = router;
