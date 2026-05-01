import React from 'react';
import { Bell, AlertTriangle, Info, ExternalLink, Clock } from 'lucide-react';
import type { Notification } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface NotificationCardProps {
  notification: Notification;
}

function getDaysUntil(dateStr: string): number {
  const notifyDate = new Date(dateStr);
  notifyDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((notifyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const typeConfig = {
  booking: {
    icon: Bell,
    label: 'Booking',
    bgClass: 'bg-blue-50',
    iconClass: 'text-blue-500',
  },
  reminder: {
    icon: Clock,
    label: 'Reminder',
    bgClass: 'bg-purple-50',
    iconClass: 'text-purple-500',
  },
  alert: {
    icon: AlertTriangle,
    label: 'Alert',
    bgClass: 'bg-orange-50',
    iconClass: 'text-orange-500',
  },
};

const priorityBorderClass = {
  high: 'border-red-300 border-l-4 border-l-red-500',
  medium: 'border-yellow-200 border-l-4 border-l-yellow-500',
  low: 'border-green-200 border-l-4 border-l-green-500',
};

const priorityBadgeVariant: Record<
  Notification['priority'],
  'danger' | 'warning' | 'success'
> = {
  high: 'danger',
  medium: 'warning',
  low: 'success',
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const daysUntil = getDaysUntil(notification.notify_date);
  const isActionRequired = daysUntil <= 0;
  const { icon: TypeIcon, bgClass, iconClass } = typeConfig[notification.notification_type as keyof typeof typeConfig] ?? typeConfig.reminder;

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(notification.notify_date));

  return (
    <div
      className={`
        rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in
        ${priorityBorderClass[notification.priority]}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}>
          <TypeIcon size={18} className={iconClass} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-bold font-poppins text-gray-800 text-sm leading-snug">
              {notification.title}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isActionRequired && (
                <Badge variant="danger" size="sm">
                  <AlertTriangle size={10} />
                  ACTION REQUIRED
                </Badge>
              )}
              <Badge variant={priorityBadgeVariant[notification.priority]} size="sm">
                {notification.priority.toUpperCase()}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-gray-600 font-inter mt-1 leading-relaxed">
            {notification.message}
          </p>

          {/* Date & Countdown */}
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-inter">
              <Clock size={12} />
              {formattedDate}
              {isActionRequired ? (
                <span className="ml-1 text-red-600 font-semibold animate-pulse">
                  (Overdue by {Math.abs(daysUntil)} day{Math.abs(daysUntil) !== 1 ? 's' : ''})
                </span>
              ) : daysUntil === 0 ? (
                <span className="ml-1 text-orange-600 font-semibold">Today!</span>
              ) : (
                <span className="ml-1 text-gray-400">
                  in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {notification.booking_url && (
              <a
                href={notification.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-500 hover:bg-saffron-600 text-white rounded-lg text-xs font-semibold font-inter transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                <ExternalLink size={12} />
                Book Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
