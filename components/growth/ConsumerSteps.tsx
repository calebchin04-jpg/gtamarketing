'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const MiniConstellation = dynamic(
  () => import('@/components/growth/MiniConstellation'),
  { ssr: false }
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Step 1 Graphic: QR code + NFC phone ──────────────────────────────────
function QRNFCGraphic() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      width: '100%',
      height: '100%',
      minHeight: 380,
    }}>
      {/* QR Code with animated scan beam */}
      <div style={{ position: 'relative', width: 240, height: 240 }}>
        <svg width="240" height="240" viewBox="0 0 130 130" fill="none">
          {/* Background */}
          <rect x="4" y="4" width="122" height="122" rx="10"
            stroke="rgba(47,79,79,0.45)" strokeWidth="1.5" fill="rgba(14,14,14,0.7)" />

          {/* Top-left finder pattern */}
          <rect x="14" y="14" width="34" height="34" rx="4"
            stroke="rgba(47,79,79,0.85)" strokeWidth="1.5" fill="none" />
          <rect x="21" y="21" width="20" height="20" rx="2" fill="rgba(47,79,79,0.75)" />

          {/* Top-right finder pattern */}
          <rect x="82" y="14" width="34" height="34" rx="4"
            stroke="rgba(47,79,79,0.85)" strokeWidth="1.5" fill="none" />
          <rect x="89" y="21" width="20" height="20" rx="2" fill="rgba(47,79,79,0.75)" />

          {/* Bottom-left finder pattern */}
          <rect x="14" y="82" width="34" height="34" rx="4"
            stroke="rgba(47,79,79,0.85)" strokeWidth="1.5" fill="none" />
          <rect x="21" y="89" width="20" height="20" rx="2" fill="rgba(47,79,79,0.75)" />

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
              fill="rgba(47,79,79,0.65)" />
          ))}

          {/* Animated scan beam */}
          <motion.rect
            x="10" width="110" height="2.5" rx="1.25"
            fill="#2F4F4F"
            style={{ filter: 'drop-shadow(0 0 5px rgba(47,79,79,0.9))' }}
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
        width: 160,
        height: 240,
      }}>
        {/* Ripple rings behind phone */}
        {[0, 0.45, 0.9].map((delay, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 86 + i * 34,
              height: 86 + i * 34,
              borderRadius: '50%',
              border: '1px solid rgba(47,79,79,0.5)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
            transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity, delay }}
          />
        ))}

        {/* Phone silhouette */}
        <svg width="84" height="148" viewBox="0 0 46 82" fill="none" style={{ position: 'relative', zIndex: 2 }}>
          <rect x="2" y="2" width="42" height="78" rx="8"
            stroke="rgba(220,220,220,0.3)" strokeWidth="1.5" fill="rgba(14,14,14,0.85)" />
          {/* Screen */}
          <rect x="7" y="11" width="32" height="52" rx="4"
            fill="rgba(47,79,79,0.1)" stroke="rgba(47,79,79,0.25)" strokeWidth="0.5" />
          {/* NFC indicator on screen */}
          <motion.g
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
          >
            <circle cx="23" cy="37" r="7" stroke="rgba(47,79,79,0.8)" strokeWidth="1" fill="none" />
            <circle cx="23" cy="37" r="3.5" fill="rgba(47,79,79,0.6)" />
          </motion.g>
          {/* Home bar */}
          <rect x="17" y="70" width="12" height="2" rx="1" fill="rgba(220,220,220,0.15)" />
        </svg>
      </div>
    </div>
  );
}

// ── Step 3 Graphic: Stacked gift cards ────────────────────────────────────
function GiftCardsGraphic() {
  const cards = [
    { rotate: -9, translateY: 0, delay: 0 },
    { rotate: 1, translateY: -14, delay: 0.13 },
    { rotate: 11, translateY: -26, delay: 0.26 },
  ];

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      minHeight: 380,
    }}>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50, rotate: card.rotate - 10 }}
          whileInView={{ opacity: 1, y: card.translateY, rotate: card.rotate }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: EASE, delay: card.delay }}
          style={{
            position: 'absolute',
            width: 280,
            height: 168,
            borderRadius: 16,
            border: '1px solid rgba(47,79,79,0.6)',
            background: 'linear-gradient(135deg, rgba(12,12,12,0.97) 0%, rgba(26,26,26,0.92) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '14px 16px',
            boxShadow: '0 6px 28px rgba(0,0,0,0.65)',
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{
              fontSize: 8,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(47,79,79,1)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
            }}>
              GTA Marketing
            </span>
            <motion.span
              style={{ fontSize: 17, lineHeight: 1 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, delay: i * 0.5 }}
            >
              🎁
            </motion.span>
          </div>

          {/* Card details */}
          <div>
            <div style={{
              fontSize: 13,
              color: '#FFFFFF',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              marginBottom: 4,
              letterSpacing: '-0.01em',
            }}>
              Gift Card #{i + 1}
            </div>
            <div style={{
              fontSize: 9,
              color: 'rgba(220,220,220,0.38)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.4,
            }}>
              10% of monthly GTA profits
            </div>
          </div>

          {/* Decorative EMV chip */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            width: 26,
            height: 20,
            borderRadius: 4,
            border: '1px solid rgba(47,79,79,0.45)',
            background: 'rgba(47,79,79,0.12)',
          }} />
        </motion.div>
      ))}
    </div>
  );
}

// ── Thin rule between rows ─────────────────────────────────────────────────
function Rule() {
  return (
    <div style={{
      width: '100%',
      height: 1,
      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)',
    }} />
  );
}

// ── Single step row (alternating text / graphic) ───────────────────────────
interface RowProps {
  step: string;
  title: string;
  body: string;
  graphic: React.ReactNode;
  reverse?: boolean;
  graphicFlex?: number;
}

function StepRow({ step, title, body, graphic, reverse = false, graphicFlex = 1 }: RowProps) {
  const textBlock = (
    <motion.div
      initial={{ opacity: 0, x: reverse ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: EASE }}
      style={{ flex: 1, minWidth: 0 }}
    >
      <p style={{
        fontSize: 12,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: '#2F4F4F',
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        marginBottom: 12,
      }}>
        Step {step}
      </p>
      <h3 style={{
        fontSize: 'clamp(32px, 2.8vw, 40px)',
        fontWeight: 800,
        color: '#FFFFFF',
        fontFamily: 'Space Grotesk, Inter, sans-serif',
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        marginBottom: 16,
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: 17,
        color: 'rgba(220,220,220,0.48)',
        lineHeight: 1.75,
        fontWeight: 300,
        maxWidth: 460,
      }}>
        {body}
      </p>
    </motion.div>
  );

  const graphicBlock = (
    <motion.div
      initial={{ opacity: 0, x: reverse ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
      style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {graphic}
    </motion.div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 56,
      alignItems: 'stretch',
      flexWrap: 'wrap',
      minHeight: 480,
    }}>
      {/* text always order:1 on mobile so it appears above graphic regardless of reverse */}
      <div style={{ flex: 1, minWidth: 260, order: reverse ? 2 : 1, display: 'flex', alignItems: 'center' }}>{textBlock}</div>
      <div style={{ flex: graphicFlex, minWidth: 260, order: reverse ? 1 : 2, display: 'flex', flexDirection: 'column' }}>{graphicBlock}</div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function ConsumerSteps() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 72, width: '100%' }}>

      <StepRow
        step="01"
        title="Scan QR / NFC"
        body="Walk into any participating business and scan the QR code at the counter — or tap your phone on the NFC tag. That's all it takes to get on the map."
        graphic={<QRNFCGraphic />}
        reverse={false}
      />

      <Rule />

      <StepRow
        step="02"
        title="Browse the Map"
        body="Explore the live constellation of every local Markham business — real estate, dentists, restaurants, and more. Every bubble is a real partner you can vote for."
        graphic={
          <MiniConstellation
            radiusScale={0.52}
            containerStyle={{ aspectRatio: 'auto', width: '100%', height: '480px' }}
          />
        }
        reverse={true}
        graphicFlex={2}
      />

      <Rule />

      <StepRow
        step="03"
        title="Vote & Win"
        body="Cast your vote for a local business. Every month, 3 winners are selected — each receiving a gift card worth 10% of the GTA profits that month."
        graphic={<GiftCardsGraphic />}
        reverse={false}
      />

    </div>
  );
}
