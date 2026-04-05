'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Benefit {
  label: string;
  title: string;
  body: string;
  accentColor: string;
  gradientFrom: string;
  icon: React.ReactNode;
  featured?: boolean;
}

const BENEFITS: Benefit[] = [
  {
    label: 'LIVE MAP',
    title: "Discover local spots you've been missing",
    body: 'Browse Markham on a live map and uncover businesses hiding in plain sight.',
    accentColor: '#5A9E8F',
    gradientFrom: 'rgba(45,90,79,0.55)',
    featured: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'REWARDS',
    title: 'Win real gift cards every month',
    body: 'Three winners each month receive gift cards funded by platform profits.',
    accentColor: '#C9A870',
    gradientFrom: 'rgba(201,168,112,0.3)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 12V22H4V12" />
        <path d="M22 7H2v5h20V7z" />
        <path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    label: 'DEALS',
    title: 'Unlock offers the moment you vote',
    body: 'Support a business and instantly reveal a real deal you can actually use.',
    accentColor: '#5A9E8F',
    gradientFrom: 'rgba(45,90,79,0.38)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: 'IMPACT',
    title: 'Support local in a way that pays back',
    body: 'Your votes help local businesses get seen, while rewards stay in the community.',
    accentColor: '#5A9E8F',
    gradientFrom: 'rgba(45,90,79,0.38)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

// ─── Card "shove" variants ────────────────────────────────────────────────────
const CARD_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? '112%' : '-112%',
    rotate: dir > 0 ? 6 : -6,
    scale: 0.86,
    opacity: 0.6,
  }),
  center: {
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      x:      { type: 'spring', stiffness: 340, damping: 26, mass: 0.95 },
      rotate: { type: 'spring', stiffness: 340, damping: 26 },
      scale:  { type: 'spring', stiffness: 380, damping: 28 },
      opacity: { duration: 0.1 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-76%' : '76%',
    rotate: dir > 0 ? -8 : 8,
    scale: 0.80,
    opacity: 0,
    transition: {
      x:      { type: 'spring', stiffness: 500, damping: 34, mass: 0.8 },
      rotate: { duration: 0.2, ease: 'easeIn' as const },
      scale:  { duration: 0.18 },
      opacity: { duration: 0.14 },
    },
  }),
};

// ─── Textbox stagger for card content ────────────────────────────────────────
const CONTENT_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.22 } },
};

const TEXTBOX_ITEM = {
  hidden: { opacity: 0, y: 22, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 520, damping: 22 },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'left'
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

function MapDots() {
  const dots = [
    { x: '18%', y: '30%', s: 5, o: 0.9 },
    { x: '42%', y: '55%', s: 4, o: 0.7 },
    { x: '65%', y: '25%', s: 6, o: 1   },
    { x: '78%', y: '60%', s: 3, o: 0.6 },
    { x: '30%', y: '72%', s: 4, o: 0.7 },
    { x: '55%', y: '40%', s: 3, o: 0.5 },
    { x: '88%', y: '35%', s: 3, o: 0.5 },
    { x: '12%', y: '60%', s: 3, o: 0.4 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id="mapgrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(90,158,143,0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: d.y,
          width: d.s, height: d.s, borderRadius: '50%',
          background: '#5A9E8F', opacity: d.o,
          boxShadow: `0 0 ${d.s * 2}px rgba(90,158,143,0.6)`,
        }} />
      ))}
      {/* Active pin */}
      <div style={{
        position: 'absolute', left: '65%', top: '10%',
        width: 20, height: 20,
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        background: 'linear-gradient(135deg, #5A9E8F, #3B7265)',
        border: '2px solid rgba(90,158,143,0.7)',
        boxShadow: '0 0 14px rgba(90,158,143,0.55)',
      }} />
    </div>
  );
}

// ─── NavButton ────────────────────────────────────────────────────────────────
function NavButton({
  direction, disabled, onClick,
}: { direction: 'left' | 'right'; disabled: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.12, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? 'rgba(239,239,239,0.18)' : 'rgba(239,239,239,0.6)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'border-color 0.18s, color 0.18s, background 0.18s',
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(90,158,143,0.55)';
        el.style.color = '#5A9E8F';
        el.style.background = 'rgba(45,90,79,0.14)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)';
        el.style.color = disabled ? 'rgba(239,239,239,0.18)' : 'rgba(239,239,239,0.6)';
        el.style.background = 'rgba(255,255,255,0.04)';
      }}
      aria-label={`Go ${direction}`}
    >
      <ChevronIcon direction={direction} />
    </motion.button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BenefitCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hasNavigated, setHasNavigated] = useState(false);

  const sectionRef   = useRef<HTMLDivElement>(null);
  const activeRef    = useRef(activeIndex);
  const canNavigate  = useRef(true);
  const touchStart   = useRef<number | null>(null);

  // Keep ref in sync so wheel/touch handlers don't capture stale closure
  activeRef.current = activeIndex;

  const navigate = useCallback((dir: 1 | -1) => {
    const next = activeRef.current + dir;
    if (next < 0 || next >= BENEFITS.length) return;
    if (!canNavigate.current) return;
    canNavigate.current = false;
    setDirection(dir);
    setActiveIndex(next);
    setHasNavigated(true);
    setTimeout(() => { canNavigate.current = true; }, 540);
  }, []);

  const jumpTo = useCallback((i: number) => {
    if (i === activeRef.current) return;
    const dir = (i > activeRef.current ? 1 : -1) as 1 | -1;
    if (!canNavigate.current) return;
    canNavigate.current = false;
    setDirection(dir);
    setActiveIndex(i);
    setHasNavigated(true);
    setTimeout(() => { canNavigate.current = true; }, 540);
  }, []);

  // Wheel scroll — intercept only when cursor is over this section
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handler = (e: WheelEvent) => {
      const ax = Math.abs(e.deltaX);
      const ay = Math.abs(e.deltaY);
      // Touchpad horizontal swipe: deltaX dominates or is meaningfully present
      if (ax > 8 && ax >= ay * 0.5) {
        e.preventDefault();
        navigate(e.deltaX > 0 ? 1 : -1);
        return;
      }
      // Vertical scroll fallback
      if (ay < 18) return;
      e.preventDefault();
      navigate(e.deltaY > 0 ? 1 : -1);
    };
    section.addEventListener('wheel', handler, { passive: false });
    return () => section.removeEventListener('wheel', handler);
  }, [navigate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) navigate(diff > 0 ? 1 : -1);
    touchStart.current = null;
  };

  const benefit = BENEFITS[activeIndex];
  const isGold  = benefit.accentColor === '#C9A870';
  const accentRgb = isGold ? '201,168,112' : '90,158,143';

  return (
    <section
      ref={sectionRef}
      id="for-consumers"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ padding: '72px 24px' }}
    >

      {/* ── Eyebrow + counter ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 28,
      }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#5A9E8F', fontWeight: 700,
            fontFamily: 'Space Grotesk, sans-serif', margin: 0,
          }}
        >
          WHAT YOU GET
        </motion.p>

        <motion.span
          key={activeIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{
            fontSize: 13, fontFamily: 'Space Grotesk, sans-serif',
            color: 'rgba(239,239,239,0.28)', letterSpacing: '0.1em',
          }}
        >
          {String(activeIndex + 1).padStart(2, '0')} / {String(BENEFITS.length).padStart(2, '0')}
        </motion.span>
      </div>

      {/* ── Card stage ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 290, borderRadius: 22 }}>
        <AnimatePresence custom={direction} mode="sync">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={CARD_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              position: 'absolute', inset: 0,
              borderRadius: 20, overflow: 'hidden',
              background: isGold ? '#141416' : '#161819',
              border: `1px solid rgba(${accentRgb},0.28)`,
              boxShadow: `0 12px 48px rgba(0,0,0,0.52), 0 0 0 1px rgba(${accentRgb},0.07)`,
              display: 'flex', flexDirection: 'column',
              transformOrigin: 'center center',
            }}
          >

            {/* Gradient header / visual area */}
            <div style={{
              height: 112, flexShrink: 0, position: 'relative', overflow: 'hidden',
              background: `linear-gradient(160deg, ${benefit.gradientFrom} 0%, rgba(14,14,16,0) 100%)`,
              borderBottom: 'none',
            }}>
              {benefit.featured && <MapDots />}

              {/* Icon + label */}
              <div style={{
                position: 'absolute', bottom: 14, left: 24,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: `rgba(${accentRgb},0.16)`,
                    border: `1px solid rgba(${accentRgb},0.3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: benefit.accentColor,
                  }}
                >
                  {benefit.icon}
                </motion.div>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: benefit.accentColor,
                  fontFamily: 'Space Grotesk, sans-serif', opacity: 0.88,
                }}>
                  {benefit.label}
                </span>
              </div>
            </div>

            {/* Staggered text content */}
            <motion.div
              variants={CONTENT_CONTAINER}
              initial="hidden"
              animate="show"
              style={{ padding: '22px 26px 28px', flex: 1 }}
            >
              <motion.h3
                variants={TEXTBOX_ITEM}
                style={{
                  fontSize: 24, fontWeight: 700, color: '#EFEFEF',
                  fontFamily: 'Space Grotesk, sans-serif',
                  letterSpacing: '-0.02em', lineHeight: 1.25,
                  margin: '0 0 11px',
                }}
              >
                {benefit.title}
              </motion.h3>

              <motion.p
                variants={TEXTBOX_ITEM}
                style={{
                  fontSize: 15.5, color: 'rgba(239,239,239,0.52)',
                  lineHeight: 1.65, margin: 0,
                }}
              >
                {benefit.body}
              </motion.p>
            </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Scroll hint ───────────────────────────────────────────────────── */}
      <div style={{ minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence>
          {!hasNavigated && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.22 } }}
              transition={{ duration: 0.38, delay: 1.1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 11, color: 'rgba(239,239,239,0.28)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                fontFamily: 'Space Grotesk, sans-serif',
                userSelect: 'none',
              }}
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block' }}
              >
                →
              </motion.span>
              Scroll to explore
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                style={{ display: 'inline-block' }}
              >
                →
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Dot indicators + arrows ───────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginTop: 16,
      }}>
        <NavButton direction="left"  disabled={activeIndex === 0}                  onClick={() => navigate(-1)} />

        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {BENEFITS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => jumpTo(i)}
              animate={{
                width:      i === activeIndex ? 26 : 8,
                opacity:    i === activeIndex ? 1  : 0.3,
                background: i === activeIndex ? '#5A9E8F' : 'rgba(239,239,239,0.35)',
              }}
              whileHover={i !== activeIndex ? { opacity: 0.6, scale: 1.15 } : {}}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              style={{
                height: 8, borderRadius: 4,
                border: 'none', cursor: i === activeIndex ? 'default' : 'pointer',
                padding: 0, flexShrink: 0,
              }}
              aria-label={`Go to ${BENEFITS[i].label}`}
            />
          ))}
        </div>

        <NavButton direction="right" disabled={activeIndex === BENEFITS.length - 1} onClick={() => navigate(1)} />
      </div>

    </section>
  );
}
