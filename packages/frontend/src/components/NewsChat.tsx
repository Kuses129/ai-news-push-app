import React, { useRef, useEffect } from 'react';

interface NewsMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'ai' | 'user';
  originalTitle?: string;
  link?: string;
  source?: string;
}

interface NewsChatProps {
  messages: NewsMessage[];
  isConnected: boolean;
  onAddMessage: (content: string, type?: 'ai' | 'user') => void;
}

const NewsChat: React.FC<NewsChatProps> = ({ messages, isConnected, onAddMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Use instant scroll for initial load, smooth for new messages
      const isNewMessage = messages.length > 1;
      scrollToBottom(isNewMessage ? 'smooth' : 'auto');
    }
  }, [messages]);

  // Auto-scroll to bottom on mount
  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString([], { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">🤖 AI News Updates</div>
        <div className="chat-subtitle">I'll keep you updated with the latest AI news in real-time</div>
      </div>
      
      <div className="chat-messages" ref={messagesContainerRef}>
        {messages
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          .map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content}
              {message.originalTitle && (
                <div className="message-title">
                  📰 {message.originalTitle}
                </div>
              )}
              {message.source && (
                <div className="message-source">
                  📍 Source: {message.source}
                </div>
              )}
              {message.link && (
                <div className="message-link">
                  🔗 <a href={message.link} target="_blank" rel="noopener noreferrer">
                    Read full article
                  </a>
                </div>
              )}
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