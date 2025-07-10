import React, { useState, useEffect } from 'react';
import NewsChat from './components/NewsChat';
import './App.css';

interface NewsMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'ai' | 'user';
}

function App() {
  const [messages, setMessages] = useState<NewsMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        content: 'Welcome to AI News! I\'ll keep you updated with the latest AI news in real-time.',
        timestamp: new Date(),
        type: 'ai'
      }
    ]);

    // Simulate connection status for now
    setIsConnected(true);
  }, []);

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