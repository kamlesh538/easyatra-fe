'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, IndianRupee, Users, User, Phone, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import { api } from '@/services/api';
import type { TripFormData } from '@/types';
import { PlaceInput } from './PlaceInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

const STEPS = ['Destinations', 'Dates & Budget', 'Your Details'];

interface FormErrors {
  places?: string;
  start_date?: string;
  end_date?: string;
  budget?: string;
  travelers?: string;
  user_name?: string;
  user_phone?: string;
}

function validateStep(step: number, data: TripFormData): FormErrors {
  const errors: FormErrors = {};
  if (step === 0) {
    if (data.places.length === 0) errors.places = 'Please add at least one destination';
  }
  if (step === 1) {
    if (!data.start_date) errors.start_date = 'Start date is required';
    if (!data.end_date) errors.end_date = 'End date is required';
    if (data.start_date && data.end_date && data.start_date >= data.end_date)
      errors.end_date = 'End date must be after start date';
    if (!data.budget || data.budget <= 0) errors.budget = 'Please enter a valid budget';
    if (!data.travelers || data.travelers < 1) errors.travelers = 'At least 1 traveler required';
  }
  if (step === 2) {
    if (!data.user_name.trim()) errors.user_name = 'Your name is required';
    if (!data.user_phone?.trim()) errors.user_phone = 'Phone number is required';
    if (data.user_phone && !/^\+?[\d\s\-]{10,15}$/.test(data.user_phone))
      errors.user_phone = 'Please enter a valid phone number';
  }
  return errors;
}

const today = new Date().toISOString().split('T')[0];

export default function TripPlanner() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<TripFormData>({
    places: [],
    start_date: '',
    end_date: '',
    budget: 0,
    travelers: 1,
    user_name: '',
    user_phone: '',
  });

  const update = (field: keyof TripFormData, value: TripFormData[keyof TripFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNext = () => {
    const errs = validateStep(step, formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    const errs = validateStep(step, formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const trip = await api.createTrip(formData);
      router.push(`/trips/${trip.trip_id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create trip. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm font-inter
                    transition-all duration-300
                    ${i < step ? 'bg-saffron-500 text-white' : i === step ? 'bg-saffron-500 text-white ring-4 ring-saffron-100' : 'bg-gray-100 text-gray-400'}
                  `}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span
                  className={`text-xs font-inter font-medium hidden sm:block ${
                    i <= step ? 'text-saffron-600' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-16 sm:w-28 mx-1 sm:mx-2 transition-all duration-300 ${
                    i < step ? 'bg-saffron-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card elevated>
        {/* Step 0: Destinations */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-1">
                Where do you want to go?
              </h2>
              <p className="text-gray-500 font-inter text-sm">
                Add the sacred destinations you wish to visit
              </p>
            </div>

            <PlaceInput
              places={formData.places}
              onChange={(places) => update('places', places)}
            />
            {errors.places && (
              <p className="text-sm text-red-500 font-inter -mt-2">{errors.places}</p>
            )}

            {formData.places.length > 0 && (
              <div className="bg-saffron-50 rounded-xl p-4 border border-saffron-100">
                <div className="flex items-center gap-2 text-saffron-700 font-inter text-sm">
                  <MapPin size={16} className="text-saffron-500" />
                  <span className="font-semibold">Your journey:</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.places.map((p, i) => (
                    <span key={i} className="text-saffron-600 font-inter text-sm">
                      {p}
                      {i < formData.places.length - 1 && (
                        <span className="mx-1 text-saffron-300">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Dates & Budget */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-1">
                When & How Much?
              </h2>
              <p className="text-gray-500 font-inter text-sm">
                Set your travel dates and budget
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                min={today}
                value={formData.start_date}
                onChange={(e) => update('start_date', e.target.value)}
                error={errors.start_date}
                leftIcon={<Calendar size={16} />}
              />
              <Input
                label="End Date"
                type="date"
                min={formData.start_date || today}
                value={formData.end_date}
                onChange={(e) => update('end_date', e.target.value)}
                error={errors.end_date}
                leftIcon={<Calendar size={16} />}
              />
            </div>

            <Input
              label="Total Budget (₹)"
              type="number"
              min={1000}
              step={500}
              placeholder="e.g. 50000"
              value={formData.budget || ''}
              onChange={(e) => update('budget', Number(e.target.value))}
              error={errors.budget}
              leftIcon={<IndianRupee size={16} />}
              helperText="Per person or total — specify in next step"
            />

            <Input
              label="Number of Travelers"
              type="number"
              min={1}
              max={50}
              placeholder="1"
              value={formData.travelers || ''}
              onChange={(e) => update('travelers', Number(e.target.value))}
              error={errors.travelers}
              leftIcon={<Users size={16} />}
            />

            {formData.start_date && formData.end_date && formData.start_date < formData.end_date && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-inter">
                Trip duration:{' '}
                <strong>
                  {Math.ceil(
                    (new Date(formData.end_date).getTime() -
                      new Date(formData.start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </strong>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-1">
                Almost There!
              </h2>
              <p className="text-gray-500 font-inter text-sm">
                We&apos;ll use these to send you booking reminders
              </p>
            </div>

            <Input
              label="Your Name"
              type="text"
              placeholder="Ram Sharma"
              value={formData.user_name}
              onChange={(e) => update('user_name', e.target.value)}
              error={errors.user_name}
              leftIcon={<User size={16} />}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.user_phone}
              onChange={(e) => update('user_phone', e.target.value)}
              error={errors.user_phone}
              leftIcon={<Phone size={16} />}
              helperText="For booking reminders (not stored without consent)"
            />

            {/* Summary */}
            <div className="bg-cream border border-orange-100 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold font-poppins text-gray-800 text-sm">Trip Summary</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-inter text-gray-600">
                  <MapPin size={14} className="text-saffron-500 flex-shrink-0" />
                  <span>{formData.places.join(' → ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-inter text-gray-600">
                  <Calendar size={14} className="text-saffron-500" />
                  <span>
                    {formData.start_date} to {formData.end_date}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-inter text-gray-600">
                  <IndianRupee size={14} className="text-saffron-500" />
                  <span>₹{formData.budget.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-inter text-gray-600">
                  <Users size={14} className="text-saffron-500" />
                  <span>{formData.travelers} traveler{formData.travelers !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-inter">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-orange-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className={step === 0 ? 'invisible' : ''}
          >
            <ChevronLeft size={18} />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              loading={submitting}
              className="bg-gradient-to-r from-saffron-500 to-deepred-500 hover:from-saffron-600 hover:to-deepred-600 text-white px-8"
            >
              {submitting ? 'Creating...' : 'Create Trip Plan 🙏'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
