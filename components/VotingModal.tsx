'use client';

import { useState } from 'react';
import { Business } from '@/lib/supabaseClient';
import { X } from 'lucide-react';
import VoteFunnelGate from './VoteFunnelGate';

type Props = {
  business: Business;
  onClose: () => void;
};

type Stage = 'vote' | 'success';

export default function VotingModal({ business, onClose }: Props) {
  const [stage, setStage] = useState<Stage>('vote');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md animate-fade-in rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0f0f0f 0%, #111111 100%)',
          border: '1px solid rgba(47,79,79,0.4)',
          boxShadow: '0 0 60px rgba(47,79,79,0.15), 0 40px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gainsboro/40 hover:text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        {stage === 'vote' && (
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.35em] text-gainsboro/40 uppercase mb-2">Cast Your Vote</p>
              <h2 className="text-xl font-semibold text-white font-display leading-tight">{business.name}</h2>
              <p className="text-sm text-gainsboro/50 mt-1">{business.tagline}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-dark to-transparent mb-6" />

            <VoteFunnelGate business={business} onSuccess={() => setStage('success')} />
          </div>
        )}

        {stage === 'success' && (
          <div className="p-8 text-center animate-fade-in">
            {/* Success badge */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(47,79,79,0.25)', border: '1px solid rgba(47,79,79,0.6)' }}
            >
              <span className="text-3xl">✓</span>
            </div>

            <p className="text-[10px] tracking-[0.35em] text-gainsboro/40 uppercase mb-1">Vote Counted!</p>
            <h2 className="text-lg font-semibold text-white font-display mb-4">You&apos;re in the Giveaway</h2>

            {/* Unlockable Deal (Glassmorphism) */}
            {business.deal && (
              <div
                className="rounded-xl p-6 mb-6 text-left relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: 'inset 0 0 30px rgba(255,255,255,0.02)'
                }}
              >
                {/* Subtle gradient flash in bg */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 blur-[50px] rounded-full mix-blend-screen pointer-events-none" />
                
                <p className="text-[9px] tracking-[0.3em] text-[#E0B0FF] uppercase mb-3 font-semibold">
                  🔓 Unlocked Deal
                </p>
                <p className={`text-sm text-white leading-relaxed ${business.promo_code ? 'mb-4' : ''}`}>{business.deal}</p>
                
                {business.promo_code && (
                  <div className="bg-black/40 border border-[#E0B0FF]/30 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gainsboro/60 uppercase tracking-widest mb-1">Promo Code</p>
                      <p className="text-white font-mono text-lg font-bold tracking-widest">{business.promo_code}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gainsboro/40 mb-8">
              Show this screen in-store to redeem your exclusive deal.
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 w-full rounded-xl text-xs font-bold uppercase tracking-widest text-[#0F0F0F] bg-white hover:bg-gainsboro transition-all"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
