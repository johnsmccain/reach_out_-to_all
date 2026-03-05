#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAudioColumn() {
  try {
    console.log('Checking if audio_url column exists in sermons table...');
    
    // Try to select audio_url column specifically
    const { data, error } = await supabase
      .from('sermons')
      .select('id, title, audio_url')
      .limit(1);
    
    if (error) {
      if (error.message.includes('audio_url')) {
        console.log('❌ audio_url column does not exist in sermons table');
        console.log('Need to run migration: supabase/migrations/20250304000000_add_audio_to_sermons.sql');
        return false;
      } else {
        console.error('Error checking sermons table:', error.message);
        return false;
      }
    }
    
    console.log('✅ audio_url column exists in sermons table');
    console.log('Sample data:', data);
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function testAudioFunctionality() {
  console.log('Testing MP3 audio functionality...\n');
  
  const hasAudioColumn = await checkAudioColumn();
  
  if (!hasAudioColumn) {
    console.log('\n🔧 To fix this, you need to:');
    console.log('1. Run the migration in your Supabase dashboard');
    console.log('2. Or use Supabase CLI: supabase migration up');
    console.log('3. Or manually add the column: ALTER TABLE sermons ADD COLUMN audio_url TEXT;');
    return;
  }
  
  console.log('\n✅ MP3 audio functionality is ready!');
  console.log('You can now:');
  console.log('- Upload MP3 files in the Sermon Modal');
  console.log('- Audio files will be stored in Cloudinary');
  console.log('- Audio URLs will be saved to the audio_url column');
  console.log('- Audio players will display in the Sermons dashboard');
}

testAudioFunctionality();