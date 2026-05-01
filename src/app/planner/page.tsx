import type { Metadata } from 'next';
import TripPlanner from '@/components/TripPlanner';

export const metadata: Metadata = {
  title: 'Plan Your Trip — EasyAtra',
  description: 'Create your personalized Hindu pilgrimage itinerary with AI assistance.',
};

export default function PlannerPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-saffron-50 border border-saffron-200 rounded-full text-saffron-700 text-sm font-semibold font-inter mb-4">
          <span>🕉</span>
          Plan Your Sacred Journey
        </div>
        <h1 className="text-4xl font-bold font-poppins text-gray-800 mb-3">
          Create Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-deepred-500">
            Pilgrimage Plan
          </span>
        </h1>
        <p className="text-gray-500 font-inter">
          Tell us your destinations, dates, and budget — our AI will create a complete itinerary for you
        </p>
      </div>

      <TripPlanner />
    </div>
  );
}
