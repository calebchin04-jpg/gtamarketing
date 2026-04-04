import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Database Types ---
export type Industry = {
  id: string;
  name: string;
  weight: number; // proportional bubble sizing (fallback if revenue applies)
  revenue?: number; // Phase 3 sizing based on revenue
};

export type Business = {
  id: string;
  industry_id: string;
  name: string;
  tier: 'small' | 'medium' | 'large';
  logo_url?: string;
  tagline?: string;
  links?: { label: string; url: string }[];
  images?: string[];
  deal?: string;
  address?: string;
  phone?: string;
  vote_count?: number;
  committed_date?: string; // used for earliest-committed logic
  trending?: boolean; // flags businesses with rapid vote growth
  promo_code?: string; // used for unlockable deal claims
};

export type Vote = {
  id: string;
  business_id: string;
  voter_name: string;
  voter_email: string;
  voter_phone: string;
  source?: string; // e.g. "qr", "nfc", "web"
  created_at: string;
};
