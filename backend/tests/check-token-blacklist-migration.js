const { connectDB, query, gracefulShutdown } = require("../config/database");

async function checkTokenBlacklistTables() {
  console.log("🔍 Checking Token Blacklist Tables Migration Status");
  console.log("=".repeat(60));

  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected successfully");

    // Check if token_blacklist table exists
    console.log("\n1. 📋 Checking token_blacklist table...");
    const blacklistTableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'token_blacklist'
      )
    `);

    if (blacklistTableCheck.rows[0].exists) {
      console.log("✅ token_blacklist table exists");

      // Get table structure
      const tableStructure = await query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'token_blacklist' 
        ORDER BY ordinal_position
      `);

      console.log("\n   📊 Table Structure:");
      tableStructure.rows.forEach((col) => {
        console.log(
          `   - ${col.column_name}: ${col.data_type} ${
            col.is_nullable === "NO" ? "(NOT NULL)" : "(NULLABLE)"
          }`
        );
      });

      // Check indexes
      const indexes = await query(`
        SELECT indexname, indexdef
        FROM pg_indexes 
        WHERE tablename = 'token_blacklist'
      `);

      console.log("\n   🔍 Indexes:");
      indexes.rows.forEach((idx) => {
        console.log(`   - ${idx.indexname}`);
      });
    } else {
      console.log("❌ token_blacklist table does not exist");
    }

    // Check if users table has the new columns
    console.log("\n2. 👤 Checking users table for logout-related columns...");
    const userColumns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('token_invalidation_date', 'last_logout_at')
      ORDER BY column_name
    `);

    if (userColumns.rows.length > 0) {
      console.log("✅ Users table has logout-related columns:");
      userColumns.rows.forEach((col) => {
        console.log(
          `   - ${col.column_name}: ${col.data_type} ${
            col.is_nullable === "NO" ? "(NOT NULL)" : "(NULLABLE)"
          }`
        );
      });
    } else {
      console.log("❌ Users table missing logout-related columns");
    }

    // Test inserting and querying a test token (then clean it up)
    console.log("\n3. 🧪 Testing token blacklist functionality...");
    const testTokenHash = "test_token_hash_123456789";
    const testUserId = 1; // Assuming user ID 1 exists

    try {
      // Insert test token
      await query(
        `
        INSERT INTO token_blacklist (token_hash, user_id, expires_at, reason) 
        VALUES ($1, $2, NOW() + INTERVAL '1 hour', 'logout')
        ON CONFLICT (token_hash) DO NOTHING
      `,
        [testTokenHash, testUserId]
      );

      // Query the token
      const testResult = await query(
        `
        SELECT * FROM token_blacklist WHERE token_hash = $1
      `,
        [testTokenHash]
      );

      if (testResult.rows.length > 0) {
        console.log("✅ Token blacklist insert/query works correctly");
        console.log(
          `   - Test token inserted with ID: ${testResult.rows[0].id}`
        );
      } else {
        console.log("⚠️ Token blacklist insert succeeded but query failed");
      }

      // Clean up test token
      await query(`DELETE FROM token_blacklist WHERE token_hash = $1`, [
        testTokenHash,
      ]);
      console.log("🧹 Test token cleaned up");
    } catch (testError) {
      console.log(
        "❌ Token blacklist functionality test failed:",
        testError.message
      );
    }

    // Get current stats
    console.log("\n4. 📊 Current Statistics...");
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM token_blacklist) as blacklisted_tokens,
        (SELECT COUNT(*) FROM token_blacklist WHERE expires_at > NOW()) as active_blacklisted_tokens,
        (SELECT COUNT(*) FROM users WHERE token_invalidation_date IS NOT NULL) as users_with_invalidation_date
    `);

    console.log(
      `   - Total blacklisted tokens: ${stats.rows[0].blacklisted_tokens}`
    );
    console.log(
      `   - Active blacklisted tokens: ${stats.rows[0].active_blacklisted_tokens}`
    );
    console.log(
      `   - Users with invalidation date: ${stats.rows[0].users_with_invalidation_date}`
    );

    console.log("\n" + "=".repeat(60));
    console.log("🎉 Token blacklist migration verification complete!");
  } catch (error) {
    console.error("\n❌ Error checking tables:", error.message);
    process.exit(1);
  } finally {
    // Close database connection
    try {
      await gracefulShutdown();
      process.exit(0);
    } catch (error) {
      console.error("Error closing database:", error.message);
      process.exit(1);
    }
  }
}

// Run the check
checkTokenBlacklistTables();
