const { query, getClient } = require("../config/database");

/**
 * Migration to add location columns to bookings table
 * This allows storing customer location coordinates for better cleaner matching
 */
const addLocationToBookings = async () => {
  const client = await getClient();
  
  try {
    console.log("Starting migration: Add location columns to bookings...");
    
    await client.query("BEGIN");
    
    // Add latitude and longitude columns to bookings table
    await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS customer_latitude DECIMAL(10, 8),
      ADD COLUMN IF NOT EXISTS customer_longitude DECIMAL(11, 8)
    `);
    
    // Add index for location-based queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_customer_location 
      ON bookings(customer_latitude, customer_longitude) 
      WHERE customer_latitude IS NOT NULL AND customer_longitude IS NOT NULL
    `);
    
    await client.query("COMMIT");
    
    console.log("✅ Successfully added location columns to bookings table");
    console.log("   - Added customer_latitude column");
    console.log("   - Added customer_longitude column");
    console.log("   - Added location index for better query performance");
    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  addLocationToBookings()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

module.exports = { addLocationToBookings };
