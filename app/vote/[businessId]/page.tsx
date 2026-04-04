'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBusinessById } from '@/lib/mockData';
import { Business } from '@/lib/supabaseClient';
import VotingModal from '@/components/VotingModal';
import CursorGlow from '@/components/CursorGlow';

export default function VotePage() {
  const { businessId } = useParams() as { businessId: string };
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    // Attempt to load the business data from our mock/Supabase source
    const b = getBusinessById(businessId);
    if (b) {
      setBusiness(b);
    } else {
      // If business not found, push back to home
      router.push('/');
    }
  }, [businessId, router]);

  if (!business) return null; // or a loading spinner

  return (
    <main className="relative w-full min-h-screen bg-jet flex items-center justify-center p-4">
       <CursorGlow />
       
       {/* Background structural elements to mimic the main app feel */}
       <div className="absolute inset-0 z-0 bg-gradient-radial from-slate-dark/20 to-jet/90 mix-blend-overlay" />
       
       <VotingModal 
         business={business} 
         onClose={() => router.push('/')} // Go back to constellation hub when done
       />
    </main>
  );
}
