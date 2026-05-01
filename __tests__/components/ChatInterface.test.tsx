import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInterface from '@/components/ChatInterface';
import { api } from '@/services/api';

// Mock the API module
jest.mock('@/services/api', () => ({
  api: {
    chat: jest.fn(),
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

const mockApi = api as jest.Mocked<typeof api>;
const mockOnClose = jest.fn();

function renderChat(props?: Partial<React.ComponentProps<typeof ChatInterface>>) {
  return render(
    <ChatInterface onClose={mockOnClose} {...props} />
  );
}

describe('ChatInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockApi.chat.mockResolvedValue({
      response: 'Namaste! I can help you plan your pilgrimage.',
      session_id: 'test-session-123',
      suggested_actions: [],
    });
  });

  it('renders the initial greeting message', () => {
    renderChat();
    expect(
      screen.getByText(/Jai Shri Ram/i)
    ).toBeInTheDocument();
  });

  it('renders the AI assistant name in the header', () => {
    renderChat();
    expect(screen.getByText('EasyAtra')).toBeInTheDocument();
  });

  it('renders quick reply buttons on initial state', () => {
    renderChat();
    expect(screen.getByText('Plan Char Dham Yatra')).toBeInTheDocument();
    expect(screen.getByText('Visit Ayodhya & Varanasi')).toBeInTheDocument();
    expect(screen.getByText('Tirupati Darshan')).toBeInTheDocument();
    expect(screen.getByText('Custom Trip')).toBeInTheDocument();
  });

  it('sends a message on form submit', async () => {
    const user = userEvent.setup();
    renderChat();

    const input = screen.getByPlaceholderText(/Ask about your pilgrimage/i);
    await user.type(input, 'I want to visit Varanasi');

    const sendButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendButton);

    await waitFor(() => {
      expect(mockApi.chat).toHaveBeenCalledWith(
        'I want to visit Varanasi',
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  it('shows user message in the chat after sending', async () => {
    const user = userEvent.setup();
    renderChat();

    const input = screen.getByPlaceholderText(/Ask about your pilgrimage/i);
    await user.type(input, 'Plan my Tirupati trip');

    const sendButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendButton);

    expect(screen.getByText('Plan my Tirupati trip')).toBeInTheDocument();
  });

  it('shows AI response after receiving', async () => {
    const user = userEvent.setup();
    renderChat();

    const input = screen.getByPlaceholderText(/Ask about your pilgrimage/i);
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('Namaste! I can help you plan your pilgrimage.')).toBeInTheDocument();
    });
  });

  it('disables input while loading', async () => {
    // Make API call take time
    mockApi.chat.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        response: 'Response',
        session_id: 'sid',
      }), 500))
    );

    const user = userEvent.setup();
    renderChat();

    const input = screen.getByPlaceholderText(/Ask about your pilgrimage/i);
    await user.type(input, 'test');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Input should be disabled while loading
    expect(input).toBeDisabled();
  });

  it('stores session_id in localStorage after receiving response', async () => {
    const user = userEvent.setup();
    renderChat();

    const input = screen.getByPlaceholderText(/Ask about your pilgrimage/i);
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(localStorage.getItem('easyatra_session_id')).toBe('test-session-123');
    });
  });

  it('handles API errors gracefully', async () => {
    mockApi.chat.mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    renderChat();

    const input = screen.getByPlaceholderText(/Ask about your pilgrimage/i);
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an issue/i)).toBeInTheDocument();
    });
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    renderChat();

    const closeButton = screen.getByRole('button', { name: /close chat/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('sends message when Enter key is pressed', async () => {
    const user = userEvent.setup();
    renderChat();

    const input = screen.getByPlaceholderText(/Ask about your pilgrimage/i);
    await user.type(input, 'Test message{Enter}');

    await waitFor(() => {
      expect(mockApi.chat).toHaveBeenCalledWith(
        'Test message',
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  it('sends message when quick reply button clicked', async () => {
    const user = userEvent.setup();
    renderChat();

    const quickReply = screen.getByText('Tirupati Darshan');
    await user.click(quickReply);

    await waitFor(() => {
      expect(mockApi.chat).toHaveBeenCalledWith(
        'Tirupati Darshan',
        expect.any(String),
        expect.any(Array)
      );
    });
  });
});
