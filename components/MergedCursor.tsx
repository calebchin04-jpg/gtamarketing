'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * MergedCursor
 *
 * Architecture (z-index stack from back → front):
 *   z-[9990] — CursorGlow: radial-gradient ambient light, positioned via RAF.
 *              NO mix-blend-mode here — it must be a normal blend so it doesn't
 *              fight with the difference dot.
 *   z-[9998] — CursorRing: soft lagging ring, also no blend mode.
 *   z-[9999] — DifferenceDot: the crisp white dot with mix-blend-difference.
 *              Lives in its own stacking context (isolation: isolate is handled
 *              by next.js root, so we just give it the highest z and pointer-none).
 *
 * The glow and ring are rendered BELOW the difference dot so they never
 * participate in the blend calculation against the dot itself.
 */
export default function MergedCursor() {
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // --- Refs for imperative DOM updates (zero GC pressure) ---
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -300, y: -300 });
  const ring  = useRef({ x: -300, y: -300 });
  const rafId = useRef<number>(0);

  // --- Framer spring for the blend-mode dot only ---
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const springConfig = { damping: 22, stiffness: 280, mass: 0.4 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      mouse.current = { x: e.clientX, y: e.clientY };
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Ambient glow follows instantly at page-level coords
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(
          600px circle at ${e.pageX}px ${e.pageY}px,
          rgba(47, 79, 79, 0.18) 0%,
          rgba(20, 30, 50, 0.10) 40%,
          transparent 70%
        )`;
      }

      // Hover-text detection for dot expansion
      const target = e.target as HTMLElement;
      const el = target?.closest?.('[data-cursor]');
      setHoverText(el ? el.getAttribute('data-cursor') : null);
    };

    const onMouseLeave = () => setIsVisible(false);

    // Smooth lagging ring via RAF
    const animateRing = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.22;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.22;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      rafId.current = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    rafId.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ── Layer 1: Ambient glow (z-9990, no blend mode) ──────────────── */}
      <div
        ref={glowRef}
        className="fixed inset-0 pointer-events-none z-[9990]"
        style={{
          background: 'radial-gradient(600px circle at -300px -300px, transparent 0%, transparent 100%)',
          // Explicitly normal blend so it never touches the difference layer above
          mixBlendMode: 'normal',
        }}
      />

      {/* ── Layer 2: Lagging ring guide (z-9998, no blend mode) ─────────── */}
      {isVisible && (
        <div
          ref={ringRef}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.18)',
            // Use transform via RAF above — initial transform keeps it off screen
            transform: 'translate(-300px, -300px)',
            willChange: 'transform',
          }}
        />
      )}

      {/* ── Layer 3: Difference-mode dot (z-9999, own stacking context) ─── */}
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full
                     bg-white mix-blend-difference flex items-center justify-center overflow-hidden"
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
            willChange: 'transform, width, height',
            // Isolate this element's stacking context so its blend mode
            // only interacts with elements BELOW it, not the glow
            isolation: 'isolate',
          }}
          animate={{
            width:  hoverText ? 80 : 12,
            height: hoverText ? 80 : 12,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          {hoverText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="text-black text-[9px] font-black tracking-widest uppercase select-none"
            >
              {hoverText}
            </motion.span>
          )}
        </motion.div>
      )}
    </>
  );
}
