'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Exact radii from ConstellationCanvas.tsx TIER_RADIUS constant
const TIERS = [
  {
    id: 'small',
    label: 'Small Node',
    price: '$10',
    period: '/mo',
    r: 38,          // matches TIER_RADIUS.small
    fill: 'rgba(18,18,18,0.92)',
    stroke: 'rgba(47,79,79,0.55)',
    strokeWidth: 1,
    glowStroke: 'rgba(47,79,79,0.12)',
    textColor: '#DCDCDC',
    features: [
      'Text-only listing',
      'Name, Address & Phone',
      '1 direct website link',
      'Nested Constellation placement',
    ],
    badge: '● Standard',
  },
  {
    id: 'medium',
    label: 'Medium Node',
    price: '$50',
    period: '/mo',
    r: 57,          // matches TIER_RADIUS.medium
    fill: 'rgba(18,18,18,0.92)',
    stroke: 'rgba(47,79,79,0.55)',
    strokeWidth: 1,
    glowStroke: 'rgba(47,79,79,0.12)',
    textColor: '#DCDCDC',
    features: [
      '1 featured image',
      '2 links (site + social)',
      'Monthly Impact Report',
      'Mid-sized Sector Bubble',
    ],
    badge: '◆ Featured',
  },
  {
    id: 'large',
    label: 'Large Node',
    price: '$75',
    period: '/mo',
    r: 82,         // matches TIER_RADIUS.large
    fill: 'rgba(28,28,28,0.96)',
    stroke: 'rgba(220,220,220,0.5)',
    strokeWidth: 1.5,
    glowStroke: 'rgba(220,220,220,0.1)',
    textColor: '#FFFFFF',
    features: [
      'Multi-image gallery',
      'Unlimited links',
      'Monthly Impact Report',
      'Dominant Anchor Node placement',
    ],
    badge: '★ Anchor',
  },
] as const;

type TierId = 'small' | 'medium' | 'large';

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 32 };

export default function TierBubbles() {
  const [selected, setSelected] = useState<TierId | null>(null);

  const selectedTier = TIERS.find(t => t.id === selected);

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-8">
      {/* Bubbles */}
      <div className="flex-shrink-0 flex items-end justify-center gap-6 lg:gap-10 px-4">
        {TIERS.map((tier) => {
          const isSelected = selected === tier.id;
          const isOther = selected !== null && !isSelected;
          const scaleFactor = isSelected ? 1.25 : isOther ? 0.78 : 1;
          const pad = 6;
          const svgW = tier.r * 2 + pad;
          const svgH = tier.r * 2 + pad;

          return (
            <motion.div
              key={tier.id}
              animate={{ scale: scaleFactor, opacity: isOther ? 0.55 : 1 }}
              transition={SPRING}
              className="flex flex-col items-center gap-3 cursor-pointer select-none"
              onClick={() => setSelected(isSelected ? null : tier.id)}
              title={`Click to explore ${tier.label}`}
            >
              <svg
                width={svgW}
                height={svgH}
                viewBox={`${-svgW / 2} ${-svgH / 2} ${svgW} ${svgH}`}
                overflow="visible"
              >
                {/* Glow ring */}
                <circle
                  r={tier.r + 14}
                  fill="none"
                  stroke={tier.glowStroke}
                  strokeWidth={tier.strokeWidth === 1.5 ? 1.5 : 0.7}
                />
                {/* Body */}
                <circle
                  r={tier.r}
                  fill={tier.fill}
                  stroke={isSelected ? 'rgba(220,220,220,0.85)' : tier.stroke}
                  strokeWidth={isSelected ? 2 : tier.strokeWidth}
                  style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                />
                {/* Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  y={-8}
                  fontSize={tier.r > 80 ? 13 : tier.r > 60 ? 11 : 9}
                  fill={tier.textColor}
                  fontFamily="Space Grotesk, Inter, sans-serif"
                  fontWeight={tier.id === 'large' ? '600' : '500'}
                  letterSpacing="0.3"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {tier.label}
                </text>
                {/* Price */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  y={tier.r > 80 ? 10 : 8}
                  fontSize={tier.r > 80 ? 18 : tier.r > 60 ? 14 : 11}
                  fill={tier.textColor}
                  fontFamily="Space Grotesk, Inter, sans-serif"
                  fontWeight="700"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {tier.price}
                  <tspan fontSize={tier.r > 80 ? 10 : 8} fontWeight="400" fill="rgba(220,220,220,0.5)">
                    {tier.period}
                  </tspan>
                </text>
                {/* Click hint when nothing selected */}
                {selected === null && (
                  <text
                    textAnchor="middle"
                    y={tier.r - 10}
                    fontSize={7}
                    fill="rgba(220,220,220,0.3)"
                    fontFamily="Inter, sans-serif"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    tap to explore
                  </text>
                )}
              </svg>
            </motion.div>
          );
        })}
      </div>

      {/* Info Panel */}
      <AnimatePresence mode="wait">
        {selectedTier && (
          <motion.div
            key={selectedTier.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="flex-1 min-w-0 p-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs tracking-widest uppercase text-[#2F4F4F] font-semibold font-display">
                  {selectedTier.badge}
                </span>
                <h3 className="text-white text-base font-bold font-display mt-0.5">
                  {selectedTier.label}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white font-display">{selectedTier.price}</span>
                <span className="text-white/40 text-xs">/month</span>
              </div>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-2 mb-3">
              {selectedTier.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F4F4F] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Size context */}
            <p className="text-xs text-white/30 leading-relaxed border-t border-white/5 pt-3">
              This is exactly how your node appears on the Live Constellation map —
              the size you see above matches what 40,000+ GTA residents will see.
            </p>
          </motion.div>
        )}

        {!selectedTier && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <p className="text-white/20 text-sm text-center font-light tracking-wide">
              Click a bubble to see<br />what's included at that tier
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
