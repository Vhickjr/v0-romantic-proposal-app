'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const humourousMessages = [
  "This option is not available in your region 😂",
  "Nice try! System rejected that choice.",
  "Nope nope nope! 🚫",
  "That button doesn't exist. Try again! 😉",
  "Bzzt! Invalid option. 🔴",
  "Absolutely not happening! 💪",
  "Denied by the love portal! 💔",
  "This choice will self-destruct! 💣",
  "Plot twist: there is no 'no' option! 📖",
  "LOL, good one! Not happening! 😄",
];

export default function NoButton() {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isHovering) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const dx = centerX - mouseX;
    const dy = centerY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Move button away from mouse if within 150px
    if (distance < 150) {
      const angle = Math.atan2(dy, dx);
      const speed = (150 - distance) / 150 * 50;

      const newX = Math.cos(angle) * speed;
      const newY = Math.sin(angle) * speed;

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    const randomMessage =
      humourousMessages[Math.floor(Math.random() * humourousMessages.length)];
    setMessage(randomMessage);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition({ x: 0, y: 0 });
    setShowMessage(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsHovering(false);
    setPosition({ x: 0, y: 0 });

    // Random shake
    setPosition({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
    });

    setTimeout(() => {
      setPosition({ x: 0, y: 0 });
    }, 300);
  };

  return (
    <div className="relative flex-1">
      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 10,
          mass: 0.5,
        }}
        whileTap={{
          scale: 0.95,
        }}
        className="w-full px-8 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-full hover:border-white/40 transition-all duration-300 hover:bg-white/20"
      >
        No, never 😂
      </motion.button>

      {/* Humorous message popup */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: -50 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-red-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
        >
          {message}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-red-600/90" />
        </motion.div>
      )}
    </div>
  );
}
