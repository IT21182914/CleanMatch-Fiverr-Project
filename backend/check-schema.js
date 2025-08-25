require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function checkTables() {
  try {
    console.log('🔍 Checking table schemas...\n');
    
    // Check cleaner_profiles table
    const cleanerProfilesSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cleaner_profiles'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 cleaner_profiles table columns:');
    cleanerProfilesSchema.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    // Check admin_reviews table
    const adminReviewsSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'admin_reviews'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 admin_reviews table columns:');
    adminReviewsSchema.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    // Check reviews table for comparison
    const reviewsSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reviews'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 reviews table columns:');
    reviewsSchema.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    // Try to get a sample admin review
    console.log('\n📝 Sample admin_reviews data:');
    const sampleData = await pool.query('SELECT * FROM admin_reviews LIMIT 1');
    if (sampleData.rows.length > 0) {
      console.log('Sample row:', sampleData.rows[0]);
    } else {
      console.log('No data found in admin_reviews table');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();
