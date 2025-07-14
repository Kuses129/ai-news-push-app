import React, { useState, useEffect } from 'react';
import NewsChat from './components/NewsChat';
import { useWebSocket } from './hooks/useWebSocket';
import './App.css';

interface NewsMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'ai' | 'user';
  originalTitle?: string;
  link?: string;
  source?: string;
}

function App() {
  const [messages, setMessages] = useState<NewsMessage[]>([]);
  const [systemMessages, setSystemMessages] = useState<string[]>([]);
  
  const { isConnected, onNewsUpdate, onSystemMessage } = useWebSocket();

  useEffect(() => {
    // Initialize with empty messages array
    setMessages([]);
  }, []);

  useEffect(() => {
    // Handle real-time news updates
    onNewsUpdate((newsItems) => {
      console.log('Received newsItems:', newsItems);
      const parsed = newsItems.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
      setMessages(prev => [...prev, ...parsed]);
    });

    // Handle system messages
    onSystemMessage((message) => {
      setSystemMessages(prev => [...prev, message]);
    });
  }, [onNewsUpdate, onSystemMessage]);

  const addMessage = (content: string, type: 'ai' | 'user' = 'ai') => {
    const newMessage: NewsMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="App">
      <div className="container">
        <NewsChat 
          messages={messages}
          isConnected={isConnected}
          onAddMessage={addMessage}
        />
      </div>
    </div>
  );
}

export default App; 