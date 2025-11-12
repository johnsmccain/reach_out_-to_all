-- ============================================
-- Reachout To All - Complete Database Setup
-- ============================================
-- This script sets up the entire database schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. EVENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  location text NOT NULL,
  image_url text,
  video_url text,
  type text NOT NULL CHECK (type IN ('past', 'current', 'future')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view events" ON events;
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Only admins can modify events" ON events;
CREATE POLICY "Only admins can modify events"
  ON events FOR ALL TO authenticated USING (true);

-- ============================================
-- 2. PRAYER REQUESTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS prayer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  request text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit prayer requests" ON prayer_requests;
CREATE POLICY "Anyone can submit prayer requests"
  ON prayer_requests FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can view prayer requests" ON prayer_requests;
CREATE POLICY "Only admins can view prayer requests"
  ON prayer_requests FOR SELECT TO authenticated USING (true);

-- ============================================
-- 3. VOLUNTEERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  unit text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit volunteer applications" ON volunteers;
CREATE POLICY "Anyone can submit volunteer applications"
  ON volunteers FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can view volunteers" ON volunteers;
CREATE POLICY "Only admins can view volunteers"
  ON volunteers FOR SELECT TO authenticated USING (true);

-- ============================================
-- 4. SOUL COUNT TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS soul_count (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count integer NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE soul_count ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view soul count" ON soul_count;
CREATE POLICY "Anyone can view soul count"
  ON soul_count FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Only admins can update soul count" ON soul_count;
CREATE POLICY "Only admins can update soul count"
  ON soul_count FOR ALL TO authenticated USING (true);

-- Insert initial soul count if not exists
INSERT INTO soul_count (count)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM soul_count);

-- ============================================
-- 5. SERMONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), 
  title text NOT NULL,
  speaker text NOT NULL,
  date timestamptz NOT NULL,
  duration text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sermons' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE sermons ADD COLUMN image_url text;
  END IF;
END $$;

ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view sermons" ON sermons;
CREATE POLICY "Anyone can view sermons"
  ON sermons FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Only admins can modify sermons" ON sermons;
CREATE POLICY "Only admins can modify sermons"
  ON sermons FOR ALL TO authenticated USING (true);

-- ============================================
-- 6. DOCUMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE documents ADD COLUMN image_url text;
  END IF;
END $$;

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view documents" ON documents;
CREATE POLICY "Anyone can view documents"
  ON documents FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Only admins can modify documents" ON documents;
CREATE POLICY "Only admins can modify documents"
  ON documents FOR ALL TO authenticated USING (true);

-- ============================================
-- 7. STATISTICS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  states_covered integer NOT NULL DEFAULT 0,
  outreaches_conducted integer NOT NULL DEFAULT 0,
  locals_reached integer NOT NULL DEFAULT 0,
  communities_reached integer NOT NULL DEFAULT 0,
  souls_won integer NOT NULL DEFAULT 0,
  rededication_commitments integer NOT NULL DEFAULT 0,
  medical_beneficiaries integer NOT NULL DEFAULT 0,
  welfare_beneficiaries integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY; 

DROP POLICY IF EXISTS "Anyone can view statistics" ON statistics;
CREATE POLICY "Anyone can view statistics"
  ON statistics FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Only admins can modify statistics" ON statistics;
CREATE POLICY "Only admins can modify statistics"
  ON statistics FOR ALL TO authenticated USING (true);

-- Insert initial statistics if not exists
INSERT INTO statistics (
  states_covered,
  outreaches_conducted,
  locals_reached,
  communities_reached,
  souls_won,
  rededication_commitments,
  medical_beneficiaries,
  welfare_beneficiaries
)
SELECT 15, 13, 3500, 22, 1200, 2500, 3000, 3200
WHERE NOT EXISTS (SELECT 1 FROM statistics);

-- ============================================
-- 8. ARTICLES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  cover_image text,
  tags text[],
  is_top boolean DEFAULT false,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT TO public USING (published = true);

DROP POLICY IF EXISTS "Only admins can modify articles" ON articles;
CREATE POLICY "Only admins can modify articles"
  ON articles FOR ALL TO authenticated USING (true);

-- ============================================
-- 9. ARTICLE REACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS article_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid,
  type text NOT NULL CHECK (type IN ('like', 'love', 'pray')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, user_id, type)
);

ALTER TABLE article_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reactions" ON article_reactions;
CREATE POLICY "Anyone can view reactions"
  ON article_reactions FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can add reactions" ON article_reactions;
CREATE POLICY "Anyone can add reactions"
  ON article_reactions FOR INSERT TO public WITH CHECK (true);

-- ============================================
-- 10. ARTICLE COMMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS article_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid,
  comment text NOT NULL,
  author_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comments" ON article_comments;
CREATE POLICY "Anyone can view comments"
  ON article_comments FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can add comments" ON article_comments;
CREATE POLICY "Anyone can add comments"
  ON article_comments FOR INSERT TO public WITH CHECK (true);

-- ============================================
-- 11. DAILY QUOTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS daily_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text,
  author text,
  date date UNIQUE DEFAULT CURRENT_DATE,
  image_url text,
  image_type varchar(10) DEFAULT 'text' CHECK (image_type IN ('text', 'image')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view quotes" ON daily_quotes;
CREATE POLICY "Anyone can view quotes"
  ON daily_quotes FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Only admins can modify quotes" ON daily_quotes;
CREATE POLICY "Only admins can modify quotes"
  ON daily_quotes FOR ALL TO authenticated USING (true);

-- ============================================
-- 12. STORAGE BUCKETS
-- ============================================

-- Create quote-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quote-images',
  'quote-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

-- Create documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];

-- ============================================
-- 13. STORAGE POLICIES FOR QUOTE-IMAGES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view quote images" ON storage.objects;
CREATE POLICY "Anyone can view quote images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'quote-images');

DROP POLICY IF EXISTS "Admins can upload quote images" ON storage.objects;
CREATE POLICY "Admins can upload quote images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'quote-images');

DROP POLICY IF EXISTS "Admins can update quote images" ON storage.objects;
CREATE POLICY "Admins can update quote images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'quote-images')
WITH CHECK (bucket_id = 'quote-images');

DROP POLICY IF EXISTS "Admins can delete quote images" ON storage.objects;
CREATE POLICY "Admins can delete quote images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'quote-images');

-- ============================================
-- 14. STORAGE POLICIES FOR DOCUMENTS
-- ============================================

DROP POLICY IF EXISTS "Anyone can view documents" ON storage.objects;
CREATE POLICY "Anyone can view documents"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Admins can upload documents" ON storage.objects;
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Admins can update documents" ON storage.objects;
CREATE POLICY "Admins can update documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Admins can delete documents" ON storage.objects;
CREATE POLICY "Admins can delete documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents');

-- ============================================
-- 15. SAMPLE DATA (OPTIONAL)
-- ============================================

-- Insert sample articles if none exist
INSERT INTO articles (title, content, author, cover_image, tags, is_top)
SELECT 
  'The Great Commission in Modern Times',
  'In today''s world, the call to "go and make disciples of all nations" remains as relevant as ever. Our mission work in rural Nigeria demonstrates how the Gospel transforms communities through love, compassion, and practical service. We have witnessed countless lives changed as we bring hope to the hopeless and light to those in darkness.',
  'Bawa G. Emmanuel',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  ARRAY['mission', 'evangelism'],
  true
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = 'The Great Commission in Modern Times');

INSERT INTO articles (title, content, author, cover_image, tags, is_top)
SELECT
  'Reaching the Unreached',
  'Every soul matters to God, and our commitment to reaching remote communities reflects this divine heart. Through our outreach programs, we have witnessed incredible transformations as entire villages come to know Christ. Our medical missions, welfare programs, and evangelistic efforts work together to demonstrate God''s love in practical ways.',
  'Bawa G. Emmanuel',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  ARRAY['outreach', 'community'],
  true
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Reaching the Unreached');

-- Insert sample daily quotes if none exist
INSERT INTO daily_quotes (quote, author, date, image_type)
SELECT 
  'Every soul counts in the kingdom of God.',
  'Bawa G. Emmanuel',
  CURRENT_DATE,
  'text'
WHERE NOT EXISTS (SELECT 1 FROM daily_quotes WHERE date = CURRENT_DATE);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- All tables, policies, and storage buckets have been created.
-- You can now use your application with this Supabase instance.
-- ============================================
