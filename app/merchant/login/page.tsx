'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function MerchantLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In a real scenario, this connects to Supabase auth.
    // For MVP demonstration, if email is 'demo@merchant.com' we bypass.
    if (email === 'demo@merchant.com' && password === 'demo123') {
      setTimeout(() => router.push('/merchant'), 500);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/merchant');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-dark/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-sm z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-white mb-2">Merchant Portal</h1>
          <p className="text-sm text-gainsboro/60">Sign in to manage your growth</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-[#0F0F0F] p-8 rounded-2xl border border-white/5 shadow-[0_0_40px_rgba(47,79,79,0.1)]">
          {error && <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{error}</div>}
          
          <div>
            <label className="block text-[10px] tracking-[0.2em] text-gainsboro/50 uppercase mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pinnacle.com"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-slate-dark transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-gainsboro/50 uppercase mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-slate-dark transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gainsboro transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div className="text-center mt-6">
             <p className="text-[10px] text-gainsboro/30">Demo Access: demo@merchant.com / demo123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
