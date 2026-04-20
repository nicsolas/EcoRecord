import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('Connecting to Supabase...');
    
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'supabase-schema.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    console.log('Executing SQL schema...');
    
    // Split the SQL content by statements and execute each one
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement) {
        console.log(`Executing: ${trimmedStatement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: trimmedStatement });
        
        if (error) {
          console.error(`Error executing statement: ${error.message}`);
        }
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error.message);
    process.exit(1);
  }
}

runMigration();
