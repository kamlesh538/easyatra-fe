'use client';

import React, { useState } from 'react';
import { Search, Clock, Users, Lightbulb, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';
import type { QueueInfo } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

const POPULAR_TEMPLES = [
  'Tirupati Balaji',
  'Vaishno Devi',
  'Kedarnath',
  'Kashi Vishwanath',
  'Ram Mandir Ayodhya',
  'Somnath',
  'Shirdi Sai Baba',
  'Puri Jagannath',
  'Dwarkadheesh',
  'Mahakaleshwar Ujjain',
];

const crowdConfig: Record<
  QueueInfo['crowd_level'],
  { label: string; barWidth: string; barColor: string; bgColor: string; textColor: string; icon: React.ReactNode }
> = {
  low: {
    label: 'Low Crowd',
    barWidth: 'w-1/4',
    barColor: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: <TrendingDown size={18} />,
  },
  moderate: {
    label: 'Moderate Crowd',
    barWidth: 'w-1/2',
    barColor: 'bg-yellow-400',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: <Users size={18} />,
  },
  high: {
    label: 'High Crowd',
    barWidth: 'w-3/4',
    barColor: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    icon: <TrendingUp size={18} />,
  },
  very_high: {
    label: 'Very High Crowd',
    barWidth: 'w-full',
    barColor: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: <AlertTriangle size={18} />,
  },
};

interface QueueCheckerProps {
  compact?: boolean;
}

export default function QueueChecker({ compact = false }: QueueCheckerProps) {
  const [placeName, setPlaceName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<QueueInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (overrideName?: string) => {
    const name = overrideName ?? placeName;
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.getQueueTime(name.trim(), date);
      setResult(data);
      if (overrideName) setPlaceName(overrideName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch queue information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="space-y-6">
      {!compact && (
        <div>
          <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-1">Queue Time Checker</h2>
          <p className="text-gray-500 font-inter text-sm">
            Check estimated waiting times at popular temples and holy sites
          </p>
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search temple or holy place..."
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            leftIcon={<Search size={16} />}
            aria-label="Temple name"
          />
        </div>
        <div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Date"
          />
        </div>
        <Button type="submit" loading={loading} disabled={!placeName.trim()}>
          <Search size={16} />
          {loading ? 'Checking...' : 'Check Queue'}
        </Button>
      </form>

      {/* Popular temples */}
      {!result && !loading && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide font-inter mb-2">
            Popular Temples
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TEMPLES.map((temple) => (
              <button
                key={temple}
                type="button"
                onClick={() => handleSearch(temple)}
                className="px-3 py-1.5 text-xs font-medium text-saffron-600 border border-saffron-200 bg-saffron-50 hover:bg-saffron-100 rounded-full font-inter transition-colors duration-200"
              >
                {temple}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 font-inter text-sm flex items-center gap-2">
          <AlertTriangle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <Card className="animate-slide-up" elevated>
          <div className="space-y-5">
            {/* Place name & date */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-xl font-bold font-poppins text-gray-800">{result.place}</h3>
                <p className="text-sm text-gray-500 font-inter">
                  As of{' '}
                  {new Intl.DateTimeFormat('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date(result.query_date))}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="text-sm text-gray-400 hover:text-gray-600 font-inter underline"
              >
                Search again
              </button>
            </div>

            {/* Crowd Level Indicator */}
            {(() => {
              const config = crowdConfig[result.crowd_level];
              return (
                <div className={`rounded-xl p-4 ${config.bgColor}`}>
                  <div className={`flex items-center gap-2 font-semibold font-poppins ${config.textColor} mb-3`}>
                    {config.icon}
                    <span>{config.label}</span>
                  </div>
                  <div className="h-3 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${config.barColor} transition-all duration-1000`}
                      style={{
                        width:
                          result.crowd_level === 'low'
                            ? '25%'
                            : result.crowd_level === 'moderate'
                            ? '50%'
                            : result.crowd_level === 'high'
                            ? '75%'
                            : '95%',
                      }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream border border-orange-100 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-3xl font-bold text-saffron-600 font-poppins">
                  <Clock size={24} />
                  {result.estimated_wait_minutes >= 60
                    ? `${Math.floor(result.estimated_wait_minutes / 60)}h ${result.estimated_wait_minutes % 60}m`
                    : `${result.estimated_wait_minutes}m`}
                </div>
                <p className="text-sm text-gray-500 font-inter mt-1">Estimated Wait</p>
              </div>
              <div className="bg-cream border border-orange-100 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-saffron-600 font-poppins">
                  {result.best_time}
                </div>
                <p className="text-sm text-gray-500 font-inter mt-1">Best Time to Visit</p>
              </div>
            </div>

            {/* Tips */}
            {result.tips.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 font-poppins mb-2">
                  <Lightbulb size={16} className="text-yellow-500" />
                  Pilgrim Tips
                </div>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 font-inter"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
