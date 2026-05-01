import React from 'react';
import {
  MapPin,
  Clock,
  IndianRupee,
  Train,
  Bus,
  Plane,
  Car,
  User,
  Hotel,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ItineraryDay, TravelOption } from '@/types';

function TravelModeIcon({ mode }: { mode: TravelOption['mode'] }) {
  const icons = {
    train: Train,
    bus: Bus,
    flight: Plane,
    auto: Car,
    walk: User,
  };
  const Icon = icons[mode] ?? Car;
  return <Icon size={16} />;
}

function TravelBanner({ travel }: { travel: TravelOption }) {
  const modeColors: Record<TravelOption['mode'], string> = {
    train: 'bg-blue-50 border-blue-200 text-blue-700',
    bus: 'bg-green-50 border-green-200 text-green-700',
    flight: 'bg-purple-50 border-purple-200 text-purple-700',
    auto: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    walk: 'bg-teal-50 border-teal-200 text-teal-700',
  };

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-inter ${modeColors[travel.mode]}`}>
      <TravelModeIcon mode={travel.mode} />
      <div className="flex-1 min-w-0">
        <span className="font-semibold capitalize">{travel.mode}</span>
        {travel.notes && <span className="mx-1 opacity-70">— {travel.notes}</span>}
        <span className="mx-1">·</span>
        <span>{travel.from_place}</span>
        <span className="mx-1">→</span>
        <span>{travel.to_place}</span>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-semibold">₹{travel.estimated_cost.toLocaleString('en-IN')}</div>
        <div className="text-xs opacity-75">{travel.duration_hours}h</div>
      </div>
    </div>
  );
}

interface DayCardProps {
  day: ItineraryDay;
  isFirst?: boolean;
}

export function DayCard({ day, isFirst }: DayCardProps) {
  const [expanded, setExpanded] = React.useState(isFirst ?? true);

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(day.date));

  return (
    <div className="border border-orange-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-orange-50/50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-500 to-deepred-500 flex flex-col items-center justify-center text-white shadow-md">
            <span className="text-lg font-bold font-poppins leading-none">{day.day}</span>
            <span className="text-[10px] font-inter opacity-80">DAY</span>
          </div>
          <div>
            <h3 className="font-bold font-poppins text-gray-800">
              <MapPin size={14} className="inline text-saffron-500 mr-1" />
              {day.location}
            </h3>
            <p className="text-sm text-gray-500 font-inter">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-700 font-inter flex items-center gap-0.5">
              <IndianRupee size={13} />
              {day.estimated_daily_cost.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-gray-400 font-inter">est. cost</div>
          </div>
          {expanded ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in">
          {/* Travel options */}
          {day.travel_options.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide font-inter mb-2">
                How to get there
              </p>
              <div className="space-y-2">
                {day.travel_options.map((t, i) => (
                  <TravelBanner key={i} travel={t} />
                ))}
              </div>
            </div>
          )}

          {/* Activities timeline */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide font-inter mb-3">
              Activities
            </p>
            <div className="relative space-y-0">
              {day.activities.map((activity, i) => (
                <div key={i} className="relative flex gap-4 pb-4 last:pb-0">
                  {i < day.activities.length - 1 && (
                    <div className="absolute left-[22px] top-10 bottom-0 w-0.5 bg-orange-100" />
                  )}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div className="w-11 h-11 rounded-full bg-cream border-2 border-saffron-200 flex items-center justify-center shadow-sm">
                      <Clock size={14} className="text-saffron-500" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-inter font-semibold whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  <div className="flex-1 bg-orange-50/50 rounded-xl p-3 border border-orange-100/60">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-800 font-poppins text-sm">
                        {activity.place}
                      </h4>
                      {activity.cost > 0 && (
                        <span className="flex-shrink-0 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 font-inter">
                          ₹{activity.cost.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-inter mt-0.5 leading-relaxed">
                      {activity.activity}
                    </p>
                    <p className="text-xs text-gray-400 font-inter mt-1 flex items-center gap-1">
                      <Clock size={11} />
                      {activity.duration_hours}h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accommodation */}
          {day.accommodation && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm font-inter text-blue-700">
              <Hotel size={16} className="flex-shrink-0 text-blue-500" />
              <span>
                <strong>Stay:</strong> {day.accommodation}
              </span>
            </div>
          )}

          {day.special_notes && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-inter">
              {day.special_notes}
            </p>
          )}

          <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 font-inter sm:hidden">
            <IndianRupee size={14} />
            Estimated cost: {day.estimated_daily_cost.toLocaleString('en-IN')}
          </div>
        </div>
      )}
    </div>
  );
}
