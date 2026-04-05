'use client';

import HeroSection from '@/components/landing/HeroSection';
import HowItWorksStrip from '@/components/landing/HowItWorksStrip';
import BenefitCards from '@/components/landing/BenefitCards';
import MapEntrySection from '@/components/landing/MapEntrySection';
import TrustSection from '@/components/landing/TrustSection';
import BusinessCTABand from '@/components/landing/BusinessCTABand';
import FinalCTASection from '@/components/landing/FinalCTASection';

export default function GrowthEcosystem() {
  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{
        background: '#0C0C0E',
        scrollbarWidth: 'thin',
        scrollbarColor: '#2D5A4F #0C0C0E',
      }}
    >
      <HeroSection />
      <HowItWorksStrip />
      {/* Section nav */}
      <div style={{
        display: 'flex',
        gap: 16,
        padding: '32px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <a
          href="#for-consumers"
          style={{
            flex: 1,
            padding: '18px 24px',
            background: 'rgba(45,90,79,0.08)',
            border: '1px solid rgba(45,90,79,0.25)',
            borderRadius: 14,
            color: '#5A9E8F',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            textAlign: 'center' as const,
            cursor: 'pointer',
          }}
        >
          For Consumers →
        </a>
        <a
          href="#business-cta"
          style={{
            flex: 1,
            padding: '18px 24px',
            background: 'rgba(201,168,112,0.06)',
            border: '1px solid rgba(201,168,112,0.25)',
            borderRadius: 14,
            color: '#C9A870',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            textAlign: 'center' as const,
            cursor: 'pointer',
          }}
        >
          For Businesses →
        </a>
      </div>
      <BenefitCards />
      <MapEntrySection />
      <TrustSection />
      <BusinessCTABand />
      <FinalCTASection />
    </div>
  );
}
