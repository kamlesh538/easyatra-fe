import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'EasyAtra — AI Pilgrim Travel Assistant',
  description:
    'Plan your sacred Hindu pilgrimage with AI. Get personalized itineraries, booking reminders, and real-time queue information for temples across India.',
  keywords: 'pilgrimage, Hindu travel, Char Dham, Ayodhya, Tirupati, Vaishno Devi, yatra planner',
  authors: [{ name: 'EasyAtra' }],
  themeColor: '#FF6B00',
  openGraph: {
    title: 'EasyAtra — AI Pilgrim Travel Assistant',
    description: 'Plan your sacred Hindu pilgrimage with AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/om.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-cream mandala-bg">
        <Navigation />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
