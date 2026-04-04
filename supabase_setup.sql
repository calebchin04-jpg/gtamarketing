-- Supabase Database Setup & pg_cron Instructions for the "Midnight Flip"

-- 1. Enable pg_cron extension (This must be done by a Supabase superuser in the Dashboard > Database > Extensions)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Create Base Tables
CREATE TABLE IF NOT EXISTS industries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    weight INT NOT NULL,
    revenue BIGINT
);

CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id TEXT REFERENCES industries(id),
    name TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('small', 'medium', 'large')),
    logo_url TEXT,
    tagline TEXT,
    deal TEXT,
    address TEXT,
    phone TEXT,
    vote_count INT DEFAULT 0,
    committed_date TIMESTAMPTZ,
    trending BOOLEAN DEFAULT false,
    promo_code TEXT
);

CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id),
    voter_name TEXT,
    voter_email TEXT,
    voter_phone TEXT,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create the Hall of Fame table to store the daily winners
CREATE TABLE IF NOT EXISTS hall_of_fame (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id),
    business_name TEXT NOT NULL,
    business_logo_url TEXT,
    final_vote_count INT NOT NULL,
    won_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 3. Create the Midnight Flip function
-- This function snapshots the top business from yesterday, inserts them into the Hall of Fame,
-- and then optionally resets active vote counts if your logic requires daily resets.
CREATE OR REPLACE FUNCTION process_midnight_flip()
RETURNS void AS $$
DECLARE
    top_business RECORD;
BEGIN
    -- Find the top voted business (excluding those already in the Hall of Fame for today/yesterday)
    SELECT id, name, logo_url, vote_count
    INTO top_business
    FROM businesses
    ORDER BY vote_count DESC
    LIMIT 1;

    IF FOUND THEN
        -- Insert into Hall of Fame
        INSERT INTO hall_of_fame (business_id, business_name, business_logo_url, final_vote_count, won_date)
        VALUES (top_business.id, top_business.name, top_business.logo_url, top_business.vote_count, CURRENT_DATE - INTERVAL '1 day');
    END IF;

    -- Reset daily vote counts back to 0 (If your logic requires a clean slate every day)
    -- UPDATE businesses SET vote_count = 0;
END;
$$ LANGUAGE plpgsql;

-- 4. Schedule the cron job to run at 11:59 PM every night
-- Make sure your Supabase project timezone is aligned or adjust the cron schedule string appropriately.
SELECT cron.schedule(
    'midnight-flip-job',
    '59 23 * * *', -- At 23:59 every day
    $$ SELECT process_midnight_flip(); $$
);

-- Note: To unschedule if needed:
-- SELECT cron.unschedule('midnight-flip-job');
