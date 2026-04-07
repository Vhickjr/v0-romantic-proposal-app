'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import NoButton from './NoButton';

interface EntryScreenProps {
  onAccept: () => void;
}

export default function EntryScreen({ onAccept }: EntryScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setName(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.toLowerCase() === 'joan') {
      setError('');
      onAccept();
    } else if (name.length === 0) {
      setError('Enter a name to unlock this love portal... 💌');
    } else {
      setError(
        `Access denied. This love portal is strictly reserved for Joan. Nice try, ${name}. 😂`
      );
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12"
    >
      {/* Glass card container */}
      <motion.div
        variants={itemVariants}
        className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        {/* Decorative glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/20 via-transparent to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 space-y-8">
          {/* Main heading */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl md:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-red-200 via-rose-200 to-pink-200 bg-clip-text text-transparent">
                Will you be my
              </span>
              <br />
              <span className="text-white drop-shadow-lg">girlfriend?</span>
            </motion.div>
            <p className="text-xl md:text-2xl text-red-100 font-light">
              Only one person can unlock this... 💌
            </p>
          </motion.div>

          {/* Input form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={handleInputChange}
                placeholder="Enter a name..."
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-100/50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 text-lg"
              />
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(220, 38, 38, 0)',
                    '0 0 0 15px rgba(220, 38, 38, 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-xl pointer-events-none"
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-200 text-sm font-medium px-2"
              >
                {error}
              </motion.p>
            )}

            {/* Buttons container */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              {/* Yes button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform"
              >
                Yes, obviously 💘
              </motion.button>

              {/* No button */}
              <NoButton />
            </motion.div>
          </motion.form>

          {/* Decorative hearts */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-2 pt-4"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              >
                <Heart className="w-6 h-6 text-red-300 fill-red-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating sparkles around the card */}
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
            x: Math.cos((i / 5) * Math.PI * 2) * 100,
            y: Math.sin((i / 5) * Math.PI * 2) * 100,
          }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
          }}
          className="absolute text-2xl"
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
