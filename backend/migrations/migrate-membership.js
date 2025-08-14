const { query } = require("../config/database");

const runMembershipMigration = async () => {
  try {
    console.log("🚀 Starting Membership Migration...");

    // Create memberships table
    console.log("📝 Creating memberships table...");
    await query(`
      CREATE TABLE IF NOT EXISTS memberships (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_name VARCHAR(100) NOT NULL DEFAULT 'Basic Plan',
        tier VARCHAR(50) NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic', 'premium', 'gold')),
        monthly_fee DECIMAL(10, 2) NOT NULL DEFAULT 49.00,
        discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 15.00,
        stripe_subscription_id VARCHAR(255) UNIQUE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'trialing')),
        start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        auto_renewal BOOLEAN DEFAULT TRUE,
        billing_cycle_anchor INTEGER,
        trial_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create membership usage tracking table
    console.log("📊 Creating membership_usage table...");
    await query(`
      CREATE TABLE IF NOT EXISTS membership_usage (
        id SERIAL PRIMARY KEY,
        membership_id INTEGER REFERENCES memberships(id) ON DELETE CASCADE,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        discount_applied DECIMAL(10, 2) NOT NULL,
        original_amount DECIMAL(10, 2) NOT NULL,
        discounted_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    console.log("🔍 Creating indexes...");
    await query(`
      CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_memberships_stripe_subscription_id ON memberships(stripe_subscription_id)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_membership_usage_membership_id ON membership_usage(membership_id)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_membership_usage_booking_id ON membership_usage(booking_id)
    `);

    // Migrate existing subscriptions to memberships table (if any)
    console.log("🔄 Migrating existing subscriptions...");
    const existingSubscriptions = await query(`
      SELECT * FROM subscriptions WHERE status = 'active'
    `);

    for (const subscription of existingSubscriptions.rows) {
      // Determine tier based on plan name or default to basic
      let tier = "basic";
      let monthlyFee = 49.0;
      let discountPercentage = 15.0;

      if (subscription.plan_name.toLowerCase().includes("premium")) {
        tier = "premium";
        monthlyFee = 79.0;
        discountPercentage = 25.0;
      } else if (subscription.plan_name.toLowerCase().includes("gold")) {
        tier = "gold";
        monthlyFee = 129.0;
        discountPercentage = 35.0;
      }

      // Check if membership already exists
      const existingMembership = await query(
        "SELECT id FROM memberships WHERE user_id = $1",
        [subscription.user_id]
      );

      if (existingMembership.rows.length === 0) {
        await query(
          `
          INSERT INTO memberships (
            user_id, plan_name, tier, monthly_fee, discount_percentage,
            stripe_subscription_id, status, start_date, current_period_start,
            current_period_end, cancel_at_period_end
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
          [
            subscription.user_id,
            subscription.plan_name || "Basic Plan",
            tier,
            monthlyFee,
            discountPercentage,
            subscription.stripe_subscription_id,
            subscription.status,
            subscription.created_at,
            subscription.current_period_start,
            subscription.current_period_end,
            subscription.cancel_at_period_end,
          ]
        );
        console.log(
          `✅ Migrated subscription for user ${subscription.user_id}`
        );
      }
    }

    console.log("✅ Membership Migration completed successfully!");
    console.log(`
    🎉 Membership System is now ready!
    
    Features implemented:
    ✅ Dynamic membership plans (Basic, Premium, Gold)
    ✅ Automatic discount application during booking
    ✅ Membership management in customer profile
    ✅ Admin membership analytics and management
    ✅ Usage tracking and savings calculation
    ✅ Stripe integration for subscription billing
    ✅ Webhook handling for subscription events
    
    Next steps:
    1. Set up Stripe products and price IDs in environment variables
    2. Configure webhook endpoints in Stripe dashboard
    3. Test membership signup and billing flows
    `);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  const { connectDB } = require("../config/database");

  const runMigration = async () => {
    try {
      await connectDB();
      await runMembershipMigration();
      process.exit(0);
    } catch (error) {
      console.error("Migration failed:", error);
      process.exit(1);
    }
  };

  runMigration();
}

module.exports = { runMembershipMigration };
