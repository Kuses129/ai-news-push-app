import React, { useRef, useEffect } from 'react';

interface NewsMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'ai' | 'user';
}

interface NewsChatProps {
  messages: NewsMessage[];
  isConnected: boolean;
  onAddMessage: (content: string, type?: 'ai' | 'user') => void;
}

const NewsChat: React.FC<NewsChatProps> = ({ messages, isConnected, onAddMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        🤖 AI News Updates
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-status">
        <span className={isConnected ? 'status-connected' : 'status-disconnected'}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
        {isConnected && (
          <span style={{ marginLeft: '1rem' }}>
            Waiting for news updates...
          </span>
        )}
      </div>
    </div>
  );
};

export default NewsChat; 