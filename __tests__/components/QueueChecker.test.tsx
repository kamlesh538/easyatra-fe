import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QueueChecker from '@/components/QueueChecker';
import { api } from '@/services/api';
import type { QueueInfo } from '@/types';

jest.mock('@/services/api', () => ({
  api: {
    getQueueTime: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

const mockQueueInfo: QueueInfo = {
  place: 'Tirupati Balaji',
  estimated_wait_minutes: 90,
  crowd_level: 'high',
  best_time: '4:00 AM - 6:00 AM',
  tips: [
    'Arrive before sunrise to avoid peak crowd',
    'Book Special Entry Darshan tickets in advance',
    'Avoid visiting on weekends and festival days',
  ],
  query_date: '2026-04-30',
  is_festival_day: false,
  season: 'summer',
};

describe('QueueChecker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search form', () => {
    render(<QueueChecker />);
    expect(screen.getByPlaceholderText(/Search temple or holy place/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Check Queue/i })).toBeInTheDocument();
  });

  it('renders popular temple buttons', () => {
    render(<QueueChecker />);
    expect(screen.getByText('Tirupati Balaji')).toBeInTheDocument();
    expect(screen.getByText('Vaishno Devi')).toBeInTheDocument();
    expect(screen.getByText('Kedarnath')).toBeInTheDocument();
  });

  it('disables the check button when no place is entered', () => {
    render(<QueueChecker />);
    const button = screen.getByRole('button', { name: /Check Queue/i });
    expect(button).toBeDisabled();
  });

  it('enables button after typing a place name', async () => {
    const user = userEvent.setup();
    render(<QueueChecker />);

    const input = screen.getByPlaceholderText(/Search temple or holy place/i);
    await user.type(input, 'Tirupati');

    const button = screen.getByRole('button', { name: /Check Queue/i });
    expect(button).not.toBeDisabled();
  });

  it('calls API on form submit', async () => {
    mockApi.getQueueTime.mockResolvedValue(mockQueueInfo);
    const user = userEvent.setup();
    render(<QueueChecker />);

    const input = screen.getByPlaceholderText(/Search temple or holy place/i);
    await user.type(input, 'Tirupati Balaji');
    await user.click(screen.getByRole('button', { name: /Check Queue/i }));

    await waitFor(() => {
      expect(mockApi.getQueueTime).toHaveBeenCalledWith('Tirupati Balaji', expect.any(String));
    });
  });

  it('displays results after API call', async () => {
    mockApi.getQueueTime.mockResolvedValue(mockQueueInfo);
    const user = userEvent.setup();
    render(<QueueChecker />);

    const input = screen.getByPlaceholderText(/Search temple or holy place/i);
    await user.type(input, 'Tirupati Balaji');
    await user.click(screen.getByRole('button', { name: /Check Queue/i }));

    await waitFor(() => {
      expect(screen.getByText('Tirupati Balaji')).toBeInTheDocument();
    });
  });

  it('displays crowd level in results', async () => {
    mockApi.getQueueTime.mockResolvedValue(mockQueueInfo);
    const user = userEvent.setup();
    render(<QueueChecker />);

    const input = screen.getByPlaceholderText(/Search temple or holy place/i);
    await user.type(input, 'Tirupati Balaji');
    await user.click(screen.getByRole('button', { name: /Check Queue/i }));

    await waitFor(() => {
      expect(screen.getByText('High Crowd')).toBeInTheDocument();
    });
  });

  it('displays estimated wait time in results', async () => {
    mockApi.getQueueTime.mockResolvedValue(mockQueueInfo);
    const user = userEvent.setup();
    render(<QueueChecker />);

    const input = screen.getByPlaceholderText(/Search temple or holy place/i);
    await user.type(input, 'Tirupati Balaji');
    await user.click(screen.getByRole('button', { name: /Check Queue/i }));

    await waitFor(() => {
      // 90 minutes = 1h 30m
      expect(screen.getByText(/1h 30m/i)).toBeInTheDocument();
    });
  });

  it('displays tips in results', async () => {
    mockApi.getQueueTime.mockResolvedValue(mockQueueInfo);
    const user = userEvent.setup();
    render(<QueueChecker />);

    const input = screen.getByPlaceholderText(/Search temple or holy place/i);
    await user.type(input, 'Tirupati Balaji');
    await user.click(screen.getByRole('button', { name: /Check Queue/i }));

    await waitFor(() => {
      expect(screen.getByText('Arrive before sunrise to avoid peak crowd')).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    mockApi.getQueueTime.mockRejectedValue(new Error('Service unavailable'));
    const user = userEvent.setup();
    render(<QueueChecker />);

    const input = screen.getByPlaceholderText(/Search temple or holy place/i);
    await user.type(input, 'Tirupati');
    await user.click(screen.getByRole('button', { name: /Check Queue/i }));

    await waitFor(() => {
      expect(screen.getByText('Service unavailable')).toBeInTheDocument();
    });
  });

  it('calls API when popular temple button is clicked', async () => {
    mockApi.getQueueTime.mockResolvedValue(mockQueueInfo);
    const user = userEvent.setup();
    render(<QueueChecker />);

    const templeBtn = screen.getByText('Vaishno Devi');
    await user.click(templeBtn);

    await waitFor(() => {
      expect(mockApi.getQueueTime).toHaveBeenCalledWith('Vaishno Devi', expect.any(String));
    });
  });

  it('shows "Estimated Wait" label in results', async () => {
    mockApi.getQueueTime.mockResolvedValue(mockQueueInfo);
    const user = userEvent.setup();
    render(<QueueChecker />);

    const input = screen.getByPlaceholderText(/Search temple or holy place/i);
    await user.type(input, 'Tirupati');
    await user.click(screen.getByRole('button', { name: /Check Queue/i }));

    await waitFor(() => {
      expect(screen.getByText('Estimated Wait')).toBeInTheDocument();
    });
  });
});
