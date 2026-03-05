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

async function checkSermonsSchema() {
  try {
    console.log('🔍 Checking sermons table schema...');
    
    // Try to get one sermon to see the actual column names
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying sermons table:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Sermons table exists');
      console.log('📋 Available columns:');
      Object.keys(data[0]).forEach(column => {
        console.log(`   • ${column}`);
      });
    } else {
      console.log('📋 Sermons table exists but is empty');
      console.log('Creating a test query to check column structure...');
      
      // Try to select specific columns to see which ones exist
      const testColumns = [
        'id', 'title', 'speaker', 'date', 'duration', 'description',
        'video_url', 'audio_url', 'created_at', 'createdAt'
      ];
      
      for (const column of testColumns) {
        try {
          const { error: colError } = await supabase
            .from('sermons')
            .select(column)
            .limit(1);
          
          if (!colError) {
            console.log(`   ✅ ${column}`);
          }
        } catch (e) {
          console.log(`   ❌ ${column} - not found`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSermonsSchema();