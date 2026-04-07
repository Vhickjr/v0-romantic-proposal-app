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

export default function RelationshipTimer() {
  const [time, setTime] = useState<TimeValues>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    totalHours: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const timestampStr = localStorage.getItem('bemygirlfriend_timestamp');
      if (!timestampStr) return;

      const startTime = new Date(parseInt(timestampStr));
      const now = new Date();

      // Calculate total milliseconds
      const totalMs = now.getTime() - startTime.getTime();

      // Calculate components
      const totalSeconds = Math.floor(totalMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      const seconds = totalSeconds % 60;
      const minutes = totalMinutes % 60;
      const hours = totalHours % 24;

      // More accurate calculation for years and months
      let years = 0;
      let months = 0;
      let days = totalDays;

      // Calculate years
      years = Math.floor(totalDays / 365.25);
      days = totalDays - Math.floor(years * 365.25);

      // Calculate months
      months = Math.floor(days / 30.44);
      days = days - Math.floor(months * 30.44);

      setTime({
        years,
        months,
        days: Math.floor(days),
        hours,
        minutes,
        seconds,
        totalDays,
        totalHours,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimerBox = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <motion.div
      key={label}
      whileHover={{ scale: 1.05 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:bg-white/20 transition-all duration-300"
    >
      <motion.div
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl md:text-4xl font-bold text-red-200"
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <p className="text-red-100/70 text-xs md:text-sm mt-2 uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Main timer grid */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
        <h3 className="text-center text-xl font-bold text-white mb-6">
          Time Together ✨
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          <TimerBox value={time.years} label="Years" />
          <TimerBox value={time.months} label="Months" />
          <TimerBox value={Math.floor(time.days)} label="Days" />
          <TimerBox value={time.hours} label="Hours" />
          <TimerBox value={time.minutes} label="Minutes" />
          <TimerBox value={time.seconds} label="Seconds" />
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-white/10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-400/30 rounded-xl p-4 text-center"
          >
            <p className="text-red-100/70 text-xs md:text-sm uppercase tracking-wider">
              Total Days
            </p>
            <p className="text-2xl md:text-3xl font-bold text-red-200 mt-2">
              {time.totalDays}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-400/30 rounded-xl p-4 text-center"
          >
            <p className="text-red-100/70 text-xs md:text-sm uppercase tracking-wider">
              Total Hours
            </p>
            <p className="text-2xl md:text-3xl font-bold text-rose-200 mt-2">
              {time.totalHours}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Motivational message */}
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="text-center text-red-200/80 text-sm md:text-base italic"
      >
        Every second with you is a gift 💝
      </motion.div>
    </div>
  );
}
