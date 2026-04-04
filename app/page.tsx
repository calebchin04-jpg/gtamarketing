'use client';

import NexusSwitcher from '@/components/NexusSwitcher';
import NexusLogo from '@/components/NexusLogo';
import MergedCursor from '@/components/MergedCursor';

export default function Home() {
  return (
    /**
     * z-index stack (back → front):
     *   NexusSwitcher  z-0–z-30  (background, blur overlay, world cards)
     *   NexusLogo      z-200     (global floating trigger, always on top of cards)
     *   MergedCursor   z-9990–9999 (ambient glow, ring, difference dot)
     */
    <main className="relative w-full h-screen overflow-hidden" style={{ cursor: 'none' }}>
      {/* World switcher — contains background + both live card worlds */}
      <NexusSwitcher />

      {/* Global floating logo trigger — above all card content */}
      <NexusLogo />

      {/* Merged cursor — three-layer system at the very top of the stack */}
      <MergedCursor />
    </main>
  );
}
