-- Migration: Add content_type column to articles table for rich text support
-- This ensures backward compatibility with existing plain text articles

-- Add content_type column (defaults to 'html' for new articles)
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'html' CHECK (content_type IN ('plain', 'html'));

-- Update existing articles to mark them as plain text
UPDATE articles 
SET content_type = 'plain' 
WHERE content_type IS NULL OR content NOT LIKE '<%';

-- Add comment for documentation
COMMENT ON COLUMN articles.content_type IS 'Content format: plain (legacy) or html (rich text)';
