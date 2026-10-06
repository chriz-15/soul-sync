const express = require('express');
const cors = require('cors');
const { setupSwagger } = require('./swagger');
require('./db/database'); // initialize sqlite & seed

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');
const settingsRoutes = require('./routes/settings');
const momentRoutes = require('./routes/moments');
const channelRoutes = require('./routes/channels');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup Swagger UI
setupSwagger(app);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/moments', momentRoutes);
app.use('/api/channels', channelRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: System status check
 *     responses:
 *       200:
 *         description: Soul Sync server is healthy
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Soul Sync Liquid Glass Engine',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware (prevents unhandled body-parser crashes)
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large' || err.status === 413) {
    console.warn('⚠️ Request entity too large:', req.originalUrl);
    return res.status(413).json({
      success: false,
      message: 'Request payload too large. Please upload an image smaller than 50MB.'
    });
  }
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`🌟 Soul Sync Backend Server running on: http://localhost:${PORT}`);
  console.log(`📖 Swagger API Documentation live at: http://localhost:${PORT}/api-docs`);
});
