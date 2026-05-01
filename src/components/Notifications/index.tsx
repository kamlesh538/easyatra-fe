'use client';

import React, { useState } from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import type { Notification } from '@/types';
import { NotificationCard } from './NotificationCard';

interface NotificationsProps {
  notifications: Notification[];
}

type Filter = 'all' | 'high' | 'medium' | 'low' | 'action';

export default function Notifications({ notifications }: NotificationsProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const actionRequired = notifications.filter(
    (n) => new Date(n.notify_date) <= today
  );

  const sorted = [...notifications].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const dateA = new Date(a.notify_date).getTime();
    const dateB = new Date(b.notify_date).getTime();
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    return pDiff !== 0 ? pDiff : dateA - dateB;
  });

  const filtered = sorted.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'action') return new Date(n.notify_date) <= today;
    return n.priority === filter;
  });

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'action', label: 'Action Required', count: actionRequired.length },
    { key: 'high', label: 'High', count: notifications.filter((n) => n.priority === 'high').length },
    { key: 'medium', label: 'Medium', count: notifications.filter((n) => n.priority === 'medium').length },
    { key: 'low', label: 'Low', count: notifications.filter((n) => n.priority === 'low').length },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-red-600 font-poppins">
            {actionRequired.length}
          </div>
          <div className="text-xs text-red-600 font-inter mt-0.5 flex items-center justify-center gap-1">
            <AlertTriangle size={11} />
            Action Required
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-yellow-700 font-poppins">
            {notifications.filter((n) => n.priority === 'medium').length}
          </div>
          <div className="text-xs text-yellow-700 font-inter mt-0.5 flex items-center justify-center gap-1">
            <Clock size={11} />
            Upcoming
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-700 font-poppins">
            {notifications.filter((n) => n.priority === 'low').length}
          </div>
          <div className="text-xs text-green-700 font-inter mt-0.5 flex items-center justify-center gap-1">
            <CheckCircle size={11} />
            Low Priority
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-semibold font-inter transition-all duration-200 flex items-center gap-1.5
              ${
                filter === key
                  ? 'bg-saffron-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-saffron-600'
              }
            `}
          >
            {label}
            {count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === key ? 'bg-white/20' : 'bg-gray-200'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 font-inter">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No notifications in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}
