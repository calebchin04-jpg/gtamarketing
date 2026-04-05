'use client';

import { motion } from 'framer-motion';
import TierBubbles from '@/components/growth/TierBubbles';
import FoundingForm from '@/components/growth/FoundingForm';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Sticky note decoration ─────────────────────────────────────────────────
function StickyNote() {
  return (
    <motion.div
      initial={{ rotate: -8, y: -10, opacity: 0 }}
      whileInView={{ rotate: -6, y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      animate={{ rotate: [-6, -4, -6] }}
      style={{
        position: 'absolute',
        top: -22,
        right: 36,
        zIndex: 20,
      }}
    >
      <motion.div
        animate={{ rotate: [-6, -4, -6], y: [0, -3, 0] }}
        transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
        style={{
          width: 110,
          height: 110,
          background: 'linear-gradient(160deg, #FFF59D 0%, #FFE082 100%)',
          borderRadius: '3px 3px 3px 3px',
          boxShadow: '2px 6px 18px rgba(0,0,0,0.55), inset 0 -2px 6px rgba(0,0,0,0.08)',
          padding: '10px 12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          position: 'relative',
          transformOrigin: 'top center',
        }}
      >
        {/* Tape strip at top */}
        <div style={{
          position: 'absolute',
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 44,
          height: 16,
          background: 'rgba(255,255,255,0.55)',
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(2px)',
        }} />

        {/* Note text */}
        <p style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.5)',
          fontFamily: 'Space Grotesk, sans-serif',
          marginTop: 4,
        }}>
          ⚡ Don't miss
        </p>
        <p style={{
          fontSize: 15,
          fontWeight: 900,
          color: 'rgba(0,0,0,0.82)',
          fontFamily: 'Space Grotesk, sans-serif',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          Only 30<br />spots!
        </p>
        {/* Ruled lines */}
        {[0, 1].map(i => (
          <div key={i} style={{
            height: 1,
            background: 'rgba(0,0,0,0.12)',
            borderRadius: 1,
            width: i === 1 ? '65%' : '100%',
          }} />
        ))}
      </motion.div>
    </motion.div>
  );
}

const BULLETS = [
  'One business per industry — no competition from your category on the same flyer',
  '10,000 physical flyers distributed to ~40,000 GTA households',
  'Consumers who vote for you unlock your offer immediately — real incentive to visit',
];

function CheckItem({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(45,90,79,0.2)', border: '1px solid rgba(45,90,79,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1,
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#5A9E8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ fontSize: 19, color: 'rgba(239,239,239,0.6)', lineHeight: 1.6 }}>
        {text}
      </span>
    </div>
  );
}

export default function BusinessCTABand() {
  return (
    <section id="business-cta" style={{ padding: '72px 24px 0' }}>

      {/* Two-column: copy + tiers */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 80 }}>

        {/* Left: Copy */}
        <div style={{ flex: '0 0 38%' }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#C9A870', fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16,
            }}
          >
            FOR LOCAL BUSINESSES
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            style={{
              fontSize: 'clamp(34px, 3.5vw, 46px)',
              fontWeight: 900, color: '#EFEFEF',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-0.03em', lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            The platform that brings customers back to your door.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            style={{
              fontSize: 20, color: 'rgba(239,239,239,0.5)',
              lineHeight: 1.7, marginBottom: 28,
            }}
          >
            GTA Marketing isn't just visibility. It's a full loop. Consumers find your business on the map, vote for you, unlock your exclusive offer, and walk back through your door. Meanwhile, 10,000 physical flyers go out to ~40,000 GTA households — with your business as the only one in your industry on that flyer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {BULLETS.map((b) => <CheckItem key={b} text={b} />)}
          </motion.div>
        </div>

        {/* Right: Tiers */}
        <motion.div
          style={{ flex: 1, minWidth: 0 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          {/* Founding 30 urgency banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px',
            background: 'rgba(201,168,112,0.06)',
            border: '1px solid rgba(201,168,112,0.25)',
            borderRadius: 14, marginBottom: 32,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#C9A870', flexShrink: 0,
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 6px rgba(201,168,112,0.5)',
            }} />
            <div>
              <p style={{
                fontSize: 16, fontWeight: 700, color: '#C9A870',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                Founding 30 — Limited Spots Remaining
              </p>
              <p style={{ fontSize: 15, color: 'rgba(239,239,239,0.45)', marginTop: 3, lineHeight: 1.5 }}>
                First 30 businesses get 2 months free, then 50% off their tier permanently. These spots won't come back.
              </p>
            </div>
          </div>

          <TierBubbles />
        </motion.div>

      </div>

      {/* Full-width form band */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        style={{
          margin: '64px -24px 0',
          borderTop: '1px solid rgba(45,90,79,0.25)',
          background: 'rgba(45,90,79,0.07)',
        }}
      >
        <motion.div
          animate={{
            boxShadow: [
              'inset 0 0 0px rgba(45,90,79,0)',
              'inset 0 0 60px rgba(45,90,79,0.12)',
              'inset 0 0 0px rgba(45,90,79,0)',
            ],
          }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
          style={{ padding: '56px 24px 64px' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 80 }}>

            {/* Left: heading */}
            <div style={{ flex: '0 0 320px', position: 'relative' }}>
              <StickyNote />
              <p style={{
                fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase',
                color: '#5A9E8F', fontWeight: 800,
                fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10,
              }}>
                ✦ Apply Now
              </p>
              <p style={{
                fontSize: 'clamp(28px, 2.8vw, 38px)', fontWeight: 900, color: '#EFEFEF',
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10,
              }}>
                Claim your founding spot.
              </p>
              <p style={{
                fontSize: 15, color: 'rgba(239,239,239,0.38)',
                lineHeight: 1.6,
              }}>
                2 months free + 50% off forever — only for the first 30.
              </p>
            </div>

            {/* Right: form fills remaining width */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <FoundingForm />
            </div>

          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
