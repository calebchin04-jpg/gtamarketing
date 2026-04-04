'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwitcherStore } from '@/lib/store';
import StepCards from '@/components/growth/StepCards';
import TierBubbles from '@/components/growth/TierBubbles';
import CircularEconomyFlow from '@/components/growth/CircularEconomyFlow';
import FoundingForm from '@/components/growth/FoundingForm';

type ActivePath = 'consumer' | 'business' | null;

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 30 };

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm tracking-[0.3em] uppercase text-[#2F4F4F] font-semibold font-display mb-3">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight mb-5">
      {children}
    </h2>
  );
}

function Divider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent my-[59px]" />
  );
}

export default function GrowthEcosystem() {
  const [activePath, setActivePath] = useState<ActivePath>(null);
  const consumerRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const { setActiveModule } = useSwitcherStore();

  const scrollTo = (path: ActivePath) => {
    setActivePath(path);
    setTimeout(() => {
      const target = path === 'consumer' ? consumerRef.current : businessRef.current;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div
      className="w-full h-full bg-[#0a0a0a] overflow-y-auto relative"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#2F4F4F #000' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(47,79,79,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(47,79,79,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
        }}
      />

      {/* Centered content column with consistent side padding */}
      <div
        className="relative z-10"
        style={{ padding: '0 28px 118px' }}
      >

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center gap-[50px] py-[84px]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm tracking-[0.4em] uppercase text-[#2F4F4F] font-semibold mb-5">
              GTA Marketing
            </p>
            <h1 className="text-5xl sm:text-6xl font-black text-white font-display tracking-tighter leading-none">
              Growth Ecosystem
            </h1>
            <p className="mt-5 text-white/40 text-lg font-light max-w-md mx-auto leading-relaxed">
              The first interactive map of Markham that actually pays people to support local.
            </p>
          </motion.div>

          {/* Dual entry buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-5 w-full max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Consumer button */}
            <motion.button
              onClick={() => scrollTo('consumer')}
              animate={{
                opacity: activePath === 'business' ? 0.38 : 1,
                borderColor: activePath === 'consumer' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)',
              }}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className="flex-1 flex flex-col items-center gap-3 px-8 py-9 rounded-2xl border bg-black/40
                         backdrop-blur-sm cursor-pointer group"
            >
              <span className="text-3xl">🗺️</span>
              <span className="text-white font-bold font-display text-xl tracking-tight">
                For Consumers
              </span>
              <span className="text-white/40 text-sm text-center leading-relaxed font-light">
                Discover local gems, vote for your favourites, and win real prizes.
              </span>
              <span className="mt-1 text-[#2F4F4F] text-xs font-semibold tracking-widest uppercase group-hover:text-white/60 transition-colors">
                See how it works →
              </span>
            </motion.button>

            {/* Business button */}
            <motion.button
              onClick={() => scrollTo('business')}
              animate={{
                opacity: activePath === 'consumer' ? 0.38 : 1,
                borderColor: activePath === 'business' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)',
              }}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className="flex-1 flex flex-col items-center gap-3 px-8 py-9 rounded-2xl border bg-black/40
                         backdrop-blur-sm cursor-pointer group"
            >
              <span className="text-3xl">📈</span>
              <span className="text-white font-bold font-display text-xl tracking-tight">
                For Businesses
              </span>
              <span className="text-white/40 text-sm text-center leading-relaxed font-light">
                Get found by 40,000 GTA residents and appear on the live map.
              </span>
              <span className="mt-1 text-[#2F4F4F] text-xs font-semibold tracking-widest uppercase group-hover:text-white/60 transition-colors">
                Grow your business →
              </span>
            </motion.button>
          </motion.div>

          {/* Scroll hint */}
          <AnimatePresence>
            {activePath && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-white/20 text-sm tracking-widest uppercase"
              >
                Scroll down ↓
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        {/* ── CONSUMER SECTION ─────────────────────────────────────────── */}
        <motion.section
          ref={consumerRef}
          id="consumer"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col gap-[50px] py-[34px] scroll-mt-4"
        >
          <div>
            <SectionLabel>For Consumers</SectionLabel>
            <SectionHeading>How it works for you</SectionHeading>
            <p className="text-white/50 text-base leading-relaxed max-w-xl">
              Three simple steps stand between you and discovering the best local businesses in Markham — plus winning real prizes for doing it.
            </p>
          </div>

          <StepCards />

          <Divider />

          {/* Circular economy — consumer */}
          <div>
            <SectionLabel>The Loop</SectionLabel>
            <SectionHeading>Your vote comes back to you</SectionHeading>
            <p className="text-white/50 text-base leading-relaxed max-w-xl mb-[42px]">
              This isn&apos;t a typical directory. 30% of every business subscription gets used to buy gift cards from those same businesses — then given away to voters like you.
            </p>
            <CircularEconomyFlow variant="consumer" />
          </div>

          {/* CTA to Live Hub */}
          <div className="flex justify-center pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              onClick={() => setActiveModule('liveHub')}
              className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-white/90 transition-colors"
            >
              Go Vote Now →
            </motion.button>
          </div>
        </motion.section>

        <Divider />

        {/* ── BUSINESS SECTION ─────────────────────────────────────────── */}
        <motion.section
          ref={businessRef}
          id="business"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col gap-[50px] py-[34px] scroll-mt-4"
        >
          <div>
            <SectionLabel>For Businesses</SectionLabel>
            <SectionHeading>Get found. Grow. Give back.</SectionHeading>
            <p className="text-white/50 text-base leading-relaxed max-w-xl">
              GTA Marketing isn&apos;t just another ad platform. Your subscription fuels a live map, drives real foot traffic, and comes back to your store as gift cards in customers&apos; hands.
            </p>
          </div>

          {/* Reach counter */}
          <ReachCounter />

          <Divider />

          {/* Tier bubbles */}
          <div>
            <SectionLabel>Choose Your Node</SectionLabel>
            <SectionHeading>Pick your size on the map</SectionHeading>
            <p className="text-white/50 text-base leading-relaxed max-w-xl mb-[42px]">
              These are the exact bubble sizes your business will appear as on the Live Constellation. Click one to see what&apos;s included.
            </p>
            <TierBubbles />
          </div>

          <Divider />

          {/* Circular economy — business */}
          <div>
            <SectionLabel>The Loop</SectionLabel>
            <SectionHeading>Your money stays local</SectionHeading>
            <p className="text-white/50 text-base leading-relaxed max-w-xl mb-[42px]">
              Unlike traditional agencies that pocket your spend, we reinvest directly back into the local economy — including back into your own store.
            </p>
            <CircularEconomyFlow variant="business" />
          </div>

          <Divider />

          {/* Founding 30 */}
          <div className="flex flex-col gap-8">
            {/* Urgency banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-5 p-6 rounded-2xl border border-white/10 bg-black/50"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse flex-shrink-0" />
              <div>
                <p className="text-white font-bold font-display text-base">
                  Founding 30 — Limited Spots
                </p>
                <p className="text-white/40 text-sm mt-1 leading-relaxed">
                  The first 30 businesses to sign on get 2 months free + 50% off their tier for life.
                  Once these spots are gone, they&apos;re gone.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <div>
              <SectionLabel>Apply Now</SectionLabel>
              <SectionHeading>Claim your founding spot</SectionHeading>
              <p className="text-white/50 text-base leading-relaxed max-w-xl mb-[42px]">
                Any business or sole proprietorship with a physical GTA location can apply.
                No payment now — we&apos;ll confirm your spot first.
              </p>
              <FoundingForm />
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

// ── Reach counter ──────────────────────────────────────────────────────────
function ReachCounter() {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-5"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {[
        { value: '10,000', label: 'Physical Flyers', sub: 'Distributed across GTA' },
        { value: '40,000', label: 'Households', sub: 'Estimated reach' },
        { value: '1 per', label: 'Industry', sub: 'Flyer exclusivity' },
        { value: '~400', label: 'New Customers', sub: 'At 1% conversion' },
      ].map((stat) => (
        <motion.div
          key={stat.label}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
          }}
          className="flex flex-col gap-2 p-6 rounded-2xl border border-white/8 bg-black/40"
        >
          <span className="text-3xl font-black text-white font-display">{stat.value}</span>
          <span className="text-sm font-semibold text-white/70">{stat.label}</span>
          <span className="text-sm text-white/30 font-light">{stat.sub}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
