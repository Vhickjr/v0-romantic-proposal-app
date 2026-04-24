'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeValues {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
}

const BOX_STYLES = [
  { gradient: 'linear-gradient(135deg, #FF6B8A, #FF9FAE)', border: 'rgba(255,107,138,0.3)', label: 'Years', emoji: '🍓' },
  { gradient: 'linear-gradient(135deg, #FFB347, #FFD580)', border: 'rgba(255,179,71,0.3)', label: 'Months', emoji: '🍑' },
  { gradient: 'linear-gradient(135deg, #C084FC, #DDD6FE)', border: 'rgba(192,132,252,0.35)', label: 'Days', emoji: '🫐' },
  { gradient: 'linear-gradient(135deg, #FB7185, #FECDD3)', border: 'rgba(251,113,133,0.3)', label: 'Hours', emoji: '🍒' },
  { gradient: 'linear-gradient(135deg, #FF6B8A, #FFB3C6)', border: 'rgba(255,107,138,0.25)', label: 'Minutes', emoji: '🌸' },
  { gradient: 'linear-gradient(135deg, #34D399, #A7F3D0)', border: 'rgba(52,211,153,0.3)', label: 'Seconds', emoji: '💚' },
];

export default function RelationshipTimer({ startTime }: { startTime: number }) {
  const [time, setTime] = useState<TimeValues>({
    years: 0, months: 0, days: 0,
    hours: 0, minutes: 0, seconds: 0,
    totalDays: 0, totalHours: 0,
  });

  useEffect(() => {
    const calc = () => {
      const ms = Date.now() - startTime;
      const totalSecs = Math.floor(ms / 1000);
      const totalMins = Math.floor(totalSecs / 60);
      const totalHrs = Math.floor(totalMins / 60);
      const totalDs = Math.floor(totalHrs / 24);

      const years = Math.floor(totalDs / 365.25);
      let remainder = totalDs - Math.floor(years * 365.25);
      const months = Math.floor(remainder / 30.44);
      remainder = remainder - Math.floor(months * 30.44);

      setTime({
        years,
        months,
        days: Math.floor(remainder),
        hours: totalHrs % 24,
        minutes: totalMins % 60,
        seconds: totalSecs % 60,
        totalDays: totalDs,
        totalHours: totalHrs,
      });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const values = [time.years, time.months, time.days, time.hours, time.minutes, time.seconds];

  return (
    <div className="space-y-5">
      <div
        className="rounded-3xl p-5 md:p-7"
        style={{
          background: 'rgba(255,240,245,0.5)',
          border: '1.5px solid rgba(255,214,224,0.7)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <h3
          className="text-center text-lg font-bold mb-5 font-syne"
          style={{
            background: 'linear-gradient(90deg, #FF6B8A, #FFB347, #C084FC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ✨ Time Together ✨
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
          {BOX_STYLES.map((box, i) => (
            <motion.div
              key={box.label}
              whileHover={{ scale: 1.06, y: -2 }}
              className="rounded-2xl p-4 text-center"
              style={{
                background: box.gradient,
                border: `1.5px solid ${box.border}`,
                boxShadow: `0 6px 24px ${box.border}`,
              }}
            >
              <motion.div
                key={values[i]}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl md:text-4xl font-extrabold text-white drop-shadow font-syne"
              >
                {values[i].toString().padStart(2, '0')}
              </motion.div>
              <p className="text-white/80 text-xs mt-1.5 uppercase tracking-widest font-inter font-medium">
                {box.emoji} {box.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Totals row */}
        <div className="grid grid-cols-2 gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,214,224,0.5)' }}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="rounded-xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,138,0.15), rgba(255,179,71,0.15))',
              border: '1.5px solid rgba(255,107,138,0.25)',
            }}
          >
            <p className="text-xs uppercase tracking-widest font-inter font-medium" style={{ color: '#9C6080' }}>
              🍓 Total Days
            </p>
            <p className="text-2xl md:text-3xl font-extrabold mt-1 font-syne" style={{ color: '#FF6B8A' }}>
              {time.totalDays}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04 }}
            className="rounded-xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(192,132,252,0.15), rgba(251,113,133,0.15))',
              border: '1.5px solid rgba(192,132,252,0.25)',
            }}
          >
            <p className="text-xs uppercase tracking-widest font-inter font-medium" style={{ color: '#9C6080' }}>
              💫 Total Hours
            </p>
            <p className="text-2xl md:text-3xl font-extrabold mt-1 font-syne" style={{ color: '#C084FC' }}>
              {time.totalHours}
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-center text-sm md:text-base italic font-inter"
        style={{ color: '#C084A0' }}
      >
        Every second with you is a gift 💝
      </motion.div>
    </div>
  );
}
