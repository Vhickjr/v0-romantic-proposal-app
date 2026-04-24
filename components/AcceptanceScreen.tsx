'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const resetJokes = [
  'Reset? Please send Victor a mail first 😂',
  'Oops! Only Victor can reset. Try calling him maybe? 😜',
  'Resetting is a premium feature. Contact Victor! 😆',
  'No reset for you! Ask Victor nicely. 😁',
  "Reset? That's above your pay grade! 😂",
  'Try again after sending Victor a pizza! 🍕😂',
];

interface DecorItem {
  emoji: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: number;
  dur: number;
}

const DECOR: DecorItem[] = [
  { emoji: '🍓', top: '-5%', left: '10%', delay: 0, dur: 4 },
  { emoji: '💖', top: '6%', right: '4%', delay: 0.4, dur: 5 },
  { emoji: '🍑', bottom: '20%', left: '1%', delay: 0.9, dur: 4.5 },
  { emoji: '🎊', top: '-3%', right: '25%', delay: 1.4, dur: 3.8 },
  { emoji: '🍒', bottom: '-3%', right: '16%', delay: 0.7, dur: 5 },
  { emoji: '🩷', top: '50%', right: '1%', delay: 0.2, dur: 4 },
  { emoji: '🌺', bottom: '30%', right: '1%', delay: 1.1, dur: 6 },
  { emoji: '🫐', top: '24%', left: '1%', delay: 0.6, dur: 5.5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function AcceptanceScreen({ startTime }: { startTime: number }) {
  const [quote, setQuote] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showJoke, setShowJoke] = useState(false);
  const [joke, setJoke] = useState('');

  useEffect(() => {
    setMounted(true);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleFakeReset = () => {
    setJoke(resetJokes[Math.floor(Math.random() * resetJokes.length)]);
    setShowJoke(true);
    setTimeout(() => setShowJoke(false), 2800);
  };

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full max-w-2xl mx-auto px-3 sm:px-6 py-8"
    >
      {showConfetti && <Confetti />}

      {/* Decorative floating emojis */}
      {DECOR.map((d, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -14, 0], rotate: [0, 8, -6, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute text-2xl select-none pointer-events-none"
          style={{ top: d.top, bottom: d.bottom, left: d.left, right: d.right }}
        >
          {d.emoji}
        </motion.div>
      ))}

      {/* Animated gradient border → card */}
      <motion.div
        variants={itemVariants}
        className="p-[2px] rounded-[2rem]"
        style={{
          background: 'linear-gradient(135deg, #FF6B8A, #FFD6E0, #FFB347, #DDD6FE, #FF9FAE, #FF6B8A)',
          backgroundSize: '400% 400%',
          animation: 'gradient-border 5s ease infinite',
          boxShadow: '0 24px 80px rgba(255,107,138,0.2), 0 8px 32px rgba(255,179,71,0.12)',
        }}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-[calc(2rem-2px)] p-8 md:p-12">
          <div className="space-y-8">

            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-4">
              {/* Pulsing heart cluster */}
              <motion.div
                className="flex justify-center gap-2"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {['💖', '❤️', '💖'].map((e, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity }}
                    className="text-3xl"
                  >
                    {e}
                  </motion.span>
                ))}
              </motion.div>

              <div className="font-syne text-4xl md:text-5xl font-extrabold leading-tight">
                <span
                  style={{
                    background: 'linear-gradient(90deg, #FF4D6D 0%, #FF6B8A 30%, #FFB347 60%, #C084FC 80%, #FF6B8A 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer-text 3.5s linear infinite',
                    display: 'inline-block',
                  }}
                >
                  Joan said YES! 💕
                </span>
              </div>

              <p className="text-base md:text-lg font-inter font-light" style={{ color: '#9C6080' }}>
                The best decision Joan ever made. 💌
              </p>

              {/* Joan & Victor badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mx-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,107,138,0.12), rgba(255,179,71,0.12))',
                  border: '1.5px solid rgba(255,107,138,0.25)',
                }}
              >
                <span className="font-syne font-bold text-sm" style={{ color: '#FF6B8A' }}>Joan</span>
                <span className="text-base">💖</span>
                <span className="font-syne font-bold text-sm" style={{ color: '#FFB347' }}>Victor</span>
                <span className="text-base">✨</span>
                <span className="font-inter text-xs font-medium" style={{ color: '#C084A0' }}>Forever</span>
              </motion.div>

              {/* Quote */}
              <motion.div
                variants={itemVariants}
                className="rounded-2xl px-6 py-4 border"
                style={{ background: 'rgba(255,240,245,0.6)', borderColor: '#FFD6E0' }}
              >
                <p className="text-sm md:text-base italic font-inter font-light" style={{ color: '#9C6080' }}>
                  &ldquo;{quote}&rdquo;
                </p>
              </motion.div>
            </motion.div>

            {/* Relationship Timer */}
            <motion.div variants={itemVariants}>
              <RelationshipTimer startTime={startTime} />
            </motion.div>

            {/* Emoji row */}
            <motion.div variants={itemVariants} className="flex justify-center gap-3">
              {['🍓', '💖', '🍑', '🩷', '🍒', '💗', '🫐'].map((emoji, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -14, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, delay: i * 0.15, repeat: Infinity }}
                  className="text-xl select-none"
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>

            {/* Fake reset */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <motion.button
                onClick={handleFakeReset}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-6 py-3 rounded-full font-inter text-sm font-medium border-2 transition-all duration-300"
                style={{
                  background: 'rgba(255,240,245,0.5)',
                  borderColor: '#FFD6E0',
                  color: '#9C6080',
                }}
              >
                Reset (Just kidding, don&apos;t click this 😂)
              </motion.button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-center text-sm font-inter"
              style={{ color: '#C084A0' }}
            >
              Forever starts now, Joan. Love you! 💕
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Joke popup */}
      {showJoke && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="rounded-3xl px-8 py-12 text-2xl md:text-4xl font-extrabold text-center max-w-2xl mx-4 font-syne"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,138,0.95), rgba(255,179,71,0.95))',
              border: '3px solid rgba(255,255,255,0.5)',
              boxShadow: '0 24px 80px rgba(255,107,138,0.5)',
              color: '#fff',
            }}
          >
            {joke}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
