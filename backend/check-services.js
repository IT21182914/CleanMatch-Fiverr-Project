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

async function checkServicesTable() {
  try {
    console.log('🔍 Checking services table...\n');
    
    // Check if services table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'services'
      );
    `);
    
    if (tableExists.rows[0].exists) {
      console.log('✅ Services table exists');
      
      // Check services table schema
      const servicesSchema = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'services'
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 services table columns:');
      servicesSchema.rows.forEach(row => {
        console.log(`- ${row.column_name}: ${row.data_type}`);
      });
      
      // Sample services data
      console.log('\n📝 Sample services data:');
      const sampleData = await pool.query('SELECT id, name, category FROM services LIMIT 3');
      if (sampleData.rows.length > 0) {
        console.log('Services:');
        sampleData.rows.forEach(service => {
          console.log(`- ID: ${service.id}, Name: ${service.name}, Category: ${service.category}`);
        });
      }
    } else {
      console.log('❌ Services table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkServicesTable();
