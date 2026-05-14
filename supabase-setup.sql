-- ============================================
-- QUERY 1: Create newsletter_submissions table
-- ============================================
-- Paste this into Supabase SQL Editor first, then click Run

CREATE TABLE newsletter_submissions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
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
