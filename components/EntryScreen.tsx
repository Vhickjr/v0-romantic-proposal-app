'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import NoButton from './NoButton';

interface EntryScreenProps {
  onAccept: () => void;
}

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
  { emoji: '🍓', top: '-6%', left: '8%', delay: 0, dur: 4 },
  { emoji: '💖', top: '8%', right: '2%', delay: 0.5, dur: 5 },
  { emoji: '🍑', bottom: '18%', left: '1%', delay: 1, dur: 4.5 },
  { emoji: '✨', top: '-2%', right: '22%', delay: 1.5, dur: 3.5 },
  { emoji: '🍒', bottom: '-2%', right: '14%', delay: 0.8, dur: 5 },
  { emoji: '🩷', top: '48%', right: '1%', delay: 0.3, dur: 4 },
  { emoji: '🌸', bottom: '28%', right: '1%', delay: 1.2, dur: 6 },
  { emoji: '🫐', top: '22%', left: '1%', delay: 0.7, dur: 5.5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function EntryScreen({ onAccept }: EntryScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.toLowerCase() === 'joan') {
      onAccept();
    } else if (name.length === 0) {
      setError('Enter a name to unlock this love portal... 💌');
    } else {
      setError(`Access denied. This love portal is strictly reserved for someone special. Nice try, ${name}. 😂`);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 w-full max-w-2xl mx-auto px-3 sm:px-6 py-8"
    >
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

            {/* Heading */}
            <motion.div variants={itemVariants} className="space-y-3">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="font-syne text-5xl md:text-6xl font-extrabold leading-tight"
              >
                <span
                  style={{
                    background: 'linear-gradient(90deg, #FF6B8A 0%, #FFB347 30%, #C084FC 60%, #FF9FAE 80%, #FF6B8A 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer-text 4s linear infinite',
                    display: 'inline-block',
                  }}
                >
                  Will you be my
                </span>
                <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #FF4D6D, #FF6B8A, #FF9FAE)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  girlfriend?
                </span>
              </motion.div>

              <p className="text-lg md:text-xl font-inter font-light" style={{ color: '#9C6080' }}>
                Only one person can unlock this... 💌
              </p>
            </motion.div>

            {/* Form */}
            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <motion.div
                  animate={focused ? {
                    boxShadow: ['0 0 0 2px rgba(255,107,138,0.4)', '0 0 0 4px rgba(255,107,138,0.15)', '0 0 0 2px rgba(255,107,138,0.4)'],
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="rounded-xl overflow-hidden"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={handleInputChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Enter a name..."
                    className="w-full px-6 py-4 text-lg rounded-xl border-2 transition-all duration-300 focus:outline-none font-inter"
                    style={{
                      background: 'rgba(255,240,245,0.8)',
                      borderColor: focused ? '#FF6B8A' : '#FFD6E0',
                      color: '#4A1942',
                      boxShadow: focused ? '0 0 0 4px rgba(255,107,138,0.12)' : 'none',
                    }}
                  />
                </motion.div>
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl select-none pointer-events-none"
                  style={{ opacity: focused ? 1 : 0.4, transition: 'opacity 0.3s' }}
                >
                  🔑
                </span>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium px-2 font-inter"
                  style={{ color: '#FF4D6D' }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-4">
                {/* Yes button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 px-8 py-4 text-white font-bold text-lg rounded-full font-syne"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B8A 0%, #FF9FAE 50%, #FFB347 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-border 3s ease infinite',
                    boxShadow: '0 8px 32px rgba(255,107,138,0.45)',
                  }}
                >
                  Yes, obviously 💘
                </motion.button>

                <NoButton />
              </motion.div>
            </motion.form>

            {/* Decorative hearts row */}
            <motion.div variants={itemVariants} className="flex justify-center gap-3 pt-2">
              {['❤️', '🩷', '🍓', '💖', '🌸'].map((emoji, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.2, delay: i * 0.18, repeat: Infinity }}
                  className="text-xl select-none"
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
