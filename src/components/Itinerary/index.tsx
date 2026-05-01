import React from 'react';
import { IndianRupee, Calendar, Users, MapPin } from 'lucide-react';
import type { Trip } from '@/types';
import { DayCard } from './DayCard';
import { Card } from '@/components/ui/Card';

interface ItineraryProps {
  trip: Trip;
}

export default function Itinerary({ trip }: ItineraryProps) {
  const days = trip.itinerary_days;
  const totalCost = days.reduce((sum, day) => sum + day.estimated_daily_cost, 0);
  const tripDays = days.length;

  return (
    <div className="space-y-6">
      {/* Trip Overview Card */}
      <Card className="bg-gradient-to-br from-saffron-500 to-deepred-500 !border-0 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold font-poppins mb-1">Your Sacred Journey</h2>
            <div className="flex flex-wrap items-center gap-1 text-sm text-white/80 font-inter">
              {trip.places.map((place, i) => (
                <span key={place} className="flex items-center gap-1">
                  <MapPin size={12} />
                  {place}
                  {i < trip.places.length - 1 && <span className="mx-0.5 text-white/40">→</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold font-poppins">{tripDays}</div>
              <div className="text-xs text-white/70 font-inter flex items-center gap-1">
                <Calendar size={12} />
                Days
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-poppins">{trip.travelers}</div>
              <div className="text-xs text-white/70 font-inter flex items-center gap-1">
                <Users size={12} />
                Travelers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-poppins flex items-center">
                <span className="text-lg">₹</span>
                {(totalCost / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-white/70 font-inter flex items-center gap-1">
                <IndianRupee size={12} />
                Est. Total
              </div>
            </div>
          </div>
        </div>

        {/* Date range */}
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-sm text-white/80 font-inter">
          <Calendar size={14} />
          <span>
            {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(trip.start_date))}
            {' '}&rarr;{' '}
            {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(trip.end_date))}
          </span>
        </div>
      </Card>

      {/* Day cards */}
      {days.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-inter">
          <div className="text-4xl mb-3">📅</div>
          <p className="font-medium">Itinerary is being prepared...</p>
          <p className="text-sm mt-1 text-gray-400">Check back shortly for your day-by-day plan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((day, i) => (
            <DayCard key={day.day} day={day} isFirst={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
