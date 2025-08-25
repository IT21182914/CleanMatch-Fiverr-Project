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

async function checkAdmin() {
  try {
    const result = await pool.query("SELECT id, email, role FROM users WHERE role = 'admin'");
    console.log('Admin users:', result.rows);
    
    // If no admin, let's check all users to see their roles
    if (result.rows.length === 0) {
      console.log('\nNo admin users found. Checking all users...');
      const allUsers = await pool.query('SELECT id, email, role FROM users LIMIT 10');
      console.log('All users:', allUsers.rows);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdmin();
