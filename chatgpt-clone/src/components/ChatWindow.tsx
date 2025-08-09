'use client';

import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.length === 0 && !isLoading && (
        <div className="text-center py-5">
          <div className="mb-4">
            <div className="d-inline-block p-3 rounded-circle bg-light">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>
          <h6 className="text-muted mb-2">Welcome to ChatGPT Clone</h6>
          <p className="text-muted small">Start a conversation by typing a message below</p>
        </div>
      )}
      
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          content={message.content}
          role={message.role}
          timestamp={message.created_at}
        />
      ))}
      
      {isLoading && (
        <div className="message-bubble bot p-3">
          <div className="d-flex align-items-center">
            <div className="loading-dots me-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="text-muted">AI is thinking...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
