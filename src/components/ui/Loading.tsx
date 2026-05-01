import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export function Loading({ size = 'md', text, fullPage = false }: LoadingProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full border-saffron-200 border-t-saffron-500
          animate-spin
        `}
      />
      {text && (
        <p className="text-gray-600 font-inter text-sm animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🕉</div>
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function PageLoader({ text = 'Loading your sacred journey...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="text-6xl animate-pulse">🕉</div>
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-saffron-200 border-t-saffron-500 animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-gray-700 font-poppins font-medium">{text}</p>
        <p className="text-gray-400 font-inter text-sm mt-1">Jai Shri Ram 🙏</p>
      </div>
    </div>
  );
}
