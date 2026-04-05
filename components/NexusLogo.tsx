'use client';

import { motion } from 'framer-motion';
import { useSwitcherStore } from '@/lib/store';
import { audio } from '@/lib/audio';

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
      style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
      data-cursor="SWITCH"
      onClick={handleClick}
    >
      <div className="cursor-pointer group">
        {/* Eyebrow label */}
        <motion.span
          className="block text-[10px] tracking-[0.4em] uppercase font-light"
          animate={{
            color: isSwitcherOpen ? 'rgba(255,255,255,0.7)' : 'rgba(239,239,239,0.35)',
          }}
          transition={{ duration: 0.35 }}
        >
          GTA
        </motion.span>

        {/* Main wordmark */}
        <motion.h1
          className="text-lg font-bold font-display leading-none tracking-wide"
          animate={{
            color: '#FFFFFF',
            opacity: isSwitcherOpen ? 0.9 : 0.85,
          }}
          transition={{ duration: 0.35 }}
        >
          MARKETING
        </motion.h1>

        {/* Mode indicator pill */}
        <motion.div
          className="mt-1.5 flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSwitcherOpen ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[8px] tracking-[0.35em] text-white/50 uppercase">
            Switch View
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
