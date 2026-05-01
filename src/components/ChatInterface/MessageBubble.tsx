import React from 'react';
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-end gap-2 animate-slide-up ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-deepred-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
          🕉
        </div>
      )}

      <div
        className={`max-w-[75%] sm:max-w-[65%] flex flex-col gap-1 ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Bubble */}
        <div
          className={`
            relative px-4 py-3 rounded-2xl shadow-sm
            ${
              isUser
                ? 'bg-saffron-500 text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md border border-orange-100'
            }
          `}
        >
          <p className="text-sm font-inter leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 font-inter px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
          🙏
        </div>
      )}
    </div>
  );
}
