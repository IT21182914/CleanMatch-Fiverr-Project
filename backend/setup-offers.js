require("dotenv").config();
const { query, connectDB } = require("./config/database");

/**
 * Setup the $18 first clean offer for new users with active memberships
 */
async function setupFirstCleanOffer() {
  try {
    console.log("🎯 Setting up First Clean Offer...");

    // Initialize database connection
    await connectDB();

    // Check if the offer already exists
    const existingOfferResult = await query(
      "SELECT * FROM special_offers WHERE offer_type = 'first_clean'"
    );

    if (existingOfferResult.rows.length > 0) {
      console.log("✅ First clean offer already exists:");
      console.log(existingOfferResult.rows[0]);

      // Update the existing offer to ensure it's active and has correct settings
      const updatedOfferResult = await query(
        `UPDATE special_offers 
         SET name = $1,
             description = $2,
             discount_type = $3,
             discount_value = $4,
             conditions = $5,
             is_active = true,
             max_uses_per_user = 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE offer_type = 'first_clean'
         RETURNING *`,
        [
          "First Clean Special - $18",
          "Get your first cleaning service for just $18! Available for new customers with active ForeverClean memberships. Valid for 2, 3, 4, or 6-hour cleaning sessions.",
          "fixed_price",
          18.0,
          JSON.stringify({
            valid_hours: [2, 3, 4, 6],
            requires_membership: true,
            new_customers_only: true,
            description:
              "Special introductory pricing for first-time customers with active memberships",
          }),
        ]
      );

      console.log("✅ Updated existing first clean offer:");
      console.log(updatedOfferResult.rows[0]);
    } else {
      // Create the first clean offer
      const offerResult = await query(
        `INSERT INTO special_offers (
          name, description, offer_type, discount_type, discount_value,
          conditions, is_active, max_uses_per_user, max_total_uses
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          "First Clean Special - $18",
          "Get your first cleaning service for just $18! Available for new customers with active ForeverClean memberships. Valid for 2, 3, 4, or 6-hour cleaning sessions.",
          "first_clean",
          "fixed_price",
          18.0,
          JSON.stringify({
            valid_hours: [2, 3, 4, 6],
            requires_membership: true,
            new_customers_only: true,
            description:
              "Special introductory pricing for first-time customers with active memberships",
          }),
          true, // is_active
          1, // max_uses_per_user
          null, // max_total_uses (unlimited)
        ]
      );

      console.log("✅ Created first clean offer:");
      console.log(offerResult.rows[0]);
    }

    console.log("\n🎉 First Clean Offer setup completed successfully!");
    console.log("\nOffer Details:");
    console.log("- Name: First Clean Special - $18");
    console.log("- Price: Fixed $18 for eligible bookings");
    console.log(
      "- Eligibility: New customers with active ForeverClean memberships"
    );
    console.log("- Valid for: 2, 3, 4, or 6-hour cleaning sessions");
    console.log("- Usage limit: One time per customer");
    console.log("- Status: Active");

    console.log("\n📋 API Endpoints:");
    console.log("- Check eligibility: GET /api/offers/first-clean/eligibility");
    console.log("- Calculate pricing: POST /api/offers/first-clean/calculate");
    console.log("- Admin management: GET/POST/PUT/DELETE /api/offers/admin/*");
  } catch (error) {
    console.error("❌ Error setting up first clean offer:", error);
    throw error;
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupFirstCleanOffer()
    .then(() => {
      console.log("\n✅ Setup completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Setup failed:", error);
      process.exit(1);
    });
}

module.exports = { setupFirstCleanOffer };
