/*
  # Articles System and Daily Quotes

  1. New Tables
    - articles
    - article_reactions  
    - article_comments
    - daily_quotes

  2. Security
    - Enable RLS on all tables
    - Public read access, admin write access
*/

-- Articles Table
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

CREATE POLICY "Anyone can view published articles"
  ON articles
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Only admins can modify articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- Article Reactions Table
CREATE TABLE IF NOT EXISTS article_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid,
  type text NOT NULL CHECK (type IN ('like', 'love', 'pray')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, user_id, type)
);

ALTER TABLE article_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reactions"
  ON article_reactions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add reactions"
  ON article_reactions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Article Comments Table
CREATE TABLE IF NOT EXISTS article_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid,
  comment text NOT NULL,
  author_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON article_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add comments"
  ON article_comments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Daily Quotes Table
CREATE TABLE IF NOT EXISTS daily_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text NOT NULL,
  date date UNIQUE DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quotes"
  ON daily_quotes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify quotes"
  ON daily_quotes
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- Insert sample data
INSERT INTO articles (title, content, author, cover_image, tags, is_top) VALUES
('The Great Commission in Modern Times', 'In today''s world, the call to "go and make disciples of all nations" remains as relevant as ever. Our mission work in rural Nigeria demonstrates how the Gospel transforms communities...', 'Bawa G. Emmanuel', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', ARRAY['mission', 'evangelism'], true),
('Reaching the Unreached', 'Every soul matters to God, and our commitment to reaching remote communities reflects this divine heart. Through our outreach programs, we have witnessed incredible transformations...', 'Bawa G. Emmanuel', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', ARRAY['outreach', 'community'], true);

INSERT INTO daily_quotes (quote, author, date) VALUES
('Every soul counts in the kingdom of God.', 'Bawa G. Emmanuel', CURRENT_DATE),
('Love is the universal language that meets every human need.', 'Reachout To All', CURRENT_DATE - INTERVAL '1 day');