const db = require("./config/database");

async function checkNotificationsSchema() {
  const client = await db.getClient();

  try {
    const result = await client.query(
      `SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = $1 
       ORDER BY ordinal_position`,
      ["notifications"]
    );

    console.log("Notifications table columns:");
    console.table(result.rows);
  } catch (error) {
    console.error("Error checking schema:", error);
  } finally {
    client.release();
    db.pool.end();
  }
}

checkNotificationsSchema();
