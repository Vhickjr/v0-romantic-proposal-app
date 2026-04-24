'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface BlobItem {
  url: string;
  pathname: string;
}

interface PhotoConfig {
  url: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  swayX: number;
  rotateAmt: number;
}

interface CursorPos {
  x: number;
  y: number;
}

const DODGE_RADIUS_MULTIPLIER = 1.9;
const MAX_DODGE_FORCE = 115;

function FloatingPhoto({
  config,
  cursorRef,
}: {
  config: PhotoConfig;
  cursorRef: React.RefObject<CursorPos>;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  const rawDodgeX = useMotionValue(0);
  const rawDodgeY = useMotionValue(0);
  const springX = useSpring(rawDodgeX, { stiffness: 420, damping: 20, mass: 0.55 });
  const springY = useSpring(rawDodgeY, { stiffness: 420, damping: 20, mass: 0.55 });

  useEffect(() => {
    const threshold = config.size * DODGE_RADIUS_MULTIPLIER;
    let rafId: number;

    const tick = () => {
      const el = innerRef.current;
      if (el) {
        const { x, y } = cursorRef.current;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold && dist > 0) {
          const strength = Math.pow((threshold - dist) / threshold, 1.4);
          const force = strength * MAX_DODGE_FORCE;
          rawDodgeX.set(-(dx / dist) * force);
          rawDodgeY.set(-(dy / dist) * force);
        } else {
          rawDodgeX.set(0);
          rawDodgeY.set(0);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [config.size, rawDodgeX, rawDodgeY, cursorRef]);

  return (
    <motion.div
      initial={{
        y: window.innerHeight + 160,
        x: `${config.left}%`,
        opacity: 0,
        scale: 0.6,
        rotate: 0,
      }}
      animate={{
        y: -(config.size + 80),
        opacity: [0, 0.96, 0.92, 0.84, 0],
        scale: [0.6, 1, 1.05, 0.98, 0.88],
        rotate: [0, config.rotateAmt, -config.rotateAmt * 0.55, config.rotateAmt * 0.25, 0],
        x: [
          `${config.left}%`,
          `calc(${config.left}% + ${config.swayX}px)`,
          `calc(${config.left}% - ${config.swayX * 0.55}px)`,
          `calc(${config.left}% + ${config.swayX * 0.2}px)`,
          `${config.left}%`,
        ],
      }}
      transition={{ duration: config.duration, delay: config.delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'fixed', width: config.size, height: config.size }}
    >
      <motion.div ref={innerRef} style={{ x: springX, y: springY, width: '100%', height: '100%' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.9)',
            boxShadow: '0 10px 40px rgba(255,107,138,0.28), 0 2px 10px rgba(0,0,0,0.08)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.url}
            alt="Memory"
            draggable={false}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FloatingPhotos() {
  const [photos, setPhotos] = useState<BlobItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  // Single shared cursor ref — one event listener feeds all photos
  const cursorRef = useRef<CursorPos>({ x: -9999, y: -9999 });

  useEffect(() => {
    fetch('/api/photos/list')
      .then((r) => r.json())
      .then((data) => setPhotos(Array.isArray(data) ? data : []))
      .catch(() => {});

    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener('resize', checkWidth, { passive: true });

    const onMouse = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) cursorRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      window.removeEventListener('resize', checkWidth);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  const configs: PhotoConfig[] = useMemo(
    () =>
      photos.map((photo, i) => ({
        url: photo.url,
        left: isMobile ? 18 + (i * 24) % 52 : 4 + (i * 21) % 80,
        size: isMobile ? 105 + (i % 3) * 22 : 90 + (i % 4) * 20,
        duration: 24 + (i % 5) * 4,
        delay: i * 4,
        swayX: (i % 2 === 0 ? 1 : -1) * (isMobile ? 12 : 18 + (i % 3) * 14),
        rotateAmt: (i % 2 === 0 ? 1 : -1) * 7,
      })),
    [photos, isMobile]
  );

  if (photos.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: isMobile ? 15 : 5 }}
    >
      {configs.map((config) => (
        <FloatingPhoto key={config.url} config={config} cursorRef={cursorRef} />
      ))}
    </div>
  );
}
