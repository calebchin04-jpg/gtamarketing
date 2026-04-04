'use client';

import { useEffect, useState } from 'react';
import { supabase, Business } from '@/lib/supabaseClient';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChampionSidebar() {
  const [champion, setChampion] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChampion() {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('vote_count', { ascending: false })
          .limit(1)
          .single();
          
        if (data && !error) {
          setChampion(data);
        }
      } catch (err) {
        console.error('Error fetching champion', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchChampion();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full justify-center px-8 border-r border-white/10 w-80 bg-black/40 backdrop-blur-md z-50 absolute left-0 top-0 bottom-0"
    >
      <div className="flex items-center space-x-3 text-white/50 mb-6">
        <Trophy size={16} className="text-white" />
        <span className="text-xs uppercase tracking-[0.2em] font-medium">Daily Champion</span>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      ) : champion ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white mb-2">{champion.name}</h2>
            {champion.tagline && (
              <p className="text-sm text-white/60 leading-relaxed">{champion.tagline}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between py-4 border-y border-white/10">
            <div className="flex items-center space-x-2">
              <Users size={14} className="text-white/40" />
              <span className="text-sm text-white/80 font-medium">Community Votes</span>
            </div>
            <span className="text-lg font-mono text-white">{champion.vote_count || 0}</span>
          </div>
          
          {champion.trending && (
            <div className="flex items-center space-x-2 text-white bg-white/10 px-3 py-1.5 rounded-sm w-fit mt-4">
              <TrendingUp size={12} />
              <span className="text-[10px] uppercase tracking-wider font-bold">Trending High</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-white/40 text-sm">No champion data available.</div>
      )}
    </motion.div>
  );
}
