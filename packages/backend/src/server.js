const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
require('dotenv').config();

const healthRoutes = require('./routes/health');
const WebSocketManager = require('./websocket/WebSocketManager');
const NewsProcessor = require('./services/newsProcessor');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize WebSocket manager
const wsManager = new WebSocketManager();
wsManager.initialize(server);

// Initialize news processor
const newsProcessor = new NewsProcessor();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'AI News App Backend',
    version: '1.0.0',
    status: 'running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket server available at ws://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Start news processing
const startNewsProcessing = async () => {
  try {
    console.log('🔄 Starting initial news processing...');
    await newsProcessor.processNews();
    console.log('✅ Initial news processing completed');
  } catch (error) {
    console.error('❌ Initial news processing failed:', error.message);
  }
};

// Schedule periodic news processing (every 30 minutes)
const NEWS_UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes
setInterval(async () => {
  try {
    console.log('🔄 Starting scheduled news processing...');
    await newsProcessor.processNews();
    console.log('✅ Scheduled news processing completed');
  } catch (error) {
    console.error('❌ Scheduled news processing failed:', error.message);
  }
}, NEWS_UPDATE_INTERVAL);

// Start initial news processing after a short delay
setTimeout(startNewsProcessing, 5000);

// Make WebSocket manager available globally
global.wsManager = wsManager;

module.exports = app; 