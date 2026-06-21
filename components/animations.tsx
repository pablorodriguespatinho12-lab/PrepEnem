'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';

// === SCROLL PROGRESS BAR ===
export function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setWidth(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (width < 1) return null;
  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}

// === ANIMATED COUNTER ===
export function AnimatedCounter({ value, duration = 1.2, className = '' }: { value: number; duration?: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || value === 0) { setDisplay(value); return; }
    let start = 0;
    const step = value / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}

// === STAGGER CONTAINER ===
export function StaggerContainer({ children, className = '', delay = 0.05 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

// === STAGGER ITEM ===
export function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

// === FADE IN ON SCROLL ===
export function FadeInView({ children, className = '', direction = 'up' }: { children: React.ReactNode; className?: string; direction?: 'up' | 'down' | 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const dirs = { up: { y: 30 }, down: { y: -30 }, left: { x: 30 }, right: { x: -30 } };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// === CONFETTI BURST ===
export function fireConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };
  confetti({ ...defaults, particleCount: count * 0.25, spread: 26, startVelocity: 55 });
  confetti({ ...defaults, particleCount: count * 0.2, spread: 60 });
  confetti({ ...defaults, particleCount: count * 0.35, spread: 100, decay: 0.91, scalar: 0.8 });
  confetti({ ...defaults, particleCount: count * 0.1, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  confetti({ ...defaults, particleCount: count * 0.1, spread: 120, startVelocity: 45 });
}

// === CELEBRATION MODAL ===
export function CelebrationOverlay({ show, message, subMessage, onClose }: { show: boolean; message: string; subMessage?: string; onClose: () => void }) {
  useEffect(() => {
    if (show) {
      fireConfetti();
      const t = setTimeout(fireConfetti, 800);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">{message}</h2>
            {subMessage && <p className="text-muted-foreground">{subMessage}</p>}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium shimmer-btn"
            >
              Continuar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// === PAGE WRAPPER with fade transition ===
export function PageTransition({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// === ANSWER FEEDBACK PARTICLES ===
export function spawnCorrectParticles(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const colors = ['#22c55e','#16a34a','#86efac','#fbbf24','#60a5fa'];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 40;
    const p = document.createElement('div');
    p.style.cssText = `
      position:fixed; width:8px; height:8px; border-radius:50%; z-index:9999;
      background:${colors[i % colors.length]}; pointer-events:none;
      left:${rect.left + rect.width / 2}px; top:${rect.top + rect.height / 2}px;
      animation:particleFly 0.6s ease-out forwards;
      --dx:${Math.cos(angle) * distance}px; --dy:${Math.sin(angle) * distance}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 650);
  }
}

// === FLASH FEEDBACK ===
export function flashScreen(type: 'correct' | 'wrong') {
  const el = document.createElement('div');
  el.className = type === 'correct' ? 'flash-correct' : 'flash-wrong';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 450);
}

// === SKELETON LOADER ===
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton h-32 w-full ${className}`} />
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-20 w-full" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}
