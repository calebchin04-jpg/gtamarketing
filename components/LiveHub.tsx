'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import VotingModal from '@/components/VotingModal';
import { Business } from '@/lib/supabaseClient';
import { INDUSTRIES } from '@/lib/mockData';

// D3 component must be client-only — disable SSR
const ConstellationCanvas = dynamic(
  () => import('@/components/ConstellationCanvas'),
  { ssr: false }
);

export default function LiveHub() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [votingBusiness, setVotingBusiness] = useState<Business | null>(null);

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleVoteOpen = () => {
    if (selectedBusiness) setVotingBusiness(selectedBusiness);
  };

  return (
    <div className="relative w-full h-full bg-jet flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      {/* Hero Section: D3 Constellation */}
      <section className="relative w-full h-full shrink-0 overflow-hidden">
        {/* Header — branding only, trigger removed (see NexusLogo.tsx) */}
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-end px-8 py-5 pointer-events-none">
          <div className="text-right">
            <p className="text-[9px] tracking-[0.3em] text-gainsboro/25 uppercase">The Local Economy</p>
            <p className="text-[9px] tracking-[0.3em] text-gainsboro/20 uppercase">Circular Constellation</p>
          </div>
        </header>

        {/* Canvas */}
        <div className="absolute inset-0 z-10">
          <ConstellationCanvas
            industries={INDUSTRIES}
            onBusinessSelect={handleBusinessSelect}
          />
        </div>

        {/* Footer hint */}
        <footer className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <p className="text-[9px] tracking-[0.35em] text-gainsboro/15 uppercase">
            Click an industry to explore · Drag down to switch
          </p>
        </footer>

        {/* Hall of Fame - Midnight Flip Winner */}
        <div className="absolute bottom-8 left-8 z-30 pointer-events-none">
          <div className="flex flex-col gap-2">
            <p className="text-[9px] tracking-[0.3em] text-[#E0B0FF] uppercase font-bold drop-shadow-md">
              🏆 Hall of Fame
            </p>
            <div
              className="flex items-center gap-4 p-4 rounded-xl border border-[#E0B0FF]/40 bg-black/60 shadow-[0_0_20px_rgba(224,176,255,0.15)] backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-full bg-slate-dark/50 flex items-center justify-center border border-[#E0B0FF]/30 text-xs text-center text-[#E0B0FF]/70">
                Logo
              </div>
              <div>
                <p className="text-white font-display text-sm font-semibold">Pinnacle Realty Group</p>
                <p className="text-[10px] text-gainsboro/50 tracking-wide uppercase mt-1">Yesterday&apos;s Winner • 347 Votes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business side panel */}
      {selectedBusiness && !votingBusiness && (
        <div
          className="absolute right-0 top-0 bottom-0 w-80 z-30 animate-slide-in flex flex-col"
          style={{
            background: 'rgba(5,5,5,0.97)',
            borderLeft: '1px solid rgba(47,79,79,0.3)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Close */}
          <button
            onClick={() => setSelectedBusiness(null)}
            className="absolute top-4 right-4 text-gainsboro/30 hover:text-white transition-colors text-lg"
          >
            ×
          </button>

          <div className="flex-1 overflow-y-auto p-6 pt-10">
            {/* Tier badge */}
            <div className="mb-4">
              <span
                className="inline-block text-[9px] tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: selectedBusiness.tier === 'large'
                    ? 'rgba(220,220,220,0.1)' : 'rgba(47,79,79,0.2)',
                  border: `1px solid ${selectedBusiness.tier === 'large' ? 'rgba(220,220,220,0.3)' : 'rgba(47,79,79,0.4)'}`,
                  color: selectedBusiness.tier === 'large' ? '#DCDCDC' : 'rgba(220,220,220,0.5)',
                }}
              >
                {selectedBusiness.tier === 'large' ? '★ Anchor' : selectedBusiness.tier === 'medium' ? '◆ Featured' : '● Standard'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white font-display mb-1">{selectedBusiness.name}</h2>
            {selectedBusiness.tagline && (
              <p className="text-sm text-gainsboro/50 leading-relaxed mb-5">{selectedBusiness.tagline}</p>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-slate-dark to-transparent mb-5" />

            {/* Info */}
            {(selectedBusiness.address || selectedBusiness.phone) && (
              <div className="mb-5 space-y-2">
                {selectedBusiness.address && (
                  <p className="text-xs text-gainsboro/40 flex gap-2">
                    <span>📍</span><span>{selectedBusiness.address}</span>
                  </p>
                )}
                {selectedBusiness.phone && (
                  <p className="text-xs text-gainsboro/40 flex gap-2">
                    <span>📞</span><span>{selectedBusiness.phone}</span>
                  </p>
                )}
              </div>
            )}

            {/* Links */}
            {selectedBusiness.links && selectedBusiness.links.length > 0 && (
              <div className="mb-5 space-y-2">
                {selectedBusiness.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-xs text-gainsboro/60 hover:text-white transition-all group"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(47,79,79,0.2)' }}
                    onClick={e => e.preventDefault()}
                  >
                    {link.label}
                    <span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                ))}
              </div>
            )}

            {/* Vote count */}
            {selectedBusiness.vote_count !== undefined && (
              <div className="mb-5">
                <p className="text-[10px] tracking-[0.2em] text-gainsboro/25 uppercase mb-1">Community Votes</p>
                <p className="text-2xl font-bold text-white font-display">{selectedBusiness.vote_count.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Vote CTA */}
          <div className="p-6 border-t border-gainsboro/5">
            <button
              onClick={handleVoteOpen}
              className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-100"
              style={{
                background: 'rgba(47,79,79,0.85)',
                border: '1px solid rgba(47,79,79,0.9)',
                color: '#FFFFFF',
                boxShadow: '0 0 20px rgba(47,79,79,0.25)',
              }}
            >
              → Vote & Unlock Deal
            </button>
          </div>
        </div>
      )}

      {/* Voting Modal */}
      {votingBusiness && (
        <VotingModal
          business={votingBusiness}
          onClose={() => {
            setVotingBusiness(null);
            setSelectedBusiness(null);
          }}
        />
      )}
    </div>
  );
}
