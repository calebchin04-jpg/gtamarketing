'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Scan the QR',
    body: 'Find a GTA Marketing flyer anywhere across Markham. Every flyer has a QR code that brings you straight to the Live Hub.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Browse the Map',
    body: 'Explore an interactive constellation of every local Markham business — real estate, dentists, restaurants, and more — all on one live map.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="3" x2="12" y2="9" />
        <line x1="12" y1="15" x2="12" y2="21" />
        <line x1="3" y1="12" x2="9" y2="12" />
        <line x1="15" y1="12" x2="21" y2="12" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Vote & Win',
    body: 'Cast your vote for a local business. Every vote enters you into the monthly $100 giveaway — and instantly unlocks an exclusive deal from that business.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function StepCards() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {STEPS.map((step) => (
        <motion.div
          key={step.number}
          variants={card}
          className="relative flex flex-col gap-4 p-6 rounded-2xl border border-white/8 bg-black/40 backdrop-blur-sm overflow-hidden group"
        >
          {/* Number watermark */}
          <span className="absolute top-4 right-5 text-6xl font-black text-white/4 select-none font-display leading-none">
            {step.number}
          </span>

          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-[#2F4F4F]/20 border border-[#2F4F4F]/40 flex items-center justify-center text-[#DCDCDC]/70 group-hover:text-white group-hover:border-[#2F4F4F]/80 transition-colors duration-300">
            {step.icon}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-semibold text-lg font-display tracking-tight">
              {step.title}
            </h3>
            <p className="text-white/50 text-base leading-relaxed font-light">
              {step.body}
            </p>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[#2F4F4F] to-transparent group-hover:w-full transition-all duration-500" />
        </motion.div>
      ))}
    </motion.div>
  );
}
