'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tier = 'small' | 'medium' | 'large';

const TIER_LABELS: Record<Tier, string> = {
  small: 'Small — $10/mo',
  medium: 'Medium — $50/mo',
  large: 'Large — $75/mo',
};

export default function FoundingForm() {
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '' });
  const [tier, setTier] = useState<Tier | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tier) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          businessName: form.business,
          businessId: 'founding-30',
          source: `founding-30-${tier}`,
        }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#2F4F4F]/80 focus:bg-black/80 transition-colors duration-200';

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-[#2F4F4F]/40 bg-black/60 text-center"
          >
            {/* Checkmark */}
            <div className="w-12 h-12 rounded-full border border-[#2F4F4F]/60 bg-[#2F4F4F]/10 flex items-center justify-center text-white text-xl">
              ✓
            </div>
            <h3 className="text-white font-bold font-display text-lg">You&apos;re on the list.</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              We&apos;ll reach out within 24 hours to lock in your Founding 30 spot.
              <br />Welcome to the ecosystem.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="business"
                type="text"
                placeholder="Business Name"
                required
                value={form.business}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                required
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Tier selection */}
            <div className="flex flex-col gap-2">
              <p className="text-xs tracking-widest uppercase text-white/30 font-semibold">
                Choose your tier
              </p>
              <div className="flex gap-2 flex-wrap">
                {(Object.entries(TIER_LABELS) as [Tier, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTier(id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                      tier === id
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-white/50 border-white/15 hover:border-white/30 hover:text-white/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {status === 'error' && (
              <p className="text-xs text-red-400/80">Something went wrong — please try again.</p>
            )}

            <motion.button
              type="submit"
              disabled={!tier || status === 'loading'}
              whileHover={{ scale: tier ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              animate={tier && status === 'idle' ? {
                boxShadow: [
                  '0 0 0px rgba(255,255,255,0)',
                  '0 0 22px rgba(255,255,255,0.22)',
                  '0 0 0px rgba(255,255,255,0)',
                ],
              } : {}}
              transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-base
                         hover:bg-white/95 transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl"
              style={{ fontSize: 15, letterSpacing: '0.18em' }}
            >
              {status === 'loading' ? 'Submitting…' : '⚡ Apply for Founding 30 →'}
            </motion.button>

            <p className="text-center text-white/20 text-xs">
              No payment required now. We&apos;ll confirm your spot first.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
