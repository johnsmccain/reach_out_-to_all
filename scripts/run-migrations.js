import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  const migrationsDir = join(__dirname, '../supabase/migrations');
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration files\n`);

  for (const file of files) {
    console.log(`Running: ${file}`);
    const sql = readFileSync(join(migrationsDir, file), 'utf-8');
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`❌ Error in ${file}:`, error.message);
    } else {
      console.log(`✅ ${file} completed\n`);
    }
  }
}

runMigrations().catch(console.error);
