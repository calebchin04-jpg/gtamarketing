'use client';

import dynamic from 'next/dynamic';
import { INDUSTRIES } from '@/lib/mockData';
import { CSSProperties } from 'react';

const ConstellationCanvas = dynamic(() => import('@/components/ConstellationCanvas'), { ssr: false });

interface MiniConstellationProps {
  containerStyle?: CSSProperties;
  radiusScale?: number;
}

export default function MiniConstellation({ containerStyle, radiusScale = 1 }: MiniConstellationProps = {}) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-white/8"
      style={{ aspectRatio: '1 / 1', ...containerStyle }}
    >
      {/* Vignette overlay so it looks contained */}
      <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
        style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.85)' }} />

      <ConstellationCanvas
        industries={INDUSTRIES}
        onBusinessSelect={() => {}}
        readOnly
        compact
        radiusScale={radiusScale}
      />

      {/* Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <p className="text-xs tracking-[0.25em] text-white/30 uppercase whitespace-nowrap">
          Live Constellation — your vote moves it
        </p>
      </div>
    </div>
  );
}
