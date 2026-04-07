'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw } from 'lucide-react';
import Confetti from './Confetti';
import RelationshipTimer from './RelationshipTimer';

const quotes = [
  "Still the best YES ever recorded.",
  "Relationship status: deployed and stable.",
  "Running on love and premium vibes.",
  "No bugs detected, only feelings.",
  "Forever.commit() ✨",
  "Error 404: Reasons to leave not found ❤️",
  "Loading love... 100% complete!",
  "This connection is certified premium.",
  "Buffering: Never. Love: Always.",
  "You've unlocked the ultimate achievement! 🏆",
  "Plot twist: This is just the beginning.",
  "Status: Happily ever after IN PROGRESS",
];

export default function AcceptanceScreen() {
  const [quote, setQuote] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // Stop confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    localStorage.removeItem('bemygirlfriend_accepted');
    localStorage.removeItem('bemygirlfriend_timestamp');
    window.location.reload();
  };

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12"
    >
      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Main glass card */}
      <motion.div
        variants={itemVariants}
        className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
      >
        {/* Animated glow background */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 40px rgba(220, 38, 38, 0.5)',
              '0 0 80px rgba(244, 63, 94, 0.8)',
              '0 0 40px rgba(220, 38, 38, 0.5)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-3xl"
        />

        <div className="relative z-10 space-y-8">
          {/* Success message with animated hearts */}
          <motion.div
            variants={itemVariants}
            className="space-y-4 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl md:text-8xl font-bold"
            >
              <span className="bg-gradient-to-r from-red-200 via-rose-200 to-pink-200 bg-clip-text text-transparent">
                ✓ Accepted
              </span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-red-100 font-light"
            >
              This is now officially the best decision ever made. 💌
            </motion.p>

            {/* Quote */}
            <motion.div
              variants={itemVariants}
              className="pt-4"
            >
              <p className="text-lg text-rose-200 italic font-light">
                "{quote}"
              </p>
            </motion.div>
          </motion.div>

          {/* Relationship Timer */}
          <motion.div variants={itemVariants}>
            <RelationshipTimer />
          </motion.div>

          {/* Floating hearts animation */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-3 pt-4"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              >
                <Heart className="w-8 h-8 text-red-300 fill-red-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Reset button */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center pt-6"
          >
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Reset (Just kidding, don&apos;t click this 😂)
            </motion.button>
          </motion.div>

          {/* Decorative text */}
          <motion.p
            variants={itemVariants}
            className="text-center text-red-200/70 text-sm pt-6"
          >
            Forever starts now. Love you! 💕
          </motion.p>
        </div>
      </motion.div>

      {/* Floating sparkles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.cos((i / 5) * Math.PI * 2) * 120,
            y: Math.sin((i / 5) * Math.PI * 2) * 120,
          }}
          transition={{
            duration: 4,
            delay: i * 0.4,
            repeat: Infinity,
          }}
          className="absolute text-3xl"
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          ✨
        </motion.div>
      ))}
    </motion.div>
  );
}
