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

async function checkBookingsTable() {
  try {
    console.log('🔍 Checking bookings table schema...\n');
    
    // Check bookings table
    const bookingsSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 bookings table columns:');
    bookingsSchema.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    // Sample bookings data
    console.log('\n📝 Sample bookings data:');
    const sampleData = await pool.query('SELECT * FROM bookings LIMIT 1');
    if (sampleData.rows.length > 0) {
      const sample = sampleData.rows[0];
      console.log('Sample columns found:');
      Object.keys(sample).forEach(key => {
        console.log(`- ${key}: ${sample[key]}`);
      });
    } else {
      console.log('No bookings data found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkBookingsTable();
