'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import EntryScreen from '@/components/EntryScreen';
import AcceptanceScreen from '@/components/AcceptanceScreen';
import FloatingHearts from '@/components/FloatingHearts';
import Sparkles from '@/components/Sparkles';

export default function Home() {
  const [screen, setScreen] = useState<'entry' | 'accepted'>('entry');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const accepted = localStorage.getItem('bemygirlfriend_accepted');
    if (accepted === 'true') {
      setScreen('accepted');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bemygirlfriend_accepted', 'true');
    localStorage.setItem('bemygirlfriend_timestamp', Date.now().toString());
    setScreen('accepted');
  };

  if (!mounted) return null;

  return (
    <main className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background gradient layers */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-900 to-rose-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Floating hearts background */}
      <FloatingHearts count={15} />

      {/* Sparkles */}
      <Sparkles count={30} />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {screen === 'entry' ? (
          <EntryScreen key="entry" onAccept={handleAccept} />
        ) : (
          <AcceptanceScreen key="accepted" />
        )}
      </AnimatePresence>
    </main>
  );
}
