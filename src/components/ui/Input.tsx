'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 mb-1.5 font-inter"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full border rounded-xl px-4 py-2.5 text-gray-800 font-inter
            placeholder-gray-400 bg-white
            focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400
            transition-colors duration-200
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 hover:border-orange-300'}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 font-inter">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 font-inter">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 mb-1.5 font-inter"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full border rounded-xl px-4 py-2.5 text-gray-800 font-inter
          placeholder-gray-400 bg-white resize-none
          focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400
          transition-colors duration-200
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 hover:border-orange-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 font-inter">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 font-inter">{helperText}</p>
      )}
    </div>
  );
}
