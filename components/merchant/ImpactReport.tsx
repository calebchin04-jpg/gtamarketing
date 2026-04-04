'use client';

type Props = {
  isDark: boolean;
};

export default function ImpactReport({ isDark }: Props) {
  const cardClass = isDark ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-black/5 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gainsboro/60' : 'text-gray-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Stat 1 */}
      <div className={`p-6 rounded-2xl border ${cardClass}`}>
        <p className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${textSecondary}`}>Total Impressions</p>
        <p className={`text-4xl font-display font-bold ${textPrimary}`}>14,208</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">+12%</span>
          <span className={`text-[10px] ${textSecondary}`}>vs last month</span>
        </div>
      </div>

      {/* Stat 2 */}
      <div className={`p-6 rounded-2xl border ${cardClass}`}>
        <p className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${textSecondary}`}>Verified Votes</p>
        <p className={`text-4xl font-display font-bold ${textPrimary}`}>347</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">+45%</span>
          <span className={`text-[10px] ${textSecondary}`}>Trending Phase Active</span>
        </div>
      </div>

      {/* Stat 3 */}
      <div className={`p-6 rounded-2xl border ${cardClass} relative overflow-hidden`}>
         {/* Subtle promo glow */}
         <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#E0B0FF] opacity-10 blur-[40px] pointer-events-none" />
         
        <p className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${textSecondary}`}>Leads Captured</p>
        <p className={`text-4xl font-display font-bold ${textPrimary}`}>84</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-[#E0B0FF] bg-[#E0B0FF]/10 px-2 py-1 rounded">24% CVR</span>
          <span className={`text-[10px] ${textSecondary}`}>Funnel Conversion</span>
        </div>
      </div>
      
      {/* Mock Chart Area */}
      <div className={`col-span-1 md:col-span-3 h-64 rounded-2xl border flex items-center justify-center ${cardClass}`}>
         <div className="text-center">
            <p className={`font-display text-sm mb-2 ${textPrimary}`}>Vote Velocity (Last 30 Days)</p>
            <p className={`text-[10px] uppercase tracking-widest ${textSecondary}`}>[Data Visualization Rendering...]</p>
         </div>
      </div>
    </div>
  );
}
