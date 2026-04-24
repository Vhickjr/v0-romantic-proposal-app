'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CHARS = ['🎉', '💘', '✨', '💕', '🌸', '💌', '🎊', '🍓', '🫐', '🍑', '🍒', '🩷', '💖', '🌺', '⭐'];

const Confetti = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pieces = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: (i / 50) * 100,
        delay: (i * 0.048) % 0.8,
        duration: 2.2 + (i % 6) * 0.3,
        rotation: 120 + (i % 5) * 72,
        size: 22 + (i % 4) * 6,
        char: CHARS[i % CHARS.length],
      })),
    []
  );

  if (!mounted) return null;

  const height = window.innerHeight;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 1, y: -30, x: `${piece.left}%`, rotate: 0, scale: 1 }}
          animate={{ opacity: 0, y: height + 30, rotate: piece.rotation, scale: 0.7 }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
          style={{ position: 'fixed', fontSize: piece.size }}
        >
          {piece.char}
        </motion.div>
      ))}
    </div>
  );
};

export default Confetti;
