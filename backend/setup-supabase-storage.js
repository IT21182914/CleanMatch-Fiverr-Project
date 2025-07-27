const { createBucketIfNotExists } = require("./utils/supabaseStorage");

async function setupSupabaseStorage() {
  console.log("Setting up Supabase Storage...");

  try {
    await createBucketIfNotExists("id-proofs");
    console.log("✅ Supabase Storage setup completed successfully");
  } catch (error) {
    console.error("❌ Error setting up Supabase Storage:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  setupSupabaseStorage();
}

module.exports = { setupSupabaseStorage };
