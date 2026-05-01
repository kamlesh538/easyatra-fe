'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, Plus } from 'lucide-react';

const POPULAR_PLACES = [
  'Ayodhya',
  'Varanasi (Kashi)',
  'Tirupati',
  'Vaishno Devi',
  'Kedarnath',
  'Badrinath',
  'Gangotri',
  'Yamunotri',
  'Puri (Jagannath)',
  'Dwarka',
  'Mathura',
  'Vrindavan',
  'Haridwar',
  'Rishikesh',
  'Amritsar (Golden Temple)',
  'Shirdi',
  'Somnath',
  'Rameswaram',
  'Kanchipuram',
  'Nashik',
  'Ujjain',
  'Pushkar',
  'Vrindavan',
  'Nathdwara',
  'Belur Math',
];

interface PlaceInputProps {
  places: string[];
  onChange: (places: string[]) => void;
  maxPlaces?: number;
}

export function PlaceInput({ places, onChange, maxPlaces = 8 }: PlaceInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInput = (val: string) => {
    setInputValue(val);
    if (val.trim().length >= 2) {
      const filtered = POPULAR_PLACES.filter(
        (p) =>
          p.toLowerCase().includes(val.toLowerCase()) &&
          !places.some((existing) => existing.toLowerCase() === p.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else if (val.trim() === '') {
      setSuggestions(
        POPULAR_PLACES.filter(
          (p) => !places.some((existing) => existing.toLowerCase() === p.toLowerCase())
        ).slice(0, 6)
      );
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addPlace = (place: string) => {
    const trimmed = place.trim();
    if (!trimmed) return;
    if (places.length >= maxPlaces) return;
    if (places.some((p) => p.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...places, trimmed]);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removePlace = (index: number) => {
    onChange(places.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addPlace(suggestions[0]);
      } else if (inputValue.trim()) {
        addPlace(inputValue);
      }
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <label className="block text-sm font-semibold text-gray-700 font-inter">
        Destinations{' '}
        <span className="text-gray-400 font-normal">(add up to {maxPlaces} places)</span>
      </label>

      {/* Selected places */}
      {places.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {places.map((place, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 border border-saffron-200 rounded-full text-sm font-medium text-saffron-700 font-inter animate-fade-in"
            >
              <MapPin size={12} className="text-saffron-500" />
              {place}
              <button
                type="button"
                onClick={() => removePlace(i)}
                className="ml-0.5 text-saffron-400 hover:text-red-500 transition-colors"
                aria-label={`Remove ${place}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      {places.length < maxPlaces && (
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleInput(e.target.value)}
                onFocus={() => {
                  if (inputValue.trim() === '') {
                    setSuggestions(
                      POPULAR_PLACES.filter(
                        (p) =>
                          !places.some(
                            (existing) => existing.toLowerCase() === p.toLowerCase()
                          )
                      ).slice(0, 6)
                    );
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search pilgrim destinations..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 hover:border-orange-300 rounded-xl text-gray-800 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (suggestions.length > 0) {
                  addPlace(suggestions[0]);
                } else if (inputValue.trim()) {
                  addPlace(inputValue);
                }
              }}
              disabled={!inputValue.trim() && suggestions.length === 0}
              className="px-3 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Add place"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-30 top-full left-0 right-12 mt-1 bg-white border border-orange-100 rounded-xl shadow-xl overflow-hidden animate-fade-in">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addPlace(suggestion);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-saffron-50 hover:text-saffron-700 font-inter transition-colors text-left"
                >
                  <MapPin size={14} className="text-saffron-400 flex-shrink-0" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {places.length === 0 && (
        <p className="text-xs text-gray-400 font-inter mt-1">
          Popular: Ayodhya, Varanasi, Tirupati, Kedarnath, Puri...
        </p>
      )}
    </div>
  );
}
