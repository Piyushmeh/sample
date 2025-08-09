'use client';

import React, { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { ChatWindow } from './ChatWindow';
import { InputBox } from './InputBox';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export const Chat: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [userId] = useState('demo-user');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: dbMessages = [], refetch } = trpc.message.fetchMessages.useQuery(
    { userId },
    { enabled: true }
  );

  // Use database messages if available, otherwise use local messages
  const messages = dbMessages.length > 0 ? dbMessages : localMessages;

  const sendMessageMutation = trpc.message.sendMessage.useMutation({
    onSuccess: (data) => {
      // If database is working, refetch messages
      if (dbMessages.length > 0) {
        refetch();
      } else {
        // Otherwise, add messages to local state
        setLocalMessages(prev => [
          ...prev,
          data.userMessage,
          data.aiMessage
        ]);
      }
      setIsSending(false);
      setError(null);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      setIsSending(false);
      setError('Failed to send message. Please try again.');
      
      // Add a fallback message to local state
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: "I'm here to help! This is a demo response. In a production environment, I would provide a detailed AI-generated response.",
        role: 'assistant',
        created_at: new Date().toISOString()
      };
      
      setLocalMessages(prev => [...prev, fallbackMessage]);
    },
  });

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      await sendMessageMutation.mutateAsync({
        content: content.trim(),
        userId,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsSending(false);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <div className="d-inline-block p-2 rounded-circle bg-white bg-opacity-20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>
          <div>
            <h5 className="mb-0">ChatGPT Clone</h5>
            <small>Welcome to the demo!</small>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-warning alert-dismissible fade show m-3" role="alert">
          <strong>Demo Mode:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      
      <ChatWindow messages={messages} isLoading={isSending} />
      <InputBox onSendMessage={handleSendMessage} isLoading={isSending} />
    </div>
  );
};
