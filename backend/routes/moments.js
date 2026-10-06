const express = require('express');
const router = express.Router();
const { dbAsync } = require('../db/database');

/**
 * @swagger
 * tags:
 *   name: Soul Moments
 *   description: Personal memory and moments layer, "On This Day" rediscovery, private notes & collections
 */

/**
 * @swagger
 * /api/moments:
 *   get:
 *     summary: Retrieve user's Soul Moments
 *     tags: [Soul Moments]
 *     parameters:
 *       - in: query
 *         name: collection_id
 *         schema:
 *           type: integer
 *         description: Optional filter by collection ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Optional filter by memory type ('on_this_day', 'milestone', 'saved', 'custom')
 *     responses:
 *       200:
 *         description: List of personal memories
 */
router.get('/', async (req, res) => {
  try {
    const userId = 1; // Default logged in user (Christon)
    const { collection_id, type } = req.query;

    let query = `
      SELECT m.*, c.name as collection_name, c.icon as collection_icon,
             p.caption as original_post_caption, p.location as original_post_location
      FROM soul_moments m
      LEFT JOIN moment_collections c ON m.collection_id = c.id
      LEFT JOIN posts p ON m.post_id = p.id
      WHERE m.user_id = ?
    `;
    const params = [userId];

    if (collection_id) {
      query += ' AND m.collection_id = ?';
      params.push(collection_id);
    }
    if (type) {
      query += ' AND m.memory_type = ?';
      params.push(type);
    }

    query += ' ORDER BY m.memory_date DESC, m.id DESC';

    const moments = await dbAsync.all(query, params);
    return res.json({ success: true, moments });
  } catch (err) {
    console.error('Fetch moments error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve Soul Moments' });
  }
});

/**
 * @swagger
 * /api/moments/preview:
 *   get:
 *     summary: Retrieve featured Soul Moments for the Home Dashboard preview card
 *     tags: [Soul Moments]
 *     responses:
 *       200:
 *         description: Curated moments for preview card
 */
router.get('/preview', async (req, res) => {
  try {
    const userId = 1;

    // Prioritize "On This Day" memories, then recent milestones/saved
    const previewMoments = await dbAsync.all(`
      SELECT m.*, c.name as collection_name, c.icon as collection_icon
      FROM soul_moments m
      LEFT JOIN moment_collections c ON m.collection_id = c.id
      WHERE m.user_id = ?
      ORDER BY 
        CASE WHEN m.memory_type = 'on_this_day' THEN 0 ELSE 1 END,
        m.years_ago ASC,
        m.memory_date DESC
      LIMIT 3
    `, [userId]);

    return res.json({
      success: true,
      hasMoments: previewMoments.length > 0,
      preview: previewMoments
    });
  } catch (err) {
    console.error('Fetch moments preview error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve preview moments' });
  }
});

/**
 * @swagger
 * /api/moments/collections:
 *   get:
 *     summary: Retrieve user's memory collections
 *     tags: [Soul Moments]
 *     responses:
 *       200:
 *         description: List of memory collections with count
 */
router.get('/collections', async (req, res) => {
  try {
    const userId = 1;
    const collections = await dbAsync.all(`
      SELECT c.*, COUNT(m.id) as moment_count
      FROM moment_collections c
      LEFT JOIN soul_moments m ON c.id = m.collection_id
      WHERE c.user_id = ?
      GROUP BY c.id
      ORDER BY c.id ASC
    `, [userId]);

    return res.json({ success: true, collections });
  } catch (err) {
    console.error('Fetch collections error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve collections' });
  }
});

/**
 * @swagger
 * /api/moments/collections:
 *   post:
 *     summary: Create a new custom memory collection
 *     tags: [Soul Moments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Collection created
 */
router.post('/collections', async (req, res) => {
  try {
    const userId = 1;
    const { name, icon = '✨' } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Collection name is required' });
    }

    const result = await dbAsync.run(
      'INSERT INTO moment_collections (user_id, name, icon) VALUES (?, ?, ?)',
      [userId, name.trim(), icon]
    );

    return res.status(201).json({
      success: true,
      collection: { id: result.lastID, user_id: userId, name: name.trim(), icon, moment_count: 0 }
    });
  } catch (err) {
    console.error('Create collection error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create collection' });
  }
});

/**
 * @swagger
 * /api/moments:
 *   post:
 *     summary: Save content to Soul Moments
 *     tags: [Soul Moments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: integer
 *               memory_type:
 *                 type: string
 *               memory_date:
 *                 type: string
 *               title:
 *                 type: string
 *               caption:
 *                 type: string
 *               media_url:
 *                 type: string
 *               location:
 *                 type: string
 *               people_involved:
 *                 type: string
 *               private_note:
 *                 type: string
 *               collection_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Moment saved
 */
router.post('/', async (req, res) => {
  try {
    const userId = 1;
    const {
      post_id,
      memory_type = 'custom',
      memory_date = new Date().toISOString().split('T')[0],
      years_ago = 0,
      title,
      caption,
      media_url,
      location,
      people_involved,
      private_note,
      collection_id
    } = req.body;

    if (!media_url && !post_id) {
      return res.status(400).json({ success: false, message: 'Media or post reference is required' });
    }

    let finalMedia = media_url;
    let finalCaption = caption;
    let finalLocation = location;

    if (post_id) {
      const originalPost = await dbAsync.get('SELECT * FROM posts WHERE id = ?', [post_id]);
      if (originalPost) {
        finalMedia = finalMedia || originalPost.media_url;
        finalCaption = finalCaption || originalPost.caption;
        finalLocation = finalLocation || originalPost.location;
      }
    }

    const result = await dbAsync.run(`
      INSERT INTO soul_moments (user_id, post_id, memory_type, memory_date, years_ago, title, caption, media_url, location, people_involved, private_note, collection_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, post_id || null, memory_type, memory_date, years_ago, title || 'Soul Moment', finalCaption || '', finalMedia, finalLocation || '', people_involved || '', private_note || '', collection_id || null]);

    const created = await dbAsync.get('SELECT * FROM soul_moments WHERE id = ?', [result.lastID]);
    return res.status(201).json({ success: true, moment: created });
  } catch (err) {
    console.error('Save moment error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save moment' });
  }
});

/**
 * @swagger
 * /api/moments/{id}/note:
 *   patch:
 *     summary: Add or update private reflection note
 *     tags: [Soul Moments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               private_note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 */
router.patch('/:id/note', async (req, res) => {
  try {
    const userId = 1;
    const { id } = req.params;
    const { private_note } = req.body;

    await dbAsync.run(
      'UPDATE soul_moments SET private_note = ? WHERE id = ? AND user_id = ?',
      [private_note || '', id, userId]
    );

    return res.json({ success: true, message: 'Memory note updated privately', private_note });
  } catch (err) {
    console.error('Update note error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update note' });
  }
});

/**
 * @swagger
 * /api/moments/{id}/collection:
 *   patch:
 *     summary: Assign moment to a collection
 *     tags: [Soul Moments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collection_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Collection updated
 */
router.patch('/:id/collection', async (req, res) => {
  try {
    const userId = 1;
    const { id } = req.params;
    const { collection_id } = req.body;

    await dbAsync.run(
      'UPDATE soul_moments SET collection_id = ? WHERE id = ? AND user_id = ?',
      [collection_id || null, id, userId]
    );

    return res.json({ success: true, message: 'Collection assigned' });
  } catch (err) {
    console.error('Update collection error:', err);
    return res.status(500).json({ success: false, message: 'Failed to assign collection' });
  }
});

/**
 * @swagger
 * /api/moments/{id}:
 *   delete:
 *     summary: Remove a memory from Soul Moments (preserves original post)
 *     tags: [Soul Moments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Removed from Soul Moments
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = 1;
    const { id } = req.params;

    await dbAsync.run('DELETE FROM soul_moments WHERE id = ? AND user_id = ?', [id, userId]);
    return res.json({ success: true, message: 'Removed from Soul Moments' });
  } catch (err) {
    console.error('Delete moment error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete moment' });
  }
});

module.exports = router;
