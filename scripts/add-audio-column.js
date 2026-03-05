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

async function addAudioColumn() {
  try {
    console.log('Adding audio_url column to sermons table...');
    
    // Execute the SQL to add the column
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE sermons ADD COLUMN IF NOT EXISTS audio_url TEXT;'
    });
    
    if (error) {
      console.error('Error adding column:', error.message);
      console.log('\n🔧 Alternative: Run this SQL in your Supabase dashboard:');
      console.log('ALTER TABLE sermons ADD COLUMN IF NOT EXISTS audio_url TEXT;');
      return false;
    }
    
    console.log('✅ Successfully added audio_url column to sermons table');
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n🔧 Please run this SQL manually in your Supabase dashboard:');
    console.log('ALTER TABLE sermons ADD COLUMN IF NOT EXISTS audio_url TEXT;');
    return false;
  }
}

async function verifyColumn() {
  try {
    const { data, error } = await supabase
      .from('sermons')
      .select('id, title, audio_url')
      .limit(1);
    
    if (error) {
      console.error('Verification failed:', error.message);
      return false;
    }
    
    console.log('✅ Column verification successful');
    return true;
  } catch (error) {
    console.error('Verification error:', error.message);
    return false;
  }
}

async function main() {
  console.log('Setting up MP3 audio support for sermons...\n');
  
  const added = await addAudioColumn();
  
  if (added) {
    console.log('\nVerifying the column was added...');
    const verified = await verifyColumn();
    
    if (verified) {
      console.log('\n🎉 MP3 audio support is now fully functional!');
      console.log('You can now upload audio files in the Sermon Modal.');
    }
  }
}

main();