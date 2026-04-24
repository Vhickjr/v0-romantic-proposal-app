'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EntryScreen from '@/components/EntryScreen';
import AcceptanceScreen from '@/components/AcceptanceScreen';
import FloatingHearts from '@/components/FloatingHearts';
import Sparkles from '@/components/Sparkles';
import FloatingPhotos from '@/components/FloatingPhotos';

const BUBBLE_CONFIGS = [
  { left: '8%',  size: 28, delay: 0, duration: 14, color: 'rgba(255,107,138,0.25)' },
  { left: '19%', size: 18, delay: 2, duration: 18, color: 'rgba(255,179,71,0.22)'  },
  { left: '32%', size: 36, delay: 4, duration: 12, color: 'rgba(192,132,252,0.2)'  },
  { left: '48%', size: 22, delay: 1, duration: 16, color: 'rgba(255,155,170,0.25)' },
  { left: '61%', size: 30, delay: 6, duration: 20, color: 'rgba(255,179,71,0.2)'   },
  { left: '74%', size: 16, delay: 3, duration: 15, color: 'rgba(255,107,138,0.2)'  },
  { left: '85%', size: 42, delay: 8, duration: 22, color: 'rgba(52,211,153,0.18)'  },
  { left: '94%', size: 20, delay: 5, duration: 13, color: 'rgba(192,132,252,0.22)' },
];

export default function Home() {
  const [screen, setScreen]       = useState<'entry' | 'accepted'>('entry');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch('/api/state')
      .then((r) => r.json())
      .then((data) => {
        if (data.accepted && data.timestamp) {
          setStartTime(data.timestamp);
          setScreen('accepted');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async () => {
    const ts = Date.now();
    // Optimistic UI — transition immediately, write in background
    setStartTime(ts);
    setScreen('accepted');
    try {
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted: true, timestamp: ts }),
      });
    } catch {
      // non-fatal — state will persist on next successful visit
    }
  };

  return (
    <main className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      {/* ── Liquid morphing blob background ── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE8F4 20%, #FFF5EC 40%, #FFF0FA 60%, #FFF8EC 80%, #FFF0F5 100%)',
        }} />

        {/* Blob 1 — strawberry pink */}
        <div
          className="absolute -top-[10%] -left-[8%] w-[48vw] h-[48vw] opacity-45 blur-[55px]"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #FFBDCA, #FF9FAE)',
            animation: 'blob1-float 13s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
        {/* Blob 2 — peach/mango */}
        <div
          className="absolute -top-[5%] -right-[8%] w-[52vw] h-[52vw] opacity-40 blur-[55px]"
          style={{
            background: 'radial-gradient(circle at 60% 40%, #FFD4A0, #FFBD7A)',
            animation: 'blob2-float 17s ease-in-out 2s infinite',
            willChange: 'transform',
          }}
        />
        {/* Blob 3 — lavender/blueberry */}
        <div
          className="absolute -bottom-[12%] left-[15%] w-[58vw] h-[45vw] opacity-30 blur-[62px]"
          style={{
            background: 'radial-gradient(circle at 50% 60%, #DDD6FE, #C084FC)',
            animation: 'blob3-float 19s ease-in-out 4s infinite',
            willChange: 'transform',
          }}
        />
        {/* Blob 4 — cherry rose */}
        <div
          className="absolute bottom-[8%] -right-[6%] w-[38vw] h-[42vw] opacity-35 blur-[48px]"
          style={{
            background: 'radial-gradient(circle at 40% 50%, #FECDD3, #FDA4AF)',
            animation: 'blob4-float 15s ease-in-out 6s infinite',
            willChange: 'transform',
          }}
        />

        {/* Rising bubbles */}
        {BUBBLE_CONFIGS.map((b, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.65, 0.5, 0.3, 0], scale: [0.8, 1, 1.08, 0.95, 0.8] }}
            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{ left: b.left, width: b.size, height: b.size, background: b.color, backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8)' }}
          />
        ))}
      </div>

      <FloatingHearts count={18} />
      <Sparkles count={28} />
      {screen === 'accepted' && !loading && <FloatingPhotos />}

      {/* ── Loading pulse ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [0.9, 1.1, 0.9] }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ scale: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } }}
            className="text-5xl select-none"
          >
            💖
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main screens ── */}
      {!loading && (
        <AnimatePresence mode="wait">
          {screen === 'entry' ? (
            <EntryScreen key="entry" onAccept={handleAccept} />
          ) : (
            <AcceptanceScreen key="accepted" startTime={startTime!} />
          )}
        </AnimatePresence>
      )}
    </main>
  );
}
