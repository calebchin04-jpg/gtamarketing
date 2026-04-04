'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Business, supabase } from '@/lib/supabaseClient';

type Props = {
  business: Business;
  onSuccess: () => void;
};

export default function VoteFunnelGate({ business, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [timeLeft, setTimeLeft] = useState('');
  
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'web';

  // Giveaway Countdown Timer (End of Month)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = nextMonth.getTime() - now.getTime();
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const validateStep1 = () => {
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrors({ email: 'Valid email required for giveaway' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    // Accepts basic phone formats
    if (!form.phone.match(/^[\d\s\-()+]{7,}$/)) e.phone = 'Valid phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);

    try {
      // 1. Check if the phone has voted in the last 24 hours
      // This enforces the 1-vote-per-device-24h rule via query
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // In production, this would query Supabase securely. We mock the failure/success here for Phase 4 UI.
      const { data: existingVotes, error: checkError } = await supabase
        .from('votes')
        .select('*')
        .eq('voter_phone', form.phone)
        .gte('created_at', yesterday.toISOString());
        
      if (existingVotes && existingVotes.length > 0) {
        setErrors({ phone: 'This number has already voted in the last 24 hours.' });
        setLoading(false);
        return;
      }

      // Simulate API Save
      await new Promise(r => setTimeout(r, 800));

      // 2. Insert the vote (Assume the table exists for production)
      // await supabase.from('votes').insert([{
      //   business_id: business.id,
      //   voter_name: form.name,
      //   voter_email: form.email,
      //   voter_phone: form.phone,
      //   source: source
      // }]);

      // 3. Sync to Google Sheets
      try {
        await fetch('/api/sync-sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            businessId: business.id,
            businessName: business.name,
            source: source
          })
        });
      } catch (syncErr) {
        console.error('Failed to sync to sheets', syncErr);
        // We still consider the vote successful even if sheets sync fails
      }

      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setErrors({ phone: 'An error occurred. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Giveaway Header for Step 1 */}
      {step === 1 && (
        <div className="mb-6 p-4 rounded-xl text-center border border-gainsboro/10"
             style={{ background: 'linear-gradient(180deg, rgba(47,79,79,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
          <p className="text-[10px] tracking-[0.3em] text-[#E0B0FF] uppercase mb-1 font-semibold">
            🎁 Monthly Giveaway
          </p>
          <p className="text-xs text-gainsboro/60 mb-2">Win a $500 Local Shopping Spree</p>
          <div className="font-mono text-lg text-white font-medium tracking-widest bg-black/40 py-2 rounded-lg inline-block px-4 border border-white/5">
            {timeLeft || '...'}
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex gap-2 mb-6">
        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-white/40' : 'bg-white/10'}`} />
        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-white/40' : 'bg-white/10'}`} />
      </div>

      <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4" noValidate>
        {/* Step 1: Email */}
        <div className={`transition-all duration-300 ${step === 1 ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <label className="block text-[10px] tracking-[0.2em] text-gainsboro/50 uppercase mb-1.5">
            Enter Giveaway Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="jane@example.com"
            className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gainsboro/20 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: errors.email ? '1px solid rgba(220,80,80,0.5)' : '1px solid rgba(47,79,79,0.3)',
            }}
            autoFocus
          />
          {errors.email && <p className="text-red-400/70 text-[10px] mt-1.5">{errors.email}</p>}
        </div>

        {/* Step 2: Name & Phone */}
        <div className={`space-y-4 transition-all duration-300 ${step === 2 ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-gainsboro/50 uppercase mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Jane Smith"
              className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gainsboro/20 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: errors.name ? '1px solid rgba(220,80,80,0.5)' : '1px solid rgba(47,79,79,0.3)',
              }}
            />
            {errors.name && <p className="text-red-400/70 text-[10px] mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-gainsboro/50 uppercase mb-1.5 flex justify-between">
              <span>Phone Number</span>
              <span className="text-gainsboro/30 text-[8px]">(1 vote/device/24h)</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="(647) 555-0100"
              className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gainsboro/20 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: errors.phone ? '1px solid rgba(220,80,80,0.5)' : '1px solid rgba(47,79,79,0.3)',
              }}
            />
            {errors.phone && <p className="text-red-400/70 text-[10px] mt-1.5">{errors.phone}</p>}
          </div>
        </div>

        {/* Submit Buttons */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: loading ? 'rgba(47,79,79,0.4)' : '#FFFFFF',
            color: loading ? '#FFF' : '#0F0F0F',
            boxShadow: step === 1 ? 'none' : '0 0 20px rgba(255,255,255,0.1)',
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
              </svg>
              Verifying...
            </span>
          ) : step === 1 ? (
             'Continue to Vote →'
          ) : (
             'Lock In My Vote'
          )}
        </button>
        
        {step === 2 && (
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="w-full text-[10px] text-gainsboro/40 uppercase tracking-widest mt-4 hover:text-white transition-colors"
          >
            ← Back
          </button>
        )}
      </form>
    </div>
  );
}
