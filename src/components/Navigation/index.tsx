'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MapPin, MessageCircle, Calendar, Clock } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: MapPin },
  { href: '/planner', label: 'Plan Trip', icon: Calendar },
  { href: '/?chat=open', label: 'Chat', icon: MessageCircle },
  { href: '/?queue=open', label: 'Queue Check', icon: Clock },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-sm'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="EasyAtra Home"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              🕉
            </span>
            <div>
              <span className="text-xl font-bold font-poppins text-saffron-600">
                Easy
              </span>
              <span className="text-xl font-bold font-poppins text-deepred-500">
                Atra
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(href.split('?')[0]) && href !== '/';
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-xl font-inter font-medium text-sm
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-saffron-50 text-saffron-600'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-saffron-600'
                    }
                  `}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
            <Link
              href="/planner"
              className="ml-2 px-5 py-2 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl font-semibold font-inter text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Start Planning
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 shadow-lg animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(href.split('?')[0]) && href !== '/';
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-inter font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-saffron-50 text-saffron-600'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-saffron-600'
                    }
                  `}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              );
            })}
            <Link
              href="/planner"
              className="flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl font-semibold font-inter transition-all duration-200"
            >
              <Calendar size={18} />
              Start Planning
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
