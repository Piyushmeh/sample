'use client';

import React, { useState } from 'react';

interface InputBoxProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message.trim());
        setMessage('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-container">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9"></polygon>
              </svg>
              Send
            </>
          )}
        </button>
      </div>
    </form>
  );
};
