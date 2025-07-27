const { supabase } = require("./utils/supabaseStorage");

async function testSupabaseConnection() {
  console.log("Testing Supabase connection...");

  try {
    // Test basic connection by listing buckets
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("❌ Supabase connection failed:", error);
      return false;
    }

    console.log("✅ Supabase connection successful!");
    console.log(
      "Available buckets:",
      data.map((bucket) => bucket.name)
    );

    // Check if our bucket exists
    const idProofsBucket = data.find((bucket) => bucket.name === "id-proofs");
    if (idProofsBucket) {
      console.log("✅ id-proofs bucket exists and is ready");
    } else {
      console.log("❌ id-proofs bucket not found");
    }

    return true;
  } catch (error) {
    console.error("❌ Error testing Supabase connection:", error);
    return false;
  }
}

if (require.main === module) {
  testSupabaseConnection();
}

module.exports = { testSupabaseConnection };
