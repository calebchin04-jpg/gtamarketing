'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import VotingModal from '@/components/VotingModal';
import BusinessDrawer from '@/components/BusinessDrawer';
import OnboardingToast from '@/components/OnboardingToast';
import { Business } from '@/lib/supabaseClient';
import { INDUSTRIES } from '@/lib/mockData';

const ConstellationCanvas = dynamic(
  () => import('@/components/ConstellationCanvas'),
  { ssr: false }
);

export default function LiveHub() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [votingBusiness, setVotingBusiness] = useState<Business | null>(null);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-3xl border border-white/10"
      style={{ background: '#0C0C0E' }}
    >
      {/* Canvas */}
      <div className="absolute inset-0 z-10">
        <ConstellationCanvas
          industries={INDUSTRIES}
          onBusinessSelect={setSelectedBusiness}
          selectedId={selectedBusiness?.id}
        />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-end px-8 py-5 pointer-events-none">
        <div className="text-right">
          <p style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(239,239,239,0.18)', textTransform: 'uppercase' }}>
            Markham · Live
          </p>
          <p style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(239,239,239,0.12)', textTransform: 'uppercase' }}>
            Circular Constellation
          </p>
        </div>
      </header>

      {/* Footer hint */}
      <footer className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <p style={{ fontSize: 9, letterSpacing: '0.35em', color: 'rgba(239,239,239,0.1)', textTransform: 'uppercase' }}>
          Click an industry to explore
        </p>
      </footer>

      {/* Onboarding toast — shown once on first visit */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <OnboardingToast />
      </div>

      {/* Business drawer */}
      <AnimatePresence>
        {selectedBusiness && !votingBusiness && (
          <BusinessDrawer
            business={selectedBusiness}
            onClose={() => setSelectedBusiness(null)}
            onVote={() => setVotingBusiness(selectedBusiness)}
          />
        )}
      </AnimatePresence>

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
