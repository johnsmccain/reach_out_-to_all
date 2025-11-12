/*
  # Add Image Support to Daily Quotes

  1. Changes
    - Add image_url column to daily_quotes table (nullable TEXT)
    - Add image_type column with default 'text' and CHECK constraint
    - Allow quotes to be either text-based or image-based

  2. Notes
    - Existing quotes will have image_type = 'text' by default
    - image_url is nullable to support text-only quotes
*/

-- Add image_url column (nullable to support text quotes)
ALTER TABLE daily_quotes 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_type column with default and constraint
ALTER TABLE daily_quotes 
ADD COLUMN IF NOT EXISTS image_type VARCHAR(10) DEFAULT 'text' 
CHECK (image_type IN ('text', 'image'));

-- Make quote and author nullable since image quotes may not need them
ALTER TABLE daily_quotes 
ALTER COLUMN quote DROP NOT NULL,
ALTER COLUMN author DROP NOT NULL;
