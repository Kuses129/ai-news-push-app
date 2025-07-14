const WebSocket = require('ws');

class WebSocketManager {
  constructor() {
    this.wss = null;
    this.clients = new Set();
    this.latestNews = [];
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });
    
    this.wss.on('connection', (ws) => {
      console.log('🔌 New WebSocket client connected');
      this.clients.add(ws);
      
      // Send initial connection confirmation
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to AI News WebSocket',
        timestamp: new Date().toISOString()
      }));

      // Send the latest news to the new client
      if (this.latestNews && this.latestNews.length > 0) {
        ws.send(JSON.stringify({
          type: 'news_update',
          data: this.latestNews,
          timestamp: new Date().toISOString()
        }));
        console.log('📡 Sent latest news to new client');
      }

      ws.on('close', () => {
        console.log('🔌 WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    console.log('🚀 WebSocket server initialized');
  }

  broadcastNews(newsItems) {
    if (!this.wss) {
      console.warn('WebSocket server not initialized');
      return;
    }

    // Store the latest news
    this.latestNews = newsItems;

    const message = {
      type: 'news_update',
      data: newsItems,
      timestamp: new Date().toISOString()
    };

    const messageStr = JSON.stringify(message);
    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
        sentCount++;
      }
    });

    console.log(`📡 Broadcasted ${newsItems.length} news items to ${sentCount} clients`);
  }

  broadcastSystemMessage(message) {
    if (!this.wss) {
      console.warn('WebSocket server not initialized');
      return;
    }

    const systemMessage = {
      type: 'system',
      message,
      timestamp: new Date().toISOString()
    };

    const messageStr = JSON.stringify(systemMessage);
    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
        sentCount++;
      }
    });

    console.log(`📡 Broadcasted system message to ${sentCount} clients`);
  }

  getConnectedClientsCount() {
    return this.clients.size;
  }
}

module.exports = WebSocketManager; 