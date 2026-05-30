-- ============================================
-- QUERY 1: Create newsletter_submissions table
-- ============================================
-- Paste this into Supabase SQL Editor first, then click Run

CREATE TABLE newsletter_submissions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  source TEXT DEFAULT 'website'
);

ALTER TABLE newsletter_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON newsletter_submissions
  FOR INSERT WITH CHECK (true);


-- ============================================
-- QUERY 2: Create tool_submissions table
-- ============================================
-- After Query 1 completes, click "New Query" and paste this, then click Run

CREATE TABLE tool_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  pricing TEXT,
  contact_email TEXT,
  description TEXT,
  source TEXT DEFAULT 'website',
  submitted_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON tool_submissions
  FOR INSERT WITH CHECK (true);


-- ============================================
-- QUERY 3: Create page_views counter table
-- ============================================

CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  count BIGINT NOT NULL DEFAULT 0
);

-- Insert the initial row for total site visits
INSERT INTO page_views (id, count) VALUES ('total', 0)
  ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read and update the counter (no auth needed)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON page_views
  FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON page_views
  FOR UPDATE USING (true);

-- Atomic increment function (called by the API)
CREATE OR REPLACE FUNCTION increment_page_views(row_id TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE page_views SET count = count + 1 WHERE id = row_id
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;
