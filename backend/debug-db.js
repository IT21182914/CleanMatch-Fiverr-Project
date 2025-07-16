require('dotenv').config();
const { Pool } = require('pg');

async function debugDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Checking database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    console.log('\n🔍 Checking existing tables...');
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('Existing tables:', tables.rows.map(r => r.table_name));

    // Check if bookings table exists and its columns
    if (tables.rows.some(r => r.table_name === 'bookings')) {
      console.log('\n🔍 Checking bookings table structure...');
      const bookingCols = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      console.log('Bookings columns:');
      bookingCols.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
      
      const hasCustomerId = bookingCols.rows.some(r => r.column_name === 'customer_id');
      console.log(`Customer_id exists in bookings: ${hasCustomerId}`);
    }

    // Check if reviews table exists and its columns
    if (tables.rows.some(r => r.table_name === 'reviews')) {
      console.log('\n🔍 Checking reviews table structure...');
      const reviewCols = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'reviews' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      console.log('Reviews columns:');
      reviewCols.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
      
      const hasCustomerId = reviewCols.rows.some(r => r.column_name === 'customer_id');
      console.log(`Customer_id exists in reviews: ${hasCustomerId}`);
    }

    // Try to create just the users table first
    console.log('\n🔍 Testing users table creation...');
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users_test (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'customer'
        )
      `);
      console.log('✅ Users test table created successfully');
      
      // Clean up
      await pool.query('DROP TABLE IF EXISTS users_test');
    } catch (error) {
      console.log('❌ Users test table creation failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

debugDatabase();
