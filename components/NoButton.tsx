'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const humourousMessages = [
  "This option is not available in your region 😂",
  "Nice try! System rejected that choice.",
  "Nope nope nope! 🚫",
  "That button doesn't exist. Try again! 😉",
  "Bzzt! Invalid option 🍓",
  "Absolutely not happening! 💪",
  "Denied by the love portal! 💔",
  "This choice will self-destruct! 💣",
  "Plot twist: there is no 'no' option! 📖",
  "LOL, good one! Not happening! 😄",
];

const noButtonTexts = [
  'No, never 😂',
  'Nope 🙈',
  'Still no 😅',
  'Try "Yes" instead 💘',
  'Nice try 😏',
];

export default function NoButton() {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [buttonText, setButtonText] = useState(noButtonTexts[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;
    const button = buttonRef.current;
    const container = containerRef.current;
    if (!button || !container) return;

    const buttonRect = button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 170) {
      const push = ((170 - distance) / 170) * 90;
      const safe = distance || 1;
      const moveX = -(dx / safe) * push;
      const moveY = -(dy / safe) * push;

      setPosition((prev) => {
        const maxX = Math.max((containerRect.width - buttonRect.width) / 2, 20);
        const maxY = 45;
        return {
          x: Math.max(-maxX, Math.min(maxX, prev.x + moveX)),
          y: Math.max(-maxY, Math.min(maxY, prev.y + moveY)),
        };
      });
    }
  };

  const showToast = () => {
    setButtonText(pickRandom(noButtonTexts));
    setMessage(pickRandom(humourousMessages));
    setShowMessage(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowMessage(false), 3000);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    showToast();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition({ x: 0, y: 0 });
    setShowMessage(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    showToast();
    setIsHovering(false);
    setPosition({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
    });
    setTimeout(() => setPosition({ x: 0, y: 0 }), 300);
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative flex-1">
      <motion.button
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 400, damping: 10, mass: 0.5 }}
        whileTap={{ scale: 0.95 }}
        className="w-full px-8 py-4 font-bold text-lg rounded-full border-2 transition-all duration-300 font-syne"
        style={{
          background: 'rgba(255,240,245,0.6)',
          borderColor: '#FFD6E0',
          color: '#9C6080',
        }}
      >
        {buttonText}
      </motion.button>

      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div
            className="rounded-3xl px-8 py-12 md:px-16 md:py-16 flex items-center justify-center w-[90vw] max-w-2xl mx-auto min-h-[180px] text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,138,0.96), rgba(255,179,71,0.96))',
              border: '3px solid rgba(255,255,255,0.5)',
              boxShadow: '0 24px 80px rgba(255,107,138,0.5)',
            }}
          >
            <span className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight font-syne">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
