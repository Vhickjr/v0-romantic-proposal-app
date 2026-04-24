'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingHeartsProps {
  count: number;
}

const ITEMS = ['❤️', '🩷', '💖', '💗', '🍓', '🍑', '🍒', '🫐', '🌸', '🌺', '💕', '🍇'];

export default function FloatingHearts({ count }: FloatingHeartsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: 5 + (i / count) * 90,
        delay: (i * 1.7) % 22,
        duration: 16 + (i % 7) * 2,
        size: 18 + (i % 5) * 8,
        opacity: 0.35 + (i % 4) * 0.12,
        emoji: ITEMS[i % ITEMS.length],
        rotate: (i % 2 === 0) ? [-8, 8] : [6, -6],
        rotateDur: 3 + (i % 4),
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 20 }}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            opacity: 0,
            y: window.innerHeight + 40,
            x: `${item.left}%`,
            rotate: 0,
          }}
          animate={{
            opacity: [0, item.opacity, item.opacity * 0.8, 0],
            y: -80,
            rotate: item.rotate,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
            rotate: {
              duration: item.rotateDur,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatType: 'reverse',
            },
          }}
          style={{ fontSize: item.size, position: 'fixed' }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
