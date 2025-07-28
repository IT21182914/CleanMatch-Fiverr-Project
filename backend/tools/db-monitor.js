#!/usr/bin/env node

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function checkConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW(), version()');
    client.release();
    
    console.log('✅ Database connection successful');
    console.log('🕐 Server time:', result.rows[0].now);
    console.log('📊 Database version:', result.rows[0].version.split(' ')[0]);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function monitorConnection() {
  console.log('🔍 Starting database connection monitor...\n');
  
  const interval = setInterval(async () => {
    const isConnected = await checkConnection();
    
    if (!isConnected) {
      console.log('🔄 Attempting to reconnect...');
    }
    
    console.log('---');
  }, 10000); // Check every 10 seconds

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(interval);
    pool.end(() => {
      console.log('\n✅ Database monitor stopped');
      process.exit(0);
    });
  });
}

// Run initial check
checkConnection().then((success) => {
  if (success) {
    monitorConnection();
  } else {
    console.log('❌ Initial connection failed. Exiting...');
    process.exit(1);
  }
});
