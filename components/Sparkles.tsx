'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SparklesProps {
  count: number;
}

const SPARKLE_TYPES = ['✨', '🌟', '💫', '⭐', '✦', '🔆', '🌸', '💥'];

export default function Sparkles({ count }: SparklesProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const sparkles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: (i / count) * 98 + 1,
        top: ((i * 37) % 94) + 3,
        delay: (i * 0.31) % 3,
        duration: 1.8 + (i % 5) * 0.4,
        size: 12 + (i % 4) * 5,
        emoji: SPARKLE_TYPES[i % SPARKLE_TYPES.length],
        rotateTo: i % 2 === 0 ? 180 : -180,
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 20 }}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0.6, 0],
            scale: [0, 1.1, 0.9, 0],
            rotate: [0, s.rotateTo],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'fixed',
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: s.size,
            willChange: 'transform, opacity',
          }}
        >
          {s.emoji}
        </motion.div>
      ))}
    </div>
  );
}
