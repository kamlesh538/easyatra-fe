'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, MapPin } from 'lucide-react';
import { api } from '@/services/api';
import type { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

const INITIAL_GREETING = `Jai Shri Ram! 🙏 I am EasyAtra, your AI pilgrim travel assistant. Tell me where you'd like to visit, your travel dates, and budget — I'll plan everything for you!`;

const QUICK_REPLIES = [
  'Plan Char Dham Yatra',
  'Visit Ayodhya & Varanasi',
  'Tirupati Darshan',
  'Custom Trip',
];

const SESSION_KEY = 'easyatra_session_id';

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface ChatInterfaceProps {
  onClose: () => void;
  initialMessage?: string;
}

export default function ChatInterface({ onClose, initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: INITIAL_GREETING,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateSessionId();
      localStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setError(null);

      const userMessage: ChatMessage = {
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const response = await api.chat(text.trim(), sessionId, history as ChatMessage[]);

        const aiMessage: ChatMessage = {
          role: 'model',
          content: response.response,
          timestamp: new Date(),
        };

        if (response.session_id) {
          localStorage.setItem(SESSION_KEY, response.session_id);
          setSessionId(response.session_id);
        }

        setMessages((prev) => [...prev, aiMessage]);

        // Show create trip button if AI mentions creating a trip
        const tripKeywords = ['create trip', 'plan your trip', 'i\'ll create', 'shall i create', 'trip plan'];
        if (tripKeywords.some((kw) => response.response.toLowerCase().includes(kw))) {
          setShowCreateTrip(true);
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(errorMsg);
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: 'Sorry, I encountered an issue. Please try again in a moment. 🙏',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, messages, sessionId]
  );

  useEffect(() => {
    if (initialMessage && sessionId && !hasInitialized.current) {
      hasInitialized.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage, sessionId, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-lg sm:mx-auto bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
           style={{ height: 'min(680px, 100dvh)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-saffron-500 to-deepred-500 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              🕉
            </div>
            <div>
              <h2 className="font-bold font-poppins text-lg leading-tight">EasyAtra</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                <span className="text-xs text-white/80 font-inter">AI Pilgrim Assistant</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-orange-50/30">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-deepred-500 flex items-center justify-center text-white text-sm">
                🕉
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md border border-orange-100 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          {error && (
            <div className="text-center text-xs text-red-400 font-inter py-1">{error}</div>
          )}
          {showCreateTrip && (
            <div className="flex justify-center py-2 animate-fade-in">
              <a
                href="/planner"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-deepred-500 text-white rounded-xl font-semibold font-inter text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <MapPin size={16} />
                Create Trip Plan
              </a>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide bg-white border-t border-orange-50">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-saffron-600 border border-saffron-200 bg-saffron-50 hover:bg-saffron-100 rounded-full font-inter transition-colors duration-200"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 bg-white border-t border-orange-100 flex items-center gap-2 flex-shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your pilgrimage..."
            className="flex-1 px-4 py-2.5 bg-orange-50 border border-orange-100 rounded-xl text-gray-800 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400 transition-colors"
            disabled={loading}
            aria-label="Type your message"
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            className="!p-2.5 !rounded-xl flex-shrink-0"
            aria-label="Send message"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
