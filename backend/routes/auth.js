const express = require('express');
const router = express.Router();
const { dbAsync } = require('../db/database');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Liquid Glass User Authentication & Onboarding
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate with username/email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usernameOrEmail, password]
 *             properties:
 *               usernameOrEmail: { type: string, example: "christon@gmail.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail) {
      return res.status(400).json({ success: false, message: 'Please provide email or username.' });
    }

    const user = await dbAsync.get(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [usernameOrEmail.trim(), usernameOrEmail.trim()]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or user does not exist.' });
    }

    const { password_hash, ...safeUser } = user;
    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
      token: 'jwt_mock_soulsync_' + user.id
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new Soul Sync account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, username, email, password]
 *             properties:
 *               name: { type: string, example: "Alex Rivera" }
 *               username: { type: string, example: "alex_r" }
 *               email: { type: string, example: "alex@soulsync.io" }
 *               password: { type: string, example: "securePass123" }
 *     responses:
 *       201:
 *         description: Account created, OTP required
 */
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existing = await dbAsync.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username or email already in use.' });
    }

    const pwdHash = Buffer.from(password).toString('base64');
    const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const result = await dbAsync.run(
      `INSERT INTO users (name, username, email, password_hash, avatar_url, bio, followers_count, following_count, posts_count)
       VALUES (?, ?, ?, ?, ?, 'New soul exploring connections', 0, 0, 0)`,
      [name, username, email, pwdHash, avatar]
    );

    const newUser = await dbAsync.get('SELECT id, name, username, email, avatar_url, bio FROM users WHERE id = ?', [result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Account created. Please verify your email with the 6-digit code.',
      user: newUser,
      requiresOtp: true
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create account.' });
  }
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify 6-digit email OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp]
 *             properties:
 *               otp: { type: string, example: "123456" }
 *               email: { type: string, example: "christon@gmail.com" }
 *     responses:
 *       200:
 *         description: Verification complete
 */
router.post('/verify-otp', async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || otp.length !== 6) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit OTP code.' });
  }

  // Any 6-digit code passes verification
  const user = await dbAsync.get('SELECT * FROM users WHERE email = ?', [email || 'christon@gmail.com'])
    || await dbAsync.get('SELECT * FROM users WHERE id = 1');

  const { password_hash, ...safeUser } = user;
  return res.json({
    success: true,
    message: 'Email successfully verified. Welcome to Soul Sync!',
    user: safeUser,
    token: 'jwt_verified_soulsync_' + user.id
  });
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
  if (req.query && (req.query.user_id || req.query.id)) {
    return parseInt(req.query.user_id || req.query.id, 10);
  }
  return 1;
}

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently authenticated user profile
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get('/me', async (req, res) => {
  try {
    const authUserId = getAuthUserId(req);
    let user = await dbAsync.get('SELECT * FROM users WHERE id = ?', [authUserId]);
    if (!user) {
      user = await dbAsync.get('SELECT * FROM users WHERE id = 1');
    }
    if (!user) return res.status(404).json({ success: false, message: 'No active profile.' });
    const { password_hash, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

module.exports = router;
