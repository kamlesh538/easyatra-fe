export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  suggested_actions?: string[];
}

export interface Place {
  name: string;
  description: string;
  visit_duration_hours: number;
  sequence: number;
  category: 'temple' | 'ghat' | 'museum' | 'ashram' | 'dham' | 'shrine' | 'other';
  deity?: string;
  best_time_to_visit?: string;
  special_notes?: string;
}

export interface PlaceSuggestionsResponse {
  destination: string;
  days: number;
  places: Place[];
  travel_tips: string[];
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  place: string;
  duration_hours: number;
  cost: number;
  notes?: string;
}

export interface TravelOption {
  mode: 'train' | 'bus' | 'flight' | 'auto' | 'walk';
  from_place: string;
  to_place: string;
  duration_hours: number;
  estimated_cost: number;
  notes?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  activities: ItineraryActivity[];
  travel_options: TravelOption[];
  accommodation?: string;
  estimated_daily_cost: number;
  special_notes?: string;
}

/** @deprecated use ItineraryDay */
export type TripDay = ItineraryDay;

export interface NotificationSummary {
  id: string;
  title: string;
  message: string;
  notify_date: string;
  notification_type: 'booking' | 'reminder' | 'alert';
  priority: 'high' | 'medium' | 'low';
}

export interface NotificationDetail extends NotificationSummary {
  trip_id: string;
  is_sent: boolean;
  place_name?: string;
  created_at: string;
}

export interface NotificationList {
  notifications: NotificationDetail[];
  total: number;
}

/** Alias used by UI components — backed by NotificationSummary from API */
export type Notification = NotificationSummary & { booking_url?: string };

export interface Trip {
  trip_id: string;
  user_name: string;
  places: string[];
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  status: string;
  itinerary?: Record<string, unknown>;
  itinerary_days: ItineraryDay[];  // populated by GET /trips/{id}, may be [] after POST
  notifications: NotificationSummary[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QueueInfo {
  place: string;
  query_date: string;
  estimated_wait_minutes: number;
  crowd_level: 'low' | 'moderate' | 'high' | 'very_high';
  best_time: string;
  tips: string[];
  is_festival_day: boolean;
  festival_name?: string;
  season: string;
}

export interface TripFormData {
  places: string[];
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  user_name: string;
  user_phone?: string;
}
