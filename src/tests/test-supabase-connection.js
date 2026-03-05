#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * Tests the connection to your Supabase database and verifies tables exist
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConnection() {
  log('\n========================================', 'cyan');
  log('Supabase Connection Test', 'cyan');
  log('========================================\n', 'cyan');

  // Check environment variables
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    log('❌ Error: Missing Supabase credentials in .env file', 'red');
    log('   Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set\n', 'yellow');
    process.exit(1);
  }

  log(`📡 Connecting to: ${SUPABASE_URL}`, 'blue');
  
  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Tables to check
  const tables = [
    'events',
    'prayer_requests',
    'volunteers',
    'soul_count',
    'sermons',
    'documents',
    'statistics',
    'articles',
    'article_reactions',
    'article_comments',
    'daily_quotes',
  ];

  let successCount = 0;
  let failCount = 0;

  log('\n🔍 Checking tables...\n', 'blue');

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        log(`❌ ${table.padEnd(25)} - Error: ${error.message}`, 'red');
        failCount++;
      } else {
        const count = data ? data.length : 0;
        log(`✅ ${table.padEnd(25)} - OK (${count} sample record${count !== 1 ? 's' : ''})`, 'green');
        successCount++;
      }
    } catch (err) {
      log(`❌ ${table.padEnd(25)} - Exception: ${err.message}`, 'red');
      failCount++;
    }
  }

  // Check storage buckets
  log('\n🗄️  Checking storage buckets...\n', 'blue');

  const buckets = ['quote-images', 'documents'];
  
  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.getBucket(bucket);

      if (error) {
        log(`❌ ${bucket.padEnd(25)} - Error: ${error.message}`, 'red');
        failCount++;
      } else {
        log(`✅ ${bucket.padEnd(25)} - OK (${data.public ? 'public' : 'private'})`, 'green');
        successCount++;
      }
    } catch (err) {
      log(`❌ ${bucket.padEnd(25)} - Exception: ${err.message}`, 'red');
      failCount++;
    }
  }

  // Summary
  log('\n========================================', 'cyan');
  log('Test Summary', 'cyan');
  log('========================================\n', 'cyan');

  const total = successCount + failCount;
  log(`Total Checks: ${total}`, 'blue');
  log(`✅ Passed: ${successCount}`, 'green');
  log(`❌ Failed: ${failCount}`, 'red');

  if (failCount === 0) {
    log('\n🎉 All checks passed! Your Supabase setup is complete.\n', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some checks failed. Please run the setup script:', 'yellow');
    log('   1. Open Supabase SQL Editor', 'yellow');
    log('   2. Copy contents of setup-supabase.sql', 'yellow');
    log('   3. Paste and run in SQL Editor\n', 'yellow');
    process.exit(1);
  }
}

// Run the test
testConnection().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}\n`, 'red');
  process.exit(1);
});
