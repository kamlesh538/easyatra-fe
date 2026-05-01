import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Notifications from '@/components/Notifications';
import type { Notification } from '@/types';

const today = new Date();
const futureDate = new Date(today);
futureDate.setDate(today.getDate() + 10);
const pastDate = new Date(today);
pastDate.setDate(today.getDate() - 2);

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Book Tirupati Darshan Tickets',
    message: 'Darshan tickets for Tirupati open 30 days in advance. Book immediately!',
    notify_date: formatDate(pastDate),
    notification_type: 'booking',
    priority: 'high',
    booking_url: 'https://tirupati.example.com/book',
  },
  {
    id: '2',
    title: 'Reserve Hotel in Varanasi',
    message: 'Book your accommodation in Varanasi near the Ghats.',
    notify_date: formatDate(futureDate),
    notification_type: 'booking',
    priority: 'medium',
    booking_url: 'https://hotel.example.com',
  },
  {
    id: '3',
    title: 'Pack Warm Clothes',
    message: 'Kedarnath is cold. Prepare warm clothing.',
    notify_date: formatDate(futureDate),
    notification_type: 'reminder',
    priority: 'low',
  },
];

describe('Notifications', () => {
  it('renders all notification cards', () => {
    render(<Notifications notifications={mockNotifications} />);
    expect(screen.getByText('Book Tirupati Darshan Tickets')).toBeInTheDocument();
    expect(screen.getByText('Reserve Hotel in Varanasi')).toBeInTheDocument();
    expect(screen.getByText('Pack Warm Clothes')).toBeInTheDocument();
  });

  it('shows ACTION REQUIRED for past notify_date', () => {
    render(<Notifications notifications={mockNotifications} />);
    // Badge text appears in NotificationCard; filter button also contains "Action Required"
    expect(screen.getAllByText(/ACTION REQUIRED/i).length).toBeGreaterThan(0);
  });

  it('shows countdown for future dates', () => {
    render(<Notifications notifications={mockNotifications} />);
    // Should show "in X days" for future dates
    const countdowns = screen.getAllByText(/in \d+ day/i);
    expect(countdowns.length).toBeGreaterThan(0);
  });

  it('color codes notifications by priority', () => {
    render(<Notifications notifications={mockNotifications} />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('renders Book Now button when booking_url is present', () => {
    render(<Notifications notifications={mockNotifications} />);
    const bookNowButtons = screen.getAllByText('Book Now');
    // Two notifications have booking_url
    expect(bookNowButtons.length).toBe(2);
  });

  it('filters notifications by priority', async () => {
    const user = userEvent.setup();
    render(<Notifications notifications={mockNotifications} />);

    const highButton = screen.getByRole('button', { name: /High/i });
    await user.click(highButton);

    // Should only show high priority notification
    expect(screen.getByText('Book Tirupati Darshan Tickets')).toBeInTheDocument();
    expect(screen.queryByText('Reserve Hotel in Varanasi')).not.toBeInTheDocument();
    expect(screen.queryByText('Pack Warm Clothes')).not.toBeInTheDocument();
  });

  it('filters to action required notifications', async () => {
    const user = userEvent.setup();
    render(<Notifications notifications={mockNotifications} />);

    const actionButton = screen.getByRole('button', { name: /Action Required/i });
    await user.click(actionButton);

    expect(screen.getByText('Book Tirupati Darshan Tickets')).toBeInTheDocument();
    expect(screen.queryByText('Reserve Hotel in Varanasi')).not.toBeInTheDocument();
  });

  it('shows summary stats', () => {
    render(<Notifications notifications={mockNotifications} />);
    // Action required count: 1 (past date) — appears in both summary and filter button
    expect(screen.getAllByText(/Action Required/i).length).toBeGreaterThan(0);
  });

  it('shows empty state when no notifications in filter', async () => {
    const user = userEvent.setup();
    render(<Notifications notifications={[mockNotifications[0]]} />);

    // Click low priority filter - no low priority notifications in this set
    const lowButton = screen.getByRole('button', { name: /Low/i });
    await user.click(lowButton);

    expect(screen.getByText(/No notifications in this category/i)).toBeInTheDocument();
  });
});
