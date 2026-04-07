'use client';

import { motion } from 'framer-motion';

interface SparklesProps {
  count: number;
}

export default function Sparkles({ count }: SparklesProps) {
  const sparkles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
          }}
          className="fixed text-white text-lg"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}
