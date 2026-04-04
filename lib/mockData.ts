import { Industry, Business } from './supabaseClient';

export const INDUSTRIES: Industry[] = [
  { id: 'real-estate',   name: 'Real Estate',    weight: 95, revenue: 1500000 },
  { id: 'restaurants',   name: 'Restaurants',    weight: 88, revenue: 800000 },
  { id: 'dentists',      name: 'Dental',         weight: 72, revenue: 400000 },
  { id: 'finance',       name: 'Finance',        weight: 85, revenue: 2000000 },
  { id: 'automotive',    name: 'Automotive',     weight: 78, revenue: 600000 },
  { id: 'fitness',       name: 'Fitness',        weight: 65, revenue: 150000 },
  { id: 'legal',         name: 'Legal',          weight: 70, revenue: 500000 },
  { id: 'technology',    name: 'Technology',     weight: 80, revenue: 1200000 },
  { id: 'retail',        name: 'Retail',         weight: 60, revenue: 90000 },
  { id: 'healthcare',    name: 'Healthcare',     weight: 75, revenue: 750000 },
  { id: 'beauty',        name: 'Beauty & Spa',   weight: 58, revenue: 110000 },
  { id: 'construction',  name: 'Construction',   weight: 68, revenue: 650000 },
  { id: 'education',     name: 'Education',      weight: 62, revenue: 200000 },
  { id: 'events',        name: 'Events',         weight: 55, revenue: 80000 },
  { id: 'media',         name: 'Media',          weight: 50, revenue: 130000 },
  { id: 'insurance',     name: 'Insurance',      weight: 66, revenue: 550000 },
  { id: 'travel',        name: 'Travel',         weight: 52, revenue: 300000 },
  { id: 'logistics',     name: 'Logistics',      weight: 60, revenue: 450000 },
  { id: 'pharma',        name: 'Pharmacy',       weight: 64, revenue: 700000 },
  { id: 'accounting',    name: 'Accounting',     weight: 63, revenue: 350000 },
  { id: 'architecture',  name: 'Architecture',   weight: 57, revenue: 280000 },
  { id: 'childcare',     name: 'Childcare',      weight: 54, revenue: 140000 },
  { id: 'cleaning',      name: 'Cleaning',       weight: 48, revenue: 50000 },
  { id: 'crypto',        name: 'Web3 / Crypto',  weight: 74, revenue: 1000000 },
  { id: 'marketing',     name: 'Marketing',      weight: 69, revenue: 420000 },
  { id: 'photography',   name: 'Photography',    weight: 47, revenue: 40000 },
  { id: 'plumbing',      name: 'Plumbing',       weight: 46, revenue: 85000 },
  { id: 'security',      name: 'Security',       weight: 61, revenue: 250000 },
  { id: 'veterinary',    name: 'Veterinary',     weight: 53, revenue: 310000 },
  { id: 'wedding',       name: 'Weddings',       weight: 51, revenue: 120000 },
];

// ─── Businesses per industry ─────────────────────────────────────────────────

const realEstateBusinesses: Business[] = [
  {
    id: 'pinnacle-realty',
    industry_id: 'real-estate',
    name: 'Pinnacle Realty Group',
    tier: 'large',
    tagline: 'GTA\'s #1 Luxury Property Specialists',
    address: '100 King St W, Suite 5400, Toronto, ON',
    phone: '(416) 555-0192',
    deal: '🏆 FREE Home Valuation Report — Book Today & Save $500 on Closing Fees',
    promo_code: 'VALUATION500',
    vote_count: 347,
    committed_date: '2026-01-10T10:00:00Z',
    links: [
      { label: 'View Listings', url: '#' },
      { label: 'Book Consultation', url: '#' },
      { label: 'Sold Properties', url: '#' },
    ],
    images: ['/mock/pinnacle-1.jpg', '/mock/pinnacle-2.jpg', '/mock/pinnacle-3.jpg'],
  },
  {
    id: 'urban-nest',
    industry_id: 'real-estate',
    name: 'Urban Nest Properties',
    tier: 'medium',
    tagline: 'Condos & Townhomes for Modern Living',
    address: '250 Yonge St, Toronto, ON',
    phone: '(416) 555-0247',
    deal: '🎁 $250 VISA Gift Card on any signed offer this month',
    vote_count: 189,
    links: [
      { label: 'Browse Condos', url: '#' },
      { label: 'Contact Agent', url: '#' },
    ],
  },
  {
    id: 'scarborough-homes',
    industry_id: 'real-estate',
    name: 'Scarborough Homes',
    tier: 'small',
    tagline: 'East GTA Residential Experts',
    phone: '(416) 555-0318',
    vote_count: 94,
    trending: true,
    links: [{ label: 'Visit Site', url: '#' }],
  },
  {
    id: 'north-york-realty',
    industry_id: 'real-estate',
    name: 'North York Realty',
    tier: 'small',
    tagline: 'Family Homes in North York',
    phone: '(647) 555-0422',
    vote_count: 76,
    links: [{ label: 'Visit Site', url: '#' }],
  },
  {
    id: 'brampton-estates',
    industry_id: 'real-estate',
    name: 'Brampton Estates',
    tier: 'medium',
    tagline: 'Spacious Semi-Detached & Detached Homes',
    phone: '(905) 555-0511',
    deal: '🏡 First-Time Buyer? Ask about our 0% deposit program',
    vote_count: 142,
    links: [
      { label: 'New Listings', url: '#' },
      { label: 'Book a Showing', url: '#' },
    ],
  },
];

const restaurantBusinesses: Business[] = [
  {
    id: 'sakura-fusion',
    industry_id: 'restaurants',
    name: 'Sakura Fusion Kitchen',
    tier: 'large',
    tagline: 'Where Japanese Precision Meets Canadian Comfort',
    address: '789 Queen St W, Toronto, ON',
    phone: '(416) 555-0615',
    deal: '🍱 Show this screen for a FREE Miso Soup with any entrée — Dine-in only',
    promo_code: 'SAKURA-MISO',
    vote_count: 512,
    committed_date: '2026-02-05T14:30:00Z',
    links: [
      { label: 'Book a Table', url: '#' },
      { label: 'View Menu', url: '#' },
      { label: 'Order Online', url: '#' },
    ],
    images: ['/mock/sakura-1.jpg', '/mock/sakura-2.jpg'],
  },
  {
    id: 'jerk-hub-toronto',
    industry_id: 'restaurants',
    name: 'Jerk Hub Toronto',
    tier: 'medium',
    tagline: 'Authentic Caribbean Flavours in Every Bite',
    phone: '(416) 555-0734',
    deal: '🌶️ 10% off on orders over $40 — mention GTA Hub',
    vote_count: 298,
    trending: true,
    links: [
      { label: 'Order Pickup', url: '#' },
      { label: 'Catering', url: '#' },
    ],
  },
  {
    id: 'layla-mediterranean',
    industry_id: 'restaurants',
    name: 'Layla Mediterranean',
    tier: 'small',
    tagline: 'Fresh mezze & wood-fired flatbreads',
    phone: '(647) 555-0812',
    vote_count: 155,
    links: [{ label: 'View Menu', url: '#' }],
  },
];

const dentistBusinesses: Business[] = [
  {
    id: 'downtown-dental',
    industry_id: 'dentists',
    name: 'Downtown Dental Studio',
    tier: 'large',
    tagline: 'Cosmetic & Family Dentistry — Same-Day Appointments',
    address: '33 Bay St, Toronto, ON M5J 2T3',
    phone: '(416) 555-0901',
    deal: '✨ Show this screen for FREE Teeth Whitening Kit ($149 value) with your first cleaning',
    vote_count: 224,
    committed_date: '2026-01-15T09:15:00Z',
    links: [
      { label: 'Book Appointment', url: '#' },
      { label: 'Services', url: '#' },
      { label: 'Invisalign Consult', url: '#' },
    ],
    images: ['/mock/dental-1.jpg', '/mock/dental-2.jpg'],
  },
  {
    id: 'smile-brampton',
    industry_id: 'dentists',
    name: 'Smile Brampton Dental',
    tier: 'medium',
    tagline: 'Your Trusted Family Dentist in Brampton',
    phone: '(905) 555-1024',
    deal: '🦷 New patients: Free X-rays & exam ($250 value)',
    vote_count: 167,
    links: [
      { label: 'New Patient Form', url: '#' },
      { label: 'Call Now', url: '#' },
    ],
  },
  {
    id: 'scarborough-ortho',
    industry_id: 'dentists',
    name: 'Scarborough Orthodontics',
    tier: 'small',
    tagline: 'Braces & Aligners for All Ages',
    phone: '(416) 555-1102',
    vote_count: 88,
    links: [{ label: 'Visit Site', url: '#' }],
  },
];

// Map all businesses by industry_id
const ALL_BUSINESSES: Business[] = [
  ...realEstateBusinesses,
  ...restaurantBusinesses,
  ...dentistBusinesses,
];

export function getBusinessesByIndustry(industryId: string): Business[] {
  return ALL_BUSINESSES.filter(b => b.industry_id === industryId);
}

export function getBusinessById(id: string): Business | undefined {
  return ALL_BUSINESSES.find(b => b.id === id);
}

export { ALL_BUSINESSES };
