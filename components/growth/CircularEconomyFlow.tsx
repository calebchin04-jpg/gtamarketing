'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Variant = 'consumer' | 'business';

const CONSUMER_NODES = [
  { id: 'vote', label: 'Your Vote', sub: 'Scan & submit' },
  { id: 'pool', label: 'Gift Card Pool', sub: '30% of profits' },
  { id: 'you', label: 'Back to You', sub: 'Win prizes + deals' },
];

const BUSINESS_NODES = [
  { id: 'sub', label: 'Your Subscription', sub: '$10 – $75/mo' },
  { id: 'cards', label: '30% → Gift Cards', sub: 'Bought from your store' },
  { id: 'grants', label: '10% → Grants', sub: '0% loans + events' },
];

export default function CircularEconomyFlow({ variant }: { variant: Variant }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const nodes = variant === 'consumer' ? CONSUMER_NODES : BUSINESS_NODES;

  const W = 800;
  const H = 180;
  const nodeR = 64;
  const positions = [
    { x: nodeR + 28, y: H / 2 },
    { x: W / 2, y: H / 2 },
    { x: W - nodeR - 28, y: H / 2 },
  ];

  return (
    <div ref={ref} className="w-full flex flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker id={`arrow-${variant}`} markerWidth="12" markerHeight="12" refX="9" refY="4.5" orient="auto">
            <path d="M0,0 L0,9 L12,4.5 z" fill="rgba(47,79,79,0.8)" />
          </marker>
        </defs>

        {/* Paths between nodes */}
        {positions.slice(0, 2).map((pos, i) => {
          const next = positions[i + 1];
          const x1 = pos.x + nodeR + 4;
          const x2 = next.x - nodeR - 4;
          const y = H / 2;
          const len = x2 - x1;
          return (
            <motion.path
              key={i}
              d={`M ${x1} ${y} L ${x2} ${y}`}
              stroke="rgba(47,79,79,0.6)"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${len} ${len}`}
              strokeDashoffset={len}
              markerEnd={`url(#arrow-${variant})`}
              animate={inView ? { strokeDashoffset: 0, opacity: 1 } : { strokeDashoffset: len, opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.3 + i * 0.4 }}
            />
          );
        })}

        {/* Loop arrow back — consumer variant only */}
        {variant === 'consumer' && (
          <motion.path
            d={`M ${positions[2].x} ${H / 2 - nodeR - 4}
                C ${positions[2].x} ${-30}, ${positions[0].x} ${-30},
                  ${positions[0].x} ${H / 2 - nodeR - 4}`}
            stroke="rgba(47,79,79,0.35)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 4"
            markerEnd={`url(#arrow-${variant})`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          />
        )}

        {/* Nodes */}
        {positions.map((pos, i) => {
          const node = nodes[i];
          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: i * 0.2 }}
            >
              {/* Glow ring */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeR + 8}
                fill="none"
                stroke={i === 1 ? 'rgba(47,79,79,0.18)' : 'rgba(47,79,79,0.08)'}
                strokeWidth="0.7"
              />
              {/* Body */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeR}
                fill="rgba(18,18,18,0.94)"
                stroke={i === 2 ? 'rgba(220,220,220,0.4)' : 'rgba(47,79,79,0.55)'}
                strokeWidth={i === 2 ? 1.5 : 1}
              />
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y - 10}
                textAnchor="middle"
                fontSize="13"
                fill="#FFFFFF"
                fontFamily="Space Grotesk, sans-serif"
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {node.label}
              </text>
              <text
                x={pos.x}
                y={pos.y + 12}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(220,220,220,0.45)"
                fontFamily="Inter, sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {node.sub}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Caption */}
      <p className="text-center text-white/40 text-xs leading-relaxed max-w-sm">
        {variant === 'consumer'
          ? 'Every vote you cast enters you into the monthly giveaway. 30% of every business subscription goes into the gift card pool — given to voters like you.'
          : 'Your subscription powers the ecosystem. 30% comes back to your store as gift cards handed to voters. 10% funds the next generation of GTA entrepreneurs.'}
      </p>
    </div>
  );
}
