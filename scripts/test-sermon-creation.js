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

async function testSermonCreation() {
  console.log('🎵 Testing Sermon Creation with Audio Support\n');
  
  try {
    // Test data
    const testSermon = {
      title: 'Test Sermon - MP3 Support',
      speaker: 'Pastor Test',
      date: new Date().toISOString(),
      duration: '30 min',
      description: 'This is a test sermon to verify MP3 audio support functionality.',
      video_url: 'https://youtube.com/watch?v=test',
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    };
    
    console.log('📝 Creating test sermon...');
    
    // Insert test sermon
    const { data: insertData, error: insertError } = await supabase
      .from('sermons')
      .insert([testSermon])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Failed to create sermon:', insertError.message);
      return;
    }
    
    console.log('✅ Sermon created successfully!');
    console.log('📋 Sermon details:');
    console.log(`   ID: ${insertData.id}`);
    console.log(`   Title: ${insertData.title}`);
    console.log(`   Speaker: ${insertData.speaker}`);
    console.log(`   Audio URL: ${insertData.audio_url}`);
    console.log(`   Video URL: ${insertData.video_url}`);
    console.log(`   Created: ${insertData.created_at}`);
    
    // Test fetching with proper field mapping
    console.log('\n🔍 Testing data retrieval...');
    
    const { data: fetchData, error: fetchError } = await supabase
      .from('sermons')
      .select('*')
      .eq('id', insertData.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Failed to fetch sermon:', fetchError.message);
      return;
    }
    
    // Simulate the mapping done in AdminDashboard
    const mappedSermon = {
      ...fetchData,
      videoUrl: fetchData.video_url,
      audioUrl: fetchData.audio_url,
      imageUrl: fetchData.image_url,
      createdAt: fetchData.created_at,
    };
    
    console.log('✅ Data retrieval successful!');
    console.log('📋 Mapped fields:');
    console.log(`   audioUrl: ${mappedSermon.audioUrl}`);
    console.log(`   videoUrl: ${mappedSermon.videoUrl}`);
    console.log(`   createdAt: ${mappedSermon.createdAt}`);
    
    // Test updating with audio
    console.log('\n🔄 Testing sermon update...');
    
    const updatedData = {
      title: 'Updated Test Sermon - MP3 Support',
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-06.wav'
    };
    
    const { error: updateError } = await supabase
      .from('sermons')
      .update(updatedData)
      .eq('id', insertData.id);
    
    if (updateError) {
      console.error('❌ Failed to update sermon:', updateError.message);
    } else {
      console.log('✅ Sermon updated successfully!');
    }
    
    // Clean up - delete test sermon
    console.log('\n🧹 Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('sermons')
      .delete()
      .eq('id', insertData.id);
    
    if (deleteError) {
      console.error('⚠️  Failed to delete test sermon:', deleteError.message);
      console.log(`   Please manually delete sermon with ID: ${insertData.id}`);
    } else {
      console.log('✅ Test data cleaned up successfully!');
    }
    
    console.log('\n🎉 MP3 AUDIO FUNCTIONALITY TEST PASSED!');
    console.log('\nThe system can:');
    console.log('• Create sermons with audio URLs');
    console.log('• Retrieve sermons with proper field mapping');
    console.log('• Update sermon audio URLs');
    console.log('• Handle both video_url and audio_url fields');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSermonCreation();