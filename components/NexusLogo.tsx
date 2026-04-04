'use client';

import { motion } from 'framer-motion';
import { useSwitcherStore } from '@/lib/store';
import { audio } from '@/lib/audio';

/**
 * NexusLogo — Global floating trigger for the Overview Mode switcher.
 *
 * Lives at the top of the DOM tree (rendered in page.tsx), above both
 * world cards. Always visible, always interactive (z-[200]).
 *
 * - Click → toggleSwitcher() → phase transitions to 'switching'
 * - The logo subtly morphs when switcher is open to signal "exit overview"
 */
export default function NexusLogo() {
  const { isSwitcherOpen, phase, activeModule, setSwitcherOpen, setActiveModule } = useSwitcherStore();

  const isDisabled = phase === 'switching';

  const handleClick = () => {
    if (isDisabled) return;
    audio.playChirp();
    const target = activeModule === 'liveHub' ? 'growthEcosystem' : 'liveHub';
    setSwitcherOpen(true);
    setTimeout(() => {
      audio.playThud();
      setActiveModule(target);
    }, 700);
  };

  return (
    <motion.div
      className="fixed top-0 left-0 z-[200] px-8 py-5 select-none"
      // Disable pointer events during transitions to prevent race conditions
      style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
      data-cursor="SWITCH"
      onClick={handleClick}
    >
      <div className="cursor-pointer group">
        {/* Eyebrow label */}
        <motion.span
          className="block text-[10px] tracking-[0.4em] uppercase font-light"
          animate={{
            color: isSwitcherOpen ? 'rgba(0,255,255,0.7)' : 'rgba(220,220,220,0.4)',
          }}
          transition={{ duration: 0.35 }}
        >
          GTA
        </motion.span>

        {/* Main wordmark */}
        <motion.h1
          className="text-lg font-bold font-display leading-none tracking-wide"
          animate={{
            color: isSwitcherOpen ? '#00FFFF' : '#FFFFFF',
          }}
          transition={{ duration: 0.35 }}
        >
          MARKETING HUB
        </motion.h1>

        {/* Mode indicator pill — fades in/out */}
        <motion.div
          className="mt-1.5 flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSwitcherOpen ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFFF] animate-pulse" />
          <span className="text-[8px] tracking-[0.35em] text-[#00FFFF]/60 uppercase">
            Overview Mode
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
