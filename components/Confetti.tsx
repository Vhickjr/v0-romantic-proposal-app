'use client';

import { motion } from 'framer-motion';

const Confetti = () => {
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    rotation: Math.random() * 360,
    char: ['🎉', '💘', '✨', '💕', '🌹', '💌', '🎊'][
      Math.floor(Math.random() * 7)
    ],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            opacity: 1,
            y: -20,
            x: `${piece.left}%`,
            rotate: 0,
          }}
          animate={{
            opacity: 0,
            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 100,
            rotate: piece.rotation,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="fixed text-3xl md:text-4xl"
        >
          {piece.char}
        </motion.div>
      ))}
    </div>
  );
};

export default Confetti;
