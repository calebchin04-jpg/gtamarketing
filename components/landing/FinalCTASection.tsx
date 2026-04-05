'use client';

import { motion } from 'framer-motion';
import { useSwitcherStore } from '@/lib/store';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function FinalCTASection() {
  const { setActiveModule } = useSwitcherStore();

  return (
    <section style={{ padding: '72px 24px 88px' }}>
      <div style={{ textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#5A9E8F', fontWeight: 700,
            fontFamily: 'Space Grotesk, sans-serif', marginBottom: 20,
          }}
        >
          GET STARTED
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.05 }}
          style={{
            fontSize: 'clamp(48px, 6vw, 72px)',
            fontWeight: 900, color: '#EFEFEF',
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '-0.03em', lineHeight: 1.06,
            marginBottom: 20,
          }}
        >
          Start exploring Markham.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          style={{
            fontSize: 22, color: 'rgba(239,239,239,0.48)',
            lineHeight: 1.7, maxWidth: 500, margin: '0 auto 40px',
          }}
        >
          Browse every local business, vote for the ones you love, and unlock your first deal in under two minutes. Free. No account required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveModule('liveHub')}
            style={{
              padding: '16px 44px', background: '#EFEFEF', color: '#0C0C0E',
              fontWeight: 700, fontSize: 20, letterSpacing: '0.06em',
              textTransform: 'uppercase', borderRadius: 14, border: 'none',
              cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            Browse the Map →
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          style={{
            marginTop: 16, fontSize: 16,
            color: 'rgba(239,239,239,0.22)',
            letterSpacing: '0.03em',
          }}
        >
          No sign-up. No cost. Just explore.
        </motion.p>
      </div>
    </section>
  );
}
