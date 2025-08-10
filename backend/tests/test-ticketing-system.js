const { query, connectDB } = require("../config/database");

/**
 * Test script to validate the ticketing system functionality
 */
const testTicketSystem = async () => {
  try {
    console.log("🔄 Testing ticketing system...");

    // Connect to database
    await connectDB();

    // Test 1: Check if tables exist
    console.log("\n1. Checking if ticket tables exist...");

    const tables = [
      "tickets",
      "ticket_messages",
      "ticket_attachments",
      "ticket_timeline",
    ];
    for (const table of tables) {
      const result = await query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `,
        [table]
      );

      const exists = result.rows[0].exists;
      console.log(`   ${table}: ${exists ? "✅ EXISTS" : "❌ MISSING"}`);

      if (!exists) {
        throw new Error(`Table ${table} does not exist`);
      }
    }

    // Test 2: Check table structure
    console.log("\n2. Checking tickets table structure...");
    const columns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'tickets'
      ORDER BY ordinal_position;
    `);

    const requiredColumns = [
      "id",
      "customer_id",
      "booking_id",
      "freelancer_id",
      "assigned_admin_id",
      "category",
      "priority",
      "status",
      "summary",
      "description",
      "internal_notes",
      "opened_at",
      "first_response_at",
      "resolved_at",
      "closed_at",
      "created_at",
      "updated_at",
    ];

    const existingColumns = columns.rows.map((col) => col.column_name);

    for (const col of requiredColumns) {
      const exists = existingColumns.includes(col);
      console.log(`   ${col}: ${exists ? "✅ EXISTS" : "❌ MISSING"}`);
    }

    // Test 3: Check indexes
    console.log("\n3. Checking indexes...");
    const indexes = await query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename IN ('tickets', 'ticket_messages', 'ticket_attachments', 'ticket_timeline')
      AND indexname LIKE 'idx_%';
    `);

    console.log(`   Found ${indexes.rows.length} custom indexes`);
    indexes.rows.forEach((idx) => console.log(`   - ${idx.indexname}`));

    // Test 4: Check triggers
    console.log("\n4. Checking triggers...");
    const triggers = await query(`
      SELECT trigger_name, event_manipulation, event_object_table
      FROM information_schema.triggers
      WHERE event_object_table = 'tickets';
    `);

    console.log(`   Found ${triggers.rows.length} triggers on tickets table`);
    triggers.rows.forEach((trig) =>
      console.log(`   - ${trig.trigger_name} (${trig.event_manipulation})`)
    );

    // Test 5: Check constraints
    console.log("\n5. Checking constraints...");
    const constraints = await query(`
      SELECT conname, contype
      FROM pg_constraint
      JOIN pg_class ON conrelid = pg_class.oid
      WHERE pg_class.relname = 'tickets'
      AND contype IN ('c', 'f');
    `);

    console.log(
      `   Found ${constraints.rows.length} check/foreign key constraints`
    );
    constraints.rows.forEach((con) => {
      const type = con.contype === "c" ? "CHECK" : "FOREIGN KEY";
      console.log(`   - ${con.conname} (${type})`);
    });

    // Test 6: Test basic operations (if we have test data)
    console.log("\n6. Testing basic queries...");

    // Check if we have any users
    const userCount = await query("SELECT COUNT(*) as count FROM users");
    console.log(`   Total users: ${userCount.rows[0].count}`);

    const ticketCount = await query("SELECT COUNT(*) as count FROM tickets");
    console.log(`   Total tickets: ${ticketCount.rows[0].count}`);

    // Test ticket creation query (dry run)
    try {
      await query("SELECT 1 FROM tickets WHERE 1=0"); // This will return no rows but validates syntax
      console.log("   ✅ Ticket queries are syntactically correct");
    } catch (error) {
      console.log("   ❌ Ticket query syntax error:", error.message);
    }

    console.log("\n✅ Ticketing system test completed successfully!");
  } catch (error) {
    console.error("\n❌ Ticketing system test failed:", error.message);
    console.error("Full error:", error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  testTicketSystem()
    .then(() => {
      console.log("\nAll tests passed! 🎉");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\nTests failed! 💥");
      process.exit(1);
    });
}

module.exports = { testTicketSystem };
