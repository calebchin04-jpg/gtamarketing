'use client';

import { motion } from 'framer-motion';
import { useSwitcherStore } from '@/lib/store';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function HeroSection() {
  const { setActiveModule } = useSwitcherStore();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle bg bloom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 70% at 40% 55%, rgba(45,90,79,0.07) 0%, transparent 70%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' as const }}
      >
        <p style={{
          fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#5A9E8F', fontWeight: 700,
          fontFamily: 'Space Grotesk, sans-serif', marginBottom: 24,
        }}>
          MARKHAM · LOCAL BUSINESS MAP
        </p>

        <h1 style={{
          fontSize: 'clamp(64px, 8vw, 108px)',
          fontWeight: 900, color: '#EFEFEF',
          fontFamily: 'Space Grotesk, sans-serif',
          letterSpacing: '-0.03em', lineHeight: 1.02,
          marginBottom: 28,
        }}>
          Find great local businesses.<br />
          Get rewarded for it.
        </h1>

        <p style={{
          fontSize: 22, color: 'rgba(239,239,239,0.5)',
          lineHeight: 1.65, maxWidth: 680,
          margin: '0 auto 40px',
        }}>
          GTA Marketing is a live interactive map of Markham&apos;s best local spots. Browse by category, vote for your favourites, unlock exclusive deals — and win real gift cards every month.
        </p>

        {/* CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveModule('liveHub')}
            style={{
              padding: '15px 32px', background: '#EFEFEF', color: '#0C0C0E',
              fontWeight: 700, fontSize: 18, letterSpacing: '0.06em',
              textTransform: 'uppercase', borderRadius: 12, border: 'none',
              cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            Explore the Map →
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo('how-it-works')}
            style={{
              padding: '15px 28px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.14)',
              color: '#EFEFEF', fontWeight: 500, fontSize: 18,
              borderRadius: 12, cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            See How It Works
          </motion.button>
        </div>

        <p
          onClick={() => scrollTo('business-cta')}
          style={{
            marginTop: 24, fontSize: 14,
            color: 'rgba(239,239,239,0.28)',
            cursor: 'pointer', letterSpacing: '0.01em',
            textAlign: 'center' as const,
          }}
        >
          Are you a local business?{' '}
          <span style={{ color: '#5A9E8F', textDecoration: 'underline' }}>
            Get your spot on the map →
          </span>
        </p>
      </motion.div>
    </section>
  );
}
