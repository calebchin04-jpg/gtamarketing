'use client';

import { motion } from 'framer-motion';
import { useSwitcherStore } from '@/lib/store';
import { audio } from '@/lib/audio';
import ParticleBackground from './ParticleBackground';
import ChampionSidebar from './ChampionSidebar';
import LiveHub from './LiveHub';
import GrowthEcosystem from './GrowthEcosystem';

// Spring for opening overview — soft, gentle spread
const SPRING_OPEN  = { type: 'spring' as const, stiffness: 100, damping: 18, mass: 1 };
// Spring for snapping to fullscreen — tight, no bounce, feels like a confident drag
const SPRING_CLOSE = { type: 'spring' as const, stiffness: 280, damping: 32, mass: 1 };

// Overview layout constants
const CARD_SCALE_OVERVIEW = 0.47;       // fits two 16:9 cards comfortably side-by-side
const CARD_X_LIVE    = '-27vw';         // left card
const CARD_X_GROWTH  =  '27vw';        // right card

export default function NexusSwitcher() {
  const {
    isSwitcherOpen,
    activeModule,
    phase,
    setActiveModule,
    setSwitcherOpen,
    resolveTransition,
  } = useSwitcherStore();

  const isLiveActive    = activeModule === 'liveHub';
  const isGrowthActive  = activeModule === 'growthEcosystem';
  const isTransitioning = phase === 'switching';

  // ── Card animation targets ──────────────────────────────────────────────

  const liveAnimate = isSwitcherOpen
    ? {
        scale: CARD_SCALE_OVERVIEW,
        x: CARD_X_LIVE,
        y: 0,
        filter: 'blur(0px)',
        opacity: 1,
      }
    : {
        scale: isLiveActive ? 1 : 1,          // both expand to full when active
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        opacity: isLiveActive ? 1 : 0,        // inactive card hidden behind
      };

  const growthAnimate = isSwitcherOpen
    ? {
        scale: CARD_SCALE_OVERVIEW,
        x: CARD_X_GROWTH,
        y: 0,
        filter: 'blur(0px)',
        opacity: 1,
      }
    : {
        scale: isGrowthActive ? 1 : 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        opacity: isGrowthActive ? 1 : 0,
      };

  // ── Card click handlers ─────────────────────────────────────────────────

  const handleLiveClick = () => {
    if (!isSwitcherOpen || isTransitioning) return;
    audio.playThud();
    if (isLiveActive) {
      setSwitcherOpen(false);     // already active → just close overview
    } else {
      setActiveModule('liveHub'); // switch world → triggers 'switching' phase
    }
  };

  const handleGrowthClick = () => {
    if (!isSwitcherOpen || isTransitioning) return;
    audio.playThud();
    if (isGrowthActive) {
      setSwitcherOpen(false);
    } else {
      setActiveModule('growthEcosystem');
    }
  };

  // ── Animation complete: resolve the phase lock ──────────────────────────
  // Both cards fire this; the second fire is a no-op since phase will
  // already be 'resolved' / 'idle' at that point.
  const handleAnimationComplete = () => {
    resolveTransition();
  };

  return (
    /**
     * Root container — when switching, disable ALL pointer events globally.
     * This is the outermost guard; individual card guards exist too for
     * defence-in-depth.
     */
    <div
      className="fixed inset-0 bg-[#050505] overflow-hidden flex items-center justify-center"
      style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
    >
      {/* ── Layer 0: Deep Background ───────────────────────────────────────
          This is the "world" that blurs when Overview Mode opens.
          The cards sit in front of this layer (they are NOT blurred).
          backdrop-filter is applied to a sibling overlay above this,
          so the cards remain crisp.
      */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <ParticleBackground />
      </div>

      {/* ── Layer 1: Blur & Darken Overlay (active only in Overview Mode) ─
          Uses backdrop-filter on THIS element — it blurs everything BELOW it
          (the ParticleBackground). The cards are rendered ABOVE this layer
          so they are unaffected.
      */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isSwitcherOpen ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          backdropFilter: 'blur(40px) brightness(0.45)',
          WebkitBackdropFilter: 'blur(40px) brightness(0.45)',
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
        }}
      />

      {/* ── Layer 2: Champion Sidebar ──────────────────────────────────── */}
      {isSwitcherOpen && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <ChampionSidebar />
        </div>
      )}

      {/* ── Layer 3: World Cards ───────────────────────────────────────────
          Cards live above the blur overlay (z-30+) so they NEVER get blurred.
          Each card is a full-viewport absolutely-positioned motion.div that
          scales and translates in overview mode.
      */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">

        {/* ── Card A: Live Hub ──────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center origin-center"
          style={{
            willChange: 'transform, opacity',
            // In overview, cursor becomes a pointer (cards are clickable)
            cursor: isSwitcherOpen ? 'pointer' : 'default',
            // Cards behind the active world have no pointer events when closed
            pointerEvents:
              !isSwitcherOpen && !isLiveActive ? 'none' : 'auto',
          }}
          animate={liveAnimate}
          transition={isSwitcherOpen ? SPRING_OPEN : SPRING_CLOSE}
          onAnimationComplete={handleAnimationComplete}
          onClick={handleLiveClick}
          whileHover={
            isSwitcherOpen
              ? { scale: CARD_SCALE_OVERVIEW * 1.025 }  // subtle lift on hover
              : undefined
          }
        >
          {/* Inner shell — pointer events disabled on content so only the
              motion wrapper card receives the click in overview mode */}
          <div
            className={[
              'w-full h-full rounded-3xl overflow-hidden',
              'border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)]',
              // Disable ALL inner interactions when in overview or inactive
              isSwitcherOpen || !isLiveActive
                ? 'pointer-events-none'
                : 'pointer-events-auto',
            ].join(' ')}
          >
            <LiveHub />
          </div>

          {/* Overview label — only visible in overview mode */}
          <motion.div
            className="absolute bottom-[calc(0%-2.5rem)] left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isSwitcherOpen ? 1 : 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <span className="text-[10px] tracking-[0.4em] text-white/50 uppercase">
              {isLiveActive ? '● Active' : '○ Switch'}
            </span>
            <span className="text-sm font-bold text-white tracking-wider font-display">
              Live Hub
            </span>
          </motion.div>
        </motion.div>

        {/* ── Card B: Growth Ecosystem ──────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center origin-center"
          style={{
            willChange: 'transform, opacity',
            cursor: isSwitcherOpen ? 'pointer' : 'default',
            pointerEvents:
              !isSwitcherOpen && !isGrowthActive ? 'none' : 'auto',
          }}
          animate={growthAnimate}
          transition={isSwitcherOpen ? SPRING_OPEN : SPRING_CLOSE}
          onAnimationComplete={handleAnimationComplete}
          onClick={handleGrowthClick}
          whileHover={
            isSwitcherOpen
              ? { scale: CARD_SCALE_OVERVIEW * 1.025 }
              : undefined
          }
        >
          <div
            className={[
              'w-full h-full rounded-3xl overflow-hidden',
              'border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)]',
              isSwitcherOpen || !isGrowthActive
                ? 'pointer-events-none'
                : 'pointer-events-auto',
            ].join(' ')}
          >
            <GrowthEcosystem />
          </div>

          {/* Overview label */}
          <motion.div
            className="absolute bottom-[calc(0%-2.5rem)] left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isSwitcherOpen ? 1 : 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <span className="text-[10px] tracking-[0.4em] text-white/50 uppercase">
              {isGrowthActive ? '● Active' : '○ Switch'}
            </span>
            <span className="text-sm font-bold text-white tracking-wider font-display">
              Growth Ecosystem
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
