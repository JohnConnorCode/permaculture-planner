#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 Quick Supabase Database Setup Helper\n');
console.log('This script will help you set up your database quickly.\n');

const sqlPath = path.join(__dirname, 'combined_database_setup.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

// Copy SQL to clipboard (macOS)
exec(`echo ${JSON.stringify(sqlContent)} | pbcopy`, (error) => {
  if (!error) {
    console.log('✅ SQL copied to clipboard!\n');
  } else {
    console.log('⚠️  Could not copy to clipboard. Please copy manually from combined_database_setup.sql\n');
  }
});

// Open the SQL editor
const sqlEditorUrl = 'https://supabase.com/dashboard/project/mrbiutqridfiqbttsgfg/sql/new';
console.log('Opening Supabase SQL Editor...');
exec(`open "${sqlEditorUrl}"`, (error) => {
  if (!error) {
    console.log('✅ Browser opened!\n');
  } else {
    console.log(`📋 Please open manually: ${sqlEditorUrl}\n`);
  }
});

console.log('📋 NEXT STEPS:');
console.log('1. The SQL is copied to your clipboard');
console.log('2. In the SQL Editor that just opened:');
console.log('   - Press Cmd+V to paste the SQL');
console.log('   - Click the "Run" button');
console.log('3. Wait for execution to complete (should see success messages)');
console.log('4. Run: node verify_database_setup.js\n');

console.log('The setup will create:');
console.log('✓ 11 database tables');
console.log('✓ Custom PostgreSQL types');
console.log('✓ Row Level Security policies');
console.log('✓ Performance indexes');
console.log('✓ Automatic timestamp triggers');
console.log('✓ 35+ vegetable varieties with growing data\n');

// After a delay, remind to verify
setTimeout(() => {
  console.log('\n🔔 Reminder: After running the SQL, verify with:');
  console.log('   node verify_database_setup.js');
}, 5000);