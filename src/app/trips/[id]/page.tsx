'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Bell, Clock, MapPin, Share2, ArrowLeft, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/services/api';
import type { Trip } from '@/types';
import Itinerary from '@/components/Itinerary';
import Notifications from '@/components/Notifications';
import QueueChecker from '@/components/QueueChecker';
import { PageLoader } from '@/components/ui/Loading';

type Tab = 'itinerary' | 'notifications' | 'queue';

const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: 'itinerary', label: 'Itinerary', icon: Calendar },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'queue', label: 'Queue Times', icon: Clock },
];

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const data = await api.getTrip(tripId);
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trip. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My EasyAtra Pilgrimage Plan',
          text: `Check out my pilgrimage plan to ${trip?.places.join(', ')}!`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch {
      // User cancelled or not supported
    }
  };

  if (loading) {
    return <PageLoader text="Loading your sacred journey..." />;
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-2">Trip Not Found</h2>
        <p className="text-gray-500 font-inter mb-6 max-w-md">
          {error || "We couldn't find this trip. It may have expired or been deleted."}
        </p>
        <Link
          href="/planner"
          className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl font-semibold font-inter transition-colors shadow-md"
        >
          <Calendar size={18} />
          Plan a New Trip
        </Link>
      </div>
    );
  }

  const actionRequired = trip.notifications.filter((n) => {
    const d = new Date(n.notify_date);
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d <= today;
  }).length;

  return (
    <div className="min-h-screen pb-12">
      {/* Trip Header */}
      <div className="bg-gradient-to-r from-saffron-500 to-deepred-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back link */}
          <Link
            href="/planner"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-inter mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Plan Another Trip
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-white/70 text-sm font-inter mb-2">
                <MapPin size={14} />
                {trip.places.join(' → ')}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-poppins">Your Pilgrimage Plan</h1>
              <div className="flex items-center gap-4 mt-2 text-white/80 text-sm font-inter flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(
                    new Date(trip.start_date)
                  )}{' '}
                  –{' '}
                  {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(
                    new Date(trip.end_date)
                  )}
                </span>
                <span>·</span>
                <span>{trip.itinerary_days.length} days</span>
                <span>·</span>
                <span>{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold font-inter transition-colors border border-white/20"
            >
              <Share2 size={16} />
              {shareSuccess ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 -mb-px">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  relative flex items-center gap-2 px-5 py-3 text-sm font-semibold font-inter
                  rounded-t-xl transition-all duration-200
                  ${
                    activeTab === key
                      ? 'bg-cream text-saffron-600'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon size={16} />
                {label}
                {key === 'notifications' && actionRequired > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {actionRequired}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {activeTab === 'itinerary' && <Itinerary trip={trip} />}
        {activeTab === 'notifications' && <Notifications notifications={trip.notifications} />}
        {activeTab === 'queue' && <QueueChecker />}
      </div>
    </div>
  );
}
