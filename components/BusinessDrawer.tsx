'use client';

import { motion } from 'framer-motion';
import { Business } from '@/lib/supabaseClient';

type Props = {
  business: Business;
  onClose: () => void;
  onVote: () => void;
};

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 };

function tierLabel(tier: Business['tier']) {
  if (tier === 'large') return '★ Anchor';
  if (tier === 'medium') return '◆ Featured';
  return '● Standard';
}

function industryLabel(industryId: string) {
  const map: Record<string, string> = {
    'real-estate': 'Real Estate', 'restaurants': 'Restaurants', 'dentists': 'Dental',
    'finance': 'Finance', 'automotive': 'Automotive', 'fitness': 'Fitness',
    'legal': 'Legal', 'technology': 'Technology', 'retail': 'Retail',
    'healthcare': 'Healthcare', 'beauty': 'Beauty & Spa', 'construction': 'Construction',
    'education': 'Education', 'events': 'Events', 'media': 'Media',
    'insurance': 'Insurance', 'travel': 'Travel', 'logistics': 'Logistics',
    'pharma': 'Pharmacy', 'accounting': 'Accounting', 'architecture': 'Architecture',
    'childcare': 'Childcare', 'cleaning': 'Cleaning', 'crypto': 'Web3 / Crypto',
    'marketing': 'Marketing', 'photography': 'Photography', 'plumbing': 'Plumbing',
    'security': 'Security', 'veterinary': 'Veterinary', 'wedding': 'Weddings',
  };
  return map[industryId] ?? industryId;
}

export default function BusinessDrawer({ business, onClose, onVote }: Props) {
  const hasImage = business.images && business.images.length > 0;

  return (
    <motion.div
      initial={{ x: 48, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 48, opacity: 0 }}
      transition={SPRING}
      style={{
        position: 'absolute',
        right: 0, top: 0, bottom: 0,
        width: 380,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        background: '#141416',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(239,239,239,0.6)', fontSize: 16, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        ×
      </button>

      {/* Hero image / logo area */}
      <div style={{
        height: 160, flexShrink: 0, position: 'relative',
        background: hasImage
          ? `url(${business.images![0]}) center/cover no-repeat`
          : 'linear-gradient(135deg, #141416 0%, #1C1C1F 60%, #141416 100%)',
      }}>
        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
          background: 'linear-gradient(to bottom, transparent, #141416)',
        }} />
        {/* Business initial */}
        {!hasImage && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 64, fontWeight: 900, color: 'rgba(45,90,79,0.2)',
              fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1,
            }}>
              {business.name[0]}
            </span>
          </div>
        )}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 0' }}>

        {/* Category pill */}
        <span style={{
          display: 'inline-block',
          background: 'rgba(45,90,79,0.15)',
          border: '1px solid rgba(45,90,79,0.4)',
          color: '#5A9E8F',
          fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 700,
          borderRadius: 100, padding: '3px 10px',
          fontFamily: 'Space Grotesk, sans-serif',
        }}>
          {industryLabel(business.industry_id)}
        </span>

        {/* Business name */}
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: '#EFEFEF',
          fontFamily: 'Space Grotesk, sans-serif',
          letterSpacing: '-0.02em', lineHeight: 1.2,
          marginTop: 12, marginBottom: business.address ? 4 : 0,
        }}>
          {business.name}
        </h2>

        {/* Address */}
        {business.address && (
          <p style={{ fontSize: 12, color: 'rgba(239,239,239,0.35)', marginBottom: 0 }}>
            {business.address}
          </p>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '18px 0' }} />

        {/* Tagline */}
        {business.tagline && (
          <>
            <p style={{
              fontSize: 14, color: 'rgba(239,239,239,0.55)',
              lineHeight: 1.65, marginBottom: 18,
            }}>
              {business.tagline}
            </p>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 18 }} />
          </>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {/* Votes */}
          <div style={{
            flex: 1, background: '#1C1C1F',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#EFEFEF',
              fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
              {(business.vote_count ?? 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(239,239,239,0.35)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>
              Votes
            </div>
          </div>
          {/* Tier */}
          <div style={{
            flex: 1, background: '#1C1C1F',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#EFEFEF',
              fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.3 }}>
              {tierLabel(business.tier)}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(239,239,239,0.35)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>
              Tier
            </div>
          </div>
          {/* Trending */}
          <div style={{
            flex: 1, background: '#1C1C1F',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3,
              color: business.trending ? '#C9A870' : 'rgba(239,239,239,0.3)' }}>
              {business.trending ? '🔥 Trending' : '—'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(239,239,239,0.35)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>
              Status
            </div>
          </div>
        </div>

        {/* Offer callout */}
        {business.deal && (
          <>
            <div style={{
              background: 'rgba(201,168,112,0.05)',
              border: '1px solid rgba(201,168,112,0.22)',
              borderRadius: 12, padding: '14px 16px',
              marginBottom: 18,
            }}>
              <p style={{
                fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#C9A870', fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8,
              }}>
                EXCLUSIVE OFFER
              </p>
              <p style={{ fontSize: 13, color: '#EFEFEF', lineHeight: 1.6 }}>
                {business.deal}
              </p>
              {business.promo_code && (
                <div style={{
                  marginTop: 10, background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(201,168,112,0.25)',
                  borderRadius: 8, padding: '8px 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: 9, color: 'rgba(239,239,239,0.4)',
                      textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 2 }}>
                      Promo Code
                    </div>
                    <div style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700,
                      color: '#C9A870', letterSpacing: '0.12em' }}>
                      {business.promo_code}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Contact */}
        {(business.phone || business.address) && (
          <>
            <div style={{ marginBottom: 6 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(239,239,239,0.3)', marginBottom: 8,
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                Contact
              </p>
              {business.phone && (
                <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.55)',
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ opacity: 0.6 }}>📞</span> {business.phone}
                </p>
              )}
              {business.address && (
                <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.55)',
                  display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ opacity: 0.6, flexShrink: 0 }}>📍</span> {business.address}
                </p>
              )}
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />
          </>
        )}

        {/* Links */}
        {business.links && business.links.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {business.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                onClick={e => e.preventDefault()}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontSize: 13, color: 'rgba(239,239,239,0.55)',
                  textDecoration: 'none', cursor: 'pointer',
                }}
              >
                {link.label}
                <span style={{ opacity: 0.35, fontSize: 11 }}>→</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#141416',
        flexShrink: 0,
      }}>
        {/* Primary CTA */}
        <button
          onClick={onVote}
          style={{
            width: '100%', padding: '13px',
            background: '#EFEFEF', color: '#0C0C0E',
            fontWeight: 700, fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            marginBottom: 8,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,239,239,0.88)')}
          onMouseLeave={e => (e.currentTarget.style.background = '#EFEFEF')}
        >
          Support This Business →
        </button>

        {/* Secondary CTAs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {business.links?.[0] && (
            <a
              href={business.links[0].url}
              onClick={e => e.preventDefault()}
              style={{
                flex: 1, padding: '9px', textAlign: 'center',
                fontSize: 11, color: 'rgba(239,239,239,0.5)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 10, textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              Visit Website
            </a>
          )}
          {business.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1, padding: '9px', textAlign: 'center',
                fontSize: 11, color: 'rgba(239,239,239,0.5)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 10, textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              Directions
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
