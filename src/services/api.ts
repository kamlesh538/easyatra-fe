import type { ChatMessage, ChatResponse, Notification, Place, QueueInfo, Trip, TripFormData } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_V1 = `${API_BASE}/api/v1`;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  chat: async (
    message: string,
    sessionId: string,
    history: ChatMessage[]
  ): Promise<ChatResponse> => {
    const response = await fetch(`${API_V1}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        history: history.map((h) => ({
          role: h.role,
          content: h.content,
        })),
      }),
    });
    return handleResponse<ChatResponse>(response);
  },

  createTrip: async (data: TripFormData): Promise<Trip> => {
    const response = await fetch(`${API_V1}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Trip>(response);
  },

  getTrip: async (tripId: string): Promise<Trip> => {
    const response = await fetch(`${API_V1}/trips/${tripId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<Trip>(response);
  },

  getNotifications: async (tripId: string): Promise<{ notifications: Notification[] }> => {
    const response = await fetch(`${API_V1}/trips/${tripId}/notifications`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ notifications: Notification[] }>(response);
  },

  getQueueTime: async (placeName: string, date?: string): Promise<QueueInfo> => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(
      `${API_V1}/places/${encodeURIComponent(placeName)}/queue${query}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    return handleResponse<QueueInfo>(response);
  },

  getPlaceSuggestions: async (
    destination: string,
    days: number
  ): Promise<{ places: Place[] }> => {
    const params = new URLSearchParams({
      destination,
      days: days.toString(),
    });
    const response = await fetch(`${API_V1}/places/suggestions?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ places: Place[] }>(response);
  },
};
