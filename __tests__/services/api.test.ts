import { api } from '@/services/api';
import type { ChatMessage, Trip, QueueInfo, TripFormData } from '@/types';

// Mock global fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

function createMockResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  } as unknown as Response;
}

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('api.chat', () => {
    it('sends correct request body and returns response', async () => {
      const mockResponse = {
        response: 'Jai Shri Ram! Here is your plan.',
        session_id: 'sess-abc-123',
        suggested_actions: ['Plan Char Dham'],
      };
      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const history: ChatMessage[] = [
        { role: 'user', content: 'Hello', timestamp: new Date() },
      ];

      const result = await api.chat('Plan my trip', 'session-1', history);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Plan my trip',
            session_id: 'session-1',
            history: [{ role: 'user', content: 'Hello' }],
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('throws error on non-200 response', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));

      await expect(api.chat('test', 'sid', [])).rejects.toThrow('API Error 400');
    });
  });

  describe('api.createTrip', () => {
    const tripData: TripFormData = {
      places: ['Ayodhya', 'Varanasi'],
      start_date: '2026-06-01',
      end_date: '2026-06-07',
      budget: 50000,
      travelers: 2,
      user_name: 'Ram Sharma',
      user_phone: '+91 9876543210',
    };

    it('creates a trip with correct payload', async () => {
      const mockTrip: Partial<Trip> = {
        trip_id: 'trip-001',
        places: tripData.places,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        budget: tripData.budget,
        travelers: tripData.travelers,
        itinerary_days: [],
        notifications: [],
      };
      mockFetch.mockResolvedValue(createMockResponse(mockTrip));

      const result = await api.createTrip(tripData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/trips'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(tripData),
        })
      );
      expect(result.trip_id).toBe('trip-001');
    });

    it('throws error on server error', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ error: 'Internal Server Error' }, 500));

      await expect(api.createTrip(tripData)).rejects.toThrow('API Error 500');
    });
  });

  describe('api.getTrip', () => {
    it('fetches trip by ID', async () => {
      const mockTrip: Partial<Trip> = {
        trip_id: 'trip-xyz',
        places: ['Kedarnath'],
        start_date: '2026-07-01',
        end_date: '2026-07-05',
        budget: 30000,
        travelers: 1,
        itinerary_days: [],
        notifications: [],
      };
      mockFetch.mockResolvedValue(createMockResponse(mockTrip));

      const result = await api.getTrip('trip-xyz');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/trips/trip-xyz'),
        expect.objectContaining({ method: 'GET' })
      );
      expect(result.trip_id).toBe('trip-xyz');
    });

    it('throws on 404', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));

      await expect(api.getTrip('nonexistent')).rejects.toThrow('API Error 404');
    });
  });

  describe('api.getNotifications', () => {
    it('fetches notifications for a trip', async () => {
      const mockNotifications = {
        notifications: [
          {
            id: 'n1',
            title: 'Book Tickets',
            message: 'Book your train now',
            notify_date: '2026-05-15',
            type: 'booking',
            priority: 'high',
          },
        ],
      };
      mockFetch.mockResolvedValue(createMockResponse(mockNotifications));

      const result = await api.getNotifications('trip-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/trips/trip-123/notifications'),
        expect.any(Object)
      );
      expect(result.notifications).toHaveLength(1);
    });
  });

  describe('api.getQueueTime', () => {
    it('fetches queue time for a place', async () => {
      const mockQueueInfo: QueueInfo = {
        place: 'Tirupati Balaji',
        query_date: '2026-04-30',
        estimated_wait_minutes: 120,
        crowd_level: 'very_high',
        best_time: '4:00 AM - 6:00 AM',
        tips: ['Arrive early'],
        is_festival_day: false,
        season: 'summer',
      };
      mockFetch.mockResolvedValue(createMockResponse(mockQueueInfo));

      const result = await api.getQueueTime('Tirupati Balaji', '2026-04-30');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/places\/.*\/queue\?date=2026-04-30/),
        expect.any(Object)
      );
      expect(result.place).toBe('Tirupati Balaji');
      expect(result.estimated_wait_minutes).toBe(120);
    });

    it('fetches queue time without date (uses today)', async () => {
      const mockQueueInfo: QueueInfo = {
        place: 'Kashi Vishwanath',
        query_date: '2026-04-30',
        estimated_wait_minutes: 45,
        crowd_level: 'moderate',
        best_time: '5:00 AM',
        tips: [],
        is_festival_day: false,
        season: 'summer',
      };
      mockFetch.mockResolvedValue(createMockResponse(mockQueueInfo));

      const result = await api.getQueueTime('Kashi Vishwanath');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/places\/.*Kashi.*\/queue/),
        expect.any(Object)
      );
      expect(result.crowd_level).toBe('moderate');
    });
  });

  describe('api.getPlaceSuggestions', () => {
    it('fetches place suggestions for a destination', async () => {
      const mockSuggestions = {
        places: [
          {
            name: 'Kashi Vishwanath Temple',
            description: 'One of the 12 Jyotirlingas',
            visit_duration_hours: 2,
            sequence: 1,
            category: 'temple',
          },
        ],
      };
      mockFetch.mockResolvedValue(createMockResponse(mockSuggestions));

      const result = await api.getPlaceSuggestions('Varanasi', 3);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/places/suggestions?destination=Varanasi&days=3'),
        expect.any(Object)
      );
      expect(result.places).toHaveLength(1);
    });
  });
});
