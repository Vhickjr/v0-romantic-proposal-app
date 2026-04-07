'use client';

import { motion } from 'framer-motion';

interface FloatingHeartsProps {
  count: number;
}

export default function FloatingHearts({ count }: FloatingHeartsProps) {
  const hearts = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 20 + Math.random() * 10,
    size: Math.random() * 30 + 20,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            opacity: 0,
            y: typeof window !== 'undefined' ? window.innerHeight : 100,
            x: `${heart.left}%`,
          }}
          animate={{
            opacity: [0, heart.opacity, 0],
            y: -100,
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="fixed text-red-400"
          style={{
            fontSize: `${heart.size}px`,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}
