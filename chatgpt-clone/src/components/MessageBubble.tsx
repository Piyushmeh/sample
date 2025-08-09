'use client';

import React from 'react';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ content, role, timestamp }) => {
  return (
    <div className={`message-bubble ${role}`}>
      <div className="message-content">
        {content}
      </div>
      {timestamp && (
        <div className="message-timestamp">
          {new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      )}
    </div>
  );
};
