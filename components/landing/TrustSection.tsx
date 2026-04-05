'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const CircularEconomyFlow = dynamic(
  () => import('@/components/growth/CircularEconomyFlow'),
  { ssr: false }
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATS = [
  { value: '10,000', label: 'Physical Flyers', sub: 'Distributed across GTA' },
  { value: '40,000', label: 'Households', sub: 'Estimated reach' },
  { value: '1 per', label: 'Industry', sub: 'One business per industry' },
  { value: '~400', label: 'New Customers', sub: 'At 1% conversion' },
];

const CONSUMER_ITEMS = [
  'Find local businesses you never knew were there',
  'Vote for the ones you love in one tap',
  'Unlock an exclusive offer instantly when you vote',
  'Get entered into the monthly gift card draw automatically',
];

const BUSINESS_ITEMS = [
  'Appear on a live map browsed by Markham residents daily',
  'One business per industry — no competition from your category',
  'Monthly gift card winners are active users already looking to spend locally',
  'Founding 30: 2 months free, then 50% off your tier — permanently',
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

export default function TrustSection() {
  return (
    <section style={{
      background: '#0F0F11',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '72px 24px',
    }}>
      <div>

        {/* Stat cards */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
              }}
              style={{
                background: '#141416',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 18, padding: '28px 24px',
              }}
            >
              <div style={{
                fontSize: 42, fontWeight: 900, color: '#EFEFEF',
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'rgba(239,239,239,0.65)', marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 15, color: 'rgba(239,239,239,0.28)' }}>
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '64px 0' }} />

        {/* What you get */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p style={{
              fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#5A9E8F', fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12,
            }}>
              FOR CONSUMERS
            </p>
            <h3 style={{
              fontSize: 27, fontWeight: 800, color: '#EFEFEF',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-0.02em', marginBottom: 24,
            }}>
              Discovery, deals, and real rewards.
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CONSUMER_ITEMS.map((item) => <CheckItem key={item} text={item} />)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          >
            <p style={{
              fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#C9A870', fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12,
            }}>
              FOR BUSINESSES
            </p>
            <h3 style={{
              fontSize: 27, fontWeight: 800, color: '#EFEFEF',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-0.02em', marginBottom: 24,
            }}>
              The platform that works for both sides.
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {BUSINESS_ITEMS.map((item) => <CheckItem key={item} text={item} />)}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '64px 0' }} />

        {/* Money flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p style={{
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#5A9E8F', fontWeight: 700,
            fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12,
          }}>
            WHY THIS IS DIFFERENT
          </p>
          <h3 style={{
            fontSize: 22, fontWeight: 800, color: '#EFEFEF',
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '-0.02em', marginBottom: 32,
          }}>
            Not a review site. Not an ad platform.
          </h3>
          <CircularEconomyFlow variant="business" />
        </motion.div>

      </div>
    </section>
  );
}
