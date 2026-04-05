'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const MiniConstellation = dynamic(
  () => import('@/components/growth/MiniConstellation'),
  { ssr: false }
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Step 1 Graphic: Phone scanning QR/NFC ────────────────────────────────────
function PhoneScanGraphic() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',   // hug left so graphic is close to text
      gap: 32,
      width: '100%',
      height: '100%',
      paddingLeft: 8,
    }}>
      {/* QR Code with scan beam */}
      <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
        <svg width="200" height="200" viewBox="0 0 130 130" fill="none">
          <rect x="4" y="4" width="122" height="122" rx="10"
            stroke="rgba(45,90,79,0.45)" strokeWidth="1.5" fill="rgba(14,14,14,0.7)" />
          {/* Top-left finder */}
          <rect x="14" y="14" width="34" height="34" rx="4"
            stroke="rgba(45,90,79,0.85)" strokeWidth="1.5" fill="none" />
          <rect x="21" y="21" width="20" height="20" rx="2" fill="rgba(45,90,79,0.75)" />
          {/* Top-right finder */}
          <rect x="82" y="14" width="34" height="34" rx="4"
            stroke="rgba(45,90,79,0.85)" strokeWidth="1.5" fill="none" />
          <rect x="89" y="21" width="20" height="20" rx="2" fill="rgba(45,90,79,0.75)" />
          {/* Bottom-left finder */}
          <rect x="14" y="82" width="34" height="34" rx="4"
            stroke="rgba(45,90,79,0.85)" strokeWidth="1.5" fill="none" />
          <rect x="21" y="89" width="20" height="20" rx="2" fill="rgba(45,90,79,0.75)" />
          {/* Data modules */}
          {[
            [66,14],[74,14],[82,14],[66,22],[74,22],
            [14,66],[22,66],[30,66],[14,74],[30,74],[14,82],
            [66,66],[74,66],[82,66],[90,66],[98,66],[106,66],
            [66,74],[82,74],[98,74],[106,74],
            [66,82],[74,82],[90,82],[106,82],
            [66,90],[82,90],[98,90],
            [66,98],[74,98],[82,98],[90,98],[106,98],
            [66,106],[90,106],[98,106],
          ].map(([cx, cy], i) => (
            <rect key={i} x={cx} y={cy} width="6" height="6" rx="1"
              fill="rgba(45,90,79,0.65)" />
          ))}
          {/* Scan beam */}
          <motion.rect
            x="10" width="110" height="2.5" rx="1.25"
            fill="#5A9E8F"
            style={{ filter: 'drop-shadow(0 0 5px rgba(90,158,143,0.9))' }}
            animate={{ y: [10, 118, 10] }}
            transition={{ duration: 2.6, ease: 'linear', repeat: Infinity, repeatDelay: 0.4 }}
          />
        </svg>
      </div>

      {/* NFC phone with ripple rings */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: 220,
        flexShrink: 0,
      }}>
        {[0, 0.45, 0.9].map((delay, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 70 + i * 30,
              height: 70 + i * 30,
              borderRadius: '50%',
              border: '1px solid rgba(90,158,143,0.45)',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity, delay }}
          />
        ))}
        <svg width="76" height="136" viewBox="0 0 46 82" fill="none" style={{ position: 'relative', zIndex: 2 }}>
          <rect x="2" y="2" width="42" height="78" rx="8"
            stroke="rgba(220,220,220,0.3)" strokeWidth="1.5" fill="rgba(14,14,14,0.85)" />
          <rect x="7" y="11" width="32" height="52" rx="4"
            fill="rgba(45,90,79,0.1)" stroke="rgba(45,90,79,0.25)" strokeWidth="0.5" />
          <motion.g
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
          >
            <circle cx="23" cy="37" r="7" stroke="rgba(90,158,143,0.8)" strokeWidth="1" fill="none" />
            <circle cx="23" cy="37" r="3.5" fill="rgba(90,158,143,0.6)" />
          </motion.g>
          <rect x="17" y="70" width="12" height="2" rx="1" fill="rgba(220,220,220,0.15)" />
        </svg>
      </div>
    </div>
  );
}

// ── Step 3 Graphic: Stacked gift cards ────────────────────────────────────────
function GiftCardsGraphic() {
  const [shift, setShift] = useState(0);

  // Doubled card size: 260×156 → 380×228
  const CARD_W = 380;
  const CARD_H = 228;

  const SLOTS = [
    { rotate: -9, y: 0 },
    { rotate: 1, y: -28 },
    { rotate: 11, y: -54 },
  ];

  const CARD_DATA = [
    { label: 'Gift Card #1' },
    { label: 'Gift Card #2' },
    { label: 'Gift Card #3' },
  ];

  const getSlot = (i: number) => SLOTS[(i + shift) % 3];
  const getZIndex = (i: number) => 3 - ((i + shift) % 3);

  return (
    <div
      onClick={() => setShift(s => (s + 1) % 3)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        minHeight: CARD_H + 80,
      }}
    >
      {[0, 1, 2].map(i => {
        const slot = getSlot(i);
        return (
          <motion.div
            key={i}
            animate={{ rotate: slot.rotate, y: slot.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{
              position: 'absolute',
              width: CARD_W,
              height: CARD_H,
              borderRadius: 22,
              border: '1px solid rgba(45,90,79,0.55)',
              background: 'linear-gradient(135deg, rgba(14,14,16,0.97) 0%, rgba(28,28,31,0.92) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px 24px',
              boxShadow: '0 12px 48px rgba(0,0,0,0.65)',
              zIndex: getZIndex(i),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#5A9E8F', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              }}>GTA Marketing</span>
              <span style={{ fontSize: 28, lineHeight: 1 }}>🎁</span>
            </div>
            <div>
              <div style={{
                fontSize: 36, color: '#FFFFFF',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
                marginBottom: 6, letterSpacing: '-0.03em', lineHeight: 1,
              }}>{CARD_DATA[i].label}</div>
              <div style={{
                fontSize: 16, color: 'rgba(220,220,220,0.5)',
                fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.4,
              }}>10% of monthly GTA profits</div>
            </div>
            <div style={{
              position: 'absolute', bottom: 18, right: 22,
              width: 40, height: 30, borderRadius: 6,
              border: '1px solid rgba(45,90,79,0.45)',
              background: 'rgba(45,90,79,0.12)',
            }} />
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Step row ──────────────────────────────────────────────────────────────────
interface StepRowProps {
  num: string;
  title: string;
  body: string;
  graphic: React.ReactNode;
  reverse?: boolean;
  /** Override graphic column flex — e.g. '0 0 68%' for a wider map step */
  graphicFlex?: string;
}

function StepRow({ num, title, body, graphic, reverse = false, graphicFlex }: StepRowProps) {
  const textFlex = graphicFlex ? '1' : '1';

  const textBlock = (
    <motion.div
      initial={{ opacity: 0, x: reverse ? 32 : -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: EASE }}
      style={{
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '36px 0',
      }}
    >
      <div style={{
        fontSize: 80, fontWeight: 900, lineHeight: 1,
        color: 'rgba(45,90,79,0.12)',
        fontFamily: 'Space Grotesk, sans-serif',
        marginBottom: 20,
        userSelect: 'none',
      }}>
        {num}
      </div>
      <h3 style={{
        fontSize: 32, fontWeight: 800, color: '#EFEFEF',
        fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '-0.02em', lineHeight: 1.1,
        marginBottom: 16,
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: 19, color: 'rgba(239,239,239,0.5)',
        lineHeight: 1.65, maxWidth: 420,
      }}>
        {body}
      </p>
    </motion.div>
  );

  const graphicBlock = (
    <motion.div
      initial={{ opacity: 0, x: reverse ? -32 : 32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
      style={{
        flex: graphicFlex ?? '1',
        minWidth: 0, display: 'flex', alignItems: 'center',
        height: '100%',
      }}
    >
      {graphic}
    </motion.div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      alignItems: 'stretch',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        flex: textFlex, minWidth: 0,
        order: reverse ? 2 : 1,
        display: 'flex', alignItems: 'center',
        // tight gap: text nearly touches the graphic
        paddingRight: reverse ? 0 : 8,
        paddingLeft: reverse ? 8 : 0,
      }}>
        {textBlock}
      </div>
      <div style={{
        flex: graphicFlex ?? '1',
        minWidth: 0,
        order: reverse ? 1 : 2,
        display: 'flex', alignItems: 'stretch',
        borderLeft: reverse ? 'none' : '1px solid rgba(255,255,255,0.04)',
        borderRight: reverse ? '1px solid rgba(255,255,255,0.04)' : 'none',
        paddingLeft: reverse ? 0 : 8,
        paddingRight: reverse ? 8 : 0,
      }}>
        {graphicBlock}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function HowItWorksStrip() {
  return (
    <section id="how-it-works" style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '72px 24px 0',
    }}>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{
          fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#5A9E8F', fontWeight: 700,
          fontFamily: 'Space Grotesk, sans-serif', marginBottom: 48,
        }}
      >
        THREE SIMPLE STEPS
      </motion.p>

      <StepRow
        num="01"
        title="Scan to Enter"
        body="Walk into any participating Markham business and scan the QR code or tap the NFC tag at the counter. You're instantly on the map. Takes about five seconds."
        graphic={<PhoneScanGraphic />}
        reverse={false}
      />

      <StepRow
        num="02"
        title="Explore the Map"
        body="Browse every local Markham business by category — restaurants, dentists, real estate, fitness, and more. Click any business to open their full profile."
        graphic={
          <div style={{ width: '100%', height: '100%', overflow: 'hidden', minHeight: 320 }}>
            <MiniConstellation containerStyle={{ aspectRatio: 'unset', height: '100%', width: '100%' }} />
          </div>
        }
        reverse={true}
        graphicFlex="0 0 68%"
      />

      <StepRow
        num="03"
        title="Vote. Unlock. Win."
        body="Vote for any business you want to support. Your exclusive offer unlocks immediately. Every vote enters you into the monthly gift card draw — three real winners, every month."
        graphic={<GiftCardsGraphic />}
        reverse={false}
      />
    </section>
  );
}
