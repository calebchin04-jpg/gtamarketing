'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useSwitcherStore } from '@/lib/store';

const MiniConstellation = dynamic(
  () => import('@/components/growth/MiniConstellation'),
  { ssr: false }
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LEGEND = [
  { dot: 'rgba(220,220,220,0.7)', label: 'Anchor business — major local presence', size: 14 },
  { dot: 'rgba(90,158,143,0.7)', label: 'Featured business', size: 10 },
  { dot: 'rgba(47,79,79,0.8)', label: 'Standard listing', size: 7 },
];

export default function MapEntrySection() {
  const { setActiveModule } = useSwitcherStore();

  return (
    <section style={{ padding: '72px 24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 80 }}>

          {/* Left: Text */}
          <div style={{ flex: '0 0 50%' }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#5A9E8F', fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16,
              }}
            >
              THE LIVE MAP
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              style={{
                fontSize: 'clamp(38px, 4vw, 52px)',
                fontWeight: 900, color: '#EFEFEF',
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.03em', lineHeight: 1.08,
                marginBottom: 18,
              }}
            >
              Every bubble is a real local business.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              style={{
                fontSize: 20, color: 'rgba(239,239,239,0.5)',
                lineHeight: 1.72, maxWidth: 440, marginBottom: 32,
              }}
            >
              Most local directories are static lists. This is a live map — every circle
              represents a real Markham business, grouped by industry. Click any cluster to
              see who's inside. Click a business to view their profile, see their exclusive
              offer, and cast your vote.
            </motion.p>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}
            >
              {LEGEND.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: item.size, height: item.size, borderRadius: '50%',
                    background: item.dot, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 17, color: 'rgba(239,239,239,0.52)', lineHeight: 1.5 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveModule('liveHub')}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
              style={{
                padding: '13px 28px', background: '#EFEFEF', color: '#0C0C0E',
                fontWeight: 700, fontSize: 18, letterSpacing: '0.06em',
                textTransform: 'uppercase', borderRadius: 12, border: 'none',
                cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Explore the Map →
            </motion.button>
          </div>

          {/* Right: Map preview */}
          <motion.div
            style={{ flex: 1, minWidth: 0, position: 'relative' }}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <div style={{
              aspectRatio: '4 / 3',
              borderRadius: 20,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
            }}>
              <MiniConstellation containerStyle={{ aspectRatio: 'unset', height: '100%' }} />

              {/* Live pill */}
              <div style={{
                position: 'absolute', top: 14, left: 14, zIndex: 10,
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(20,20,22,0.85)',
                border: '1px solid rgba(45,90,79,0.4)',
                borderRadius: 100, padding: '4px 10px',
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#5A9E8F', display: 'block',
                  boxShadow: '0 0 6px rgba(90,158,143,0.7)',
                  animation: 'pulse 2s infinite',
                }} />
                <span style={{
                  fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#5A9E8F', fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  Live
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
