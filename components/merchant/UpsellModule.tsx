'use client';

type Props = {
  isDark: boolean;
};

export default function UpsellModule({ isDark }: Props) {
  const cardClass = isDark ? 'bg-[#0F0F0F] border-white/5 hover:border-white/20' : 'bg-white border-black/5 shadow-sm hover:border-black/20 hover:shadow-md';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gainsboro/60' : 'text-gray-600';

  return (
    <div className="flex flex-col gap-4">
       {/* Call Agent */}
       <div className={`p-6 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${cardClass}`}>
         <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 opacity-5 group-hover:opacity-10 transition-opacity blur-[40px] pointer-events-none" />
          <h3 className={`text-sm font-semibold mb-2 font-display ${textPrimary}`}>🤖 AI Receptionist</h3>
          <p className={`text-xs leading-relaxed ${textSecondary}`}>
             Never miss a lead. Install a conversational AI agent that books appointments and answers FAQs 24/7.
          </p>
          <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-4 group-hover:underline">
             Learn More →
          </p>
       </div>

       {/* Local SEO */}
       <div className={`p-6 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${cardClass}`}>
         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400 opacity-5 group-hover:opacity-10 transition-opacity blur-[40px] pointer-events-none" />
          <h3 className={`text-sm font-semibold mb-2 font-display ${textPrimary}`}>📍 Local Domination</h3>
          <p className={`text-xs leading-relaxed ${textSecondary}`}>
             We optimize your Google Maps profile so you rank #1 when locals search for your services.
          </p>
          <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-4 group-hover:underline">
             See Case Studies →
          </p>
       </div>

       {/* Social Management */}
       <div className={`p-6 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${cardClass}`}>
         <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 opacity-5 group-hover:opacity-10 transition-opacity blur-[40px] pointer-events-none" />
          <h3 className={`text-sm font-semibold mb-2 font-display ${textPrimary}`}>📱 Digital Presence</h3>
          <p className={`text-xs leading-relaxed ${textSecondary}`}>
             End-to-end web management and social media growth tailored to your specific industry.
          </p>
          <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-4 group-hover:underline">
             View Packages →
          </p>
       </div>
    </div>
  );
}
