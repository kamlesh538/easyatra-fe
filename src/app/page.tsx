'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Calendar,
  Clock,
  Bell,
  MapPin,
  Navigation,
  ChevronRight,
  Star,
} from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import QueueChecker from '@/components/QueueChecker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'AI Chat Assistant',
    description: 'Chat with our AI to plan your pilgrimage. Just tell it where you want to go.',
    color: 'bg-blue-50 text-blue-600',
    action: 'chat',
  },
  {
    icon: Calendar,
    title: 'Trip Planner',
    description: 'Get a detailed day-by-day itinerary with hotels, travel, and activities.',
    color: 'bg-saffron-50 text-saffron-600',
    action: 'plan',
  },
  {
    icon: Navigation,
    title: 'Itinerary View',
    description: 'See your complete journey with travel options and cost estimates.',
    color: 'bg-green-50 text-green-600',
    action: 'plan',
  },
  {
    icon: Bell,
    title: 'Booking Alerts',
    description: 'Never miss a booking window. We track and alert you at the right time.',
    color: 'bg-purple-50 text-purple-600',
    action: 'plan',
  },
  {
    icon: Clock,
    title: 'Queue Checker',
    description: 'Check live queue times at temples before you visit. Plan smarter.',
    color: 'bg-orange-50 text-orange-600',
    action: 'queue',
  },
];

const DESTINATIONS = [
  { name: 'Ayodhya', emoji: '🏛️', desc: 'Ram Mandir & Ghats', popular: true },
  { name: 'Tirupati', emoji: '🛕', desc: 'Balaji Temple', popular: true },
  { name: 'Vaishno Devi', emoji: '🏔️', desc: 'Trikuta Mountains', popular: true },
  { name: 'Kedarnath', emoji: '⛰️', desc: 'Char Dham', popular: true },
  { name: 'Kashi (Varanasi)', emoji: '🕯️', desc: 'Kashi Vishwanath', popular: true },
  { name: 'Puri', emoji: '🌊', desc: 'Jagannath Dham', popular: false },
  { name: 'Dwarka', emoji: '🔱', desc: 'Char Dham', popular: false },
  { name: 'Shirdi', emoji: '✨', desc: 'Sai Baba Mandir', popular: false },
];

const TESTIMONIALS = [
  {
    name: 'Ramesh Gupta',
    location: 'Delhi',
    text: 'EasyAtra made our Char Dham Yatra so smooth! All bookings, queue times — everything in one place.',
    rating: 5,
  },
  {
    name: 'Sunita Devi',
    location: 'Mumbai',
    text: 'The AI understood exactly what I wanted. Planned Vaishno Devi trip for 4 people in minutes!',
    rating: 5,
  },
  {
    name: 'Ankit Sharma',
    location: 'Jaipur',
    text: 'Queue checker at Tirupati was a lifesaver. Went early morning as suggested — no waiting!',
    rating: 5,
  },
];

export default function HomePage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState<string | undefined>();

  useEffect(() => {
    // Handle URL params for opening panels
    const params = new URLSearchParams(window.location.search);
    if (params.get('chat') === 'open') setChatOpen(true);
    if (params.get('queue') === 'open') setQueueOpen(true);
  }, []);

  const handleDestinationChat = (dest: string) => {
    setChatMessage(`I want to plan a trip to ${dest}`);
    setChatOpen(true);
  };

  const handleFeatureAction = (action: string) => {
    if (action === 'chat') setChatOpen(true);
    else if (action === 'queue') setQueueOpen(true);
  };

  return (
    <>
      {/* Chat Modal */}
      {chatOpen && (
        <ChatInterface
          onClose={() => {
            setChatOpen(false);
            setChatMessage(undefined);
          }}
          initialMessage={chatMessage}
        />
      )}

      {/* Queue Checker Modal */}
      {queueOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setQueueOpen(false)}
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-poppins text-gray-800">
                <Clock size={22} className="inline text-saffron-500 mr-2" />
                Queue Time Checker
              </h2>
              <button
                onClick={() => setQueueOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <QueueChecker compact />
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-saffron-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-100 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left - Text content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-saffron-50 border border-saffron-200 rounded-full text-saffron-700 text-sm font-semibold font-inter mb-6">
                <span>🕉</span>
                AI-Powered Pilgrim Travel Assistant
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins text-gray-800 leading-tight mb-6">
                Plan Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-deepred-500">
                  Sacred Journey
                </span>{' '}
                with AI
              </h1>

              <p className="text-lg text-gray-600 font-inter mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                From Char Dham to Tirupati — EasyAtra plans your entire Hindu pilgrimage.
                Itineraries, travel, hotels, queue times, and booking reminders, all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => setChatOpen(true)}
                  className="bg-gradient-to-r from-saffron-500 to-deepred-500 hover:from-saffron-600 hover:to-deepred-600 text-white shadow-xl"
                >
                  <MessageCircle size={20} />
                  Chat with AI 🙏
                </Button>
                <Link href="/planner">
                  <Button size="lg" variant="outline">
                    <Calendar size={20} />
                    Plan My Trip
                    <ChevronRight size={18} />
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['🧑', '👩', '👨', '🧕', '🧓'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-saffron-100 border-2 border-white flex items-center justify-center text-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-inter">Trusted by 10,000+ pilgrims</p>
                </div>
              </div>
            </div>

            {/* Right - OM Symbol */}
            <div className="flex-shrink-0 hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-saffron-100 to-red-100 flex items-center justify-center shadow-2xl">
                  <span className="text-[140px] om-pulse select-none">🕉</span>
                </div>
                {/* Orbit elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-bounce">
                  🛕
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-pulse">
                  🏔️
                </div>
                <div className="absolute top-1/2 -right-8 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl">
                  🌊
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-800 mb-3">
              Everything for Your Yatra
            </h2>
            <p className="text-gray-500 font-inter max-w-xl mx-auto">
              Five powerful features built specifically for Hindu pilgrims
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              const isLink = feature.action === 'plan';
              const content = (
                <Card
                  className="h-full hover:scale-105 transition-transform duration-200 cursor-pointer group"
                  elevated={false}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold font-poppins text-gray-800 text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 font-inter text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );

              if (isLink) {
                return (
                  <Link key={feature.title} href="/planner">
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  key={feature.title}
                  onClick={() => handleFeatureAction(feature.action)}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESTINATIONS SECTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-800 mb-3">
              Popular Pilgrim Destinations
            </h2>
            <p className="text-gray-500 font-inter">
              Click any destination to start planning with AI
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                onClick={() => handleDestinationChat(dest.name)}
                className="group relative bg-white rounded-2xl p-4 shadow-md hover:shadow-xl border border-orange-100 hover:border-saffron-300 transition-all duration-300 hover:scale-105 text-left"
              >
                {dest.popular && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-saffron-500 text-white text-[10px] font-bold rounded-full font-inter">
                    POPULAR
                  </span>
                )}
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {dest.emoji}
                </div>
                <h3 className="font-bold font-poppins text-gray-800 text-sm mb-0.5">
                  {dest.name}
                </h3>
                <p className="text-xs text-gray-500 font-inter">{dest.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-saffron-500 font-semibold font-inter opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <MessageCircle size={12} />
                  Plan with AI
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-poppins text-gray-800 mb-3">
              Pilgrim Stories
            </h2>
            <p className="text-gray-500 font-inter">Real experiences from EasyAtra travelers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 font-inter text-sm leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center text-sm">
                    🙏
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 font-inter">{t.name}</p>
                    <p className="text-xs text-gray-400 font-inter flex items-center gap-1">
                      <MapPin size={10} /> {t.location}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-saffron-500 to-deepred-500 rounded-3xl p-10 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-7xl">🕉</div>
              <div className="absolute bottom-4 right-4 text-7xl rotate-12">🕉</div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold font-poppins mb-4">
                Begin Your Sacred Journey
              </h2>
              <p className="text-white/80 font-inter mb-8 text-lg">
                Let our AI plan your perfect pilgrimage. Jai Shri Ram! 🙏
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setChatOpen(true)}
                  className="px-8 py-3.5 bg-white text-saffron-600 rounded-xl font-bold font-inter shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Chat with AI
                </button>
                <Link
                  href="/planner"
                  className="px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold font-inter transition-all duration-200 border border-white/30 flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  Plan a Trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white/80 border-t border-orange-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🕉</span>
            <span className="text-xl font-bold font-poppins">
              <span className="text-saffron-600">Easy</span>
              <span className="text-deepred-500">Atra</span>
            </span>
          </div>
          <p className="text-gray-500 font-inter text-sm">
            AI-powered Hindu pilgrimage planning. Made with 🙏 for devotees across India.
          </p>
          <p className="text-gray-400 font-inter text-xs mt-2">
            © 2026 EasyAtra. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
