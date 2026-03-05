-- Add audio_url column to sermons table
ALTER TABLE sermons
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN sermons.audio_url IS 'URL to the sermon audio file (MP3, WAV, etc.)';
