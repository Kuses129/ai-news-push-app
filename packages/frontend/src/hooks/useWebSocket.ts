import { useEffect, useRef, useState, useCallback } from 'react';

interface NewsMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'ai' | 'user';
  originalTitle?: string;
  link?: string;
  source?: string;
}

interface WebSocketMessage {
  type: 'connection' | 'news_update' | 'system';
  message?: string;
  data?: NewsMessage[];
  timestamp: string;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  onNewsUpdate: (callback: (news: NewsMessage[]) => void) => void;
  onSystemMessage: (callback: (message: string) => void) => void;
}

export const useWebSocket = (url: string = 'ws://localhost:3001'): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const newsCallbackRef = useRef<((news: NewsMessage[]) => void) | null>(null);
  const systemCallbackRef = useRef<((message: string) => void) | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      console.log('🔌 Connecting to WebSocket...');
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'connection':
              console.log('📡 Received connection confirmation:', message.message);
              break;
            
            case 'news_update':
              if (message.data && newsCallbackRef.current) {
                console.log(`📰 Received ${message.data.length} news updates`);
                newsCallbackRef.current(message.data);
              }
              break;
            
            case 'system':
              if (message.message && systemCallbackRef.current) {
                console.log('📢 Received system message:', message.message);
                systemCallbackRef.current(message.message);
              }
              break;
            
            default:
              console.log('📡 Received unknown message type:', message.type);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const onNewsUpdate = useCallback((callback: (news: NewsMessage[]) => void) => {
    newsCallbackRef.current = callback;
  }, []);

  const onSystemMessage = useCallback((callback: (message: string) => void) => {
    systemCallbackRef.current = callback;
  }, []);

  useEffect(() => {
    // Auto-connect on mount
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    onNewsUpdate,
    onSystemMessage
  };
}; 