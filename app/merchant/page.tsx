'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ImpactReport from '@/components/merchant/ImpactReport';
import UpsellModule from '@/components/merchant/UpsellModule';

export default function MerchantDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simple client side auth check
    const checkUser = async () => {
      // In MVP demo, if they directly route here, we let them view it to show the features,
      // but in production we'd enforce session:
      /*
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/merchant/login');
      } else {
        setLoading(false);
      }
      */
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white text-xs tracking-widest uppercase">Loading...</div>;

  const bgClass = isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#F5F5F7] text-gray-900';
  const headerClass = isDarkMode ? 'border-white/10 bg-black/50' : 'border-black/10 bg-white/50';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bgClass} font-sans`}>
      {/* Top Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${headerClass} px-8 py-4 flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-slate-dark to-[#00FFFF] flex items-center justify-center text-black font-bold select-none">
            P
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm">Pinnacle Realty Group</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50">Premium Tier Merchant</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`text-xs px-4 py-2 border rounded-full transition-colors ${
              isDarkMode ? 'border-white/20 hover:bg-white/10' : 'border-black/20 hover:bg-black/5'
            }`}
          >
            {isDarkMode ? '☀️ Utility View' : '🌙 Premium View'}
          </button>
          
          <button onClick={() => router.push('/merchant/login')} className="text-xs opacity-50 hover:opacity-100">
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Analytics */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <section>
            <h2 className={`text-xl font-display font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Impact Report
            </h2>
            <ImpactReport isDark={isDarkMode} />
          </section>

          {/* Gamification Progress */}
          <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0C0C0C] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
             <h3 className="text-sm font-semibold mb-2">Milestone Progress</h3>
             <p className={`text-xs mb-4 ${isDarkMode ? 'text-gainsboro/60' : 'text-gray-500'}`}>
                You are 75 votes away from unlocking the <strong>GTA Fan Favorite</strong> badge!
             </p>
             <div className="w-full h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 relative">
               <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-[#00FFFF]" style={{ width: '85%' }} />
             </div>
          </section>
        </div>

        {/* Right Col: Upsells */}
        <div className="col-span-1">
          <h2 className={`text-xl font-display font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Growth Hub
          </h2>
          <UpsellModule isDark={isDarkMode} />
        </div>

      </main>
    </div>
  );
}
