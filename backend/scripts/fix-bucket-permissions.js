const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL || "https://vywkpkvvcqibfoskbnga.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d2twa3Z2Y3FpYmZvc2tibmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQxMDA3MiwiZXhwIjoyMDY3OTg2MDcyfQ.0TlrMCSfn0_jX3oz5bpjqowk7sdxOxapsyJfJ1R2NOg"
);

/**
 * Make the id-proofs bucket public
 */
async function makeBucketPublic() {
  try {
    console.log("🔓 Making id-proofs bucket public...");

    const { data, error } = await supabase.storage.updateBucket("id-proofs", {
      public: true,
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ],
      fileSizeLimit: 10485760, // 10MB
    });

    if (error) {
      console.error("❌ Error making bucket public:", error);
      return false;
    }

    console.log("✅ Successfully made bucket public:", data);
    return true;
  } catch (error) {
    console.error("❌ Exception making bucket public:", error);
    return false;
  }
}

/**
 * Test image access after making bucket public
 */
async function testImageAccessAfterFix() {
  try {
    console.log("\n🧪 Testing image access after fix...");

    const testUrl =
      "https://vywkpkvvcqibfoskbnga.supabase.co/storage/v1/object/public/id-proofs/user-62/id-front/9215ad81-3846-4792-99e5-ba2f509684ab.png";

    // Test with fetch
    const response = await fetch(testUrl);
    console.log(
      `📊 Response status: ${response.status} ${response.statusText}`
    );

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      const contentLength = response.headers.get("content-length");
      console.log(`✅ Content-Type: ${contentType}`);
      console.log(`✅ Content-Length: ${contentLength} bytes`);
      console.log("🎉 Image is now accessible!");
      return true;
    } else {
      console.log("❌ Image still not accessible");

      // Try to get error details
      try {
        const errorText = await response.text();
        console.log("Error details:", errorText);
      } catch (e) {
        console.log("Could not get error details");
      }

      return false;
    }
  } catch (error) {
    console.error("❌ Exception testing image access:", error);
    return false;
  }
}

/**
 * Verify bucket is now public
 */
async function verifyBucketPublic() {
  try {
    console.log("\n🔍 Verifying bucket is now public...");

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("❌ Error listing buckets:", error);
      return false;
    }

    const idProofsBucket = buckets.find(
      (bucket) => bucket.name === "id-proofs"
    );

    if (!idProofsBucket) {
      console.log("❌ id-proofs bucket not found");
      return false;
    }

    console.log("📋 Bucket status:");
    console.log(`  Public: ${idProofsBucket.public}`);

    if (idProofsBucket.public) {
      console.log("✅ Bucket is now public!");
      return true;
    } else {
      console.log("❌ Bucket is still not public");
      return false;
    }
  } catch (error) {
    console.error("❌ Exception verifying bucket:", error);
    return false;
  }
}

/**
 * Main function to fix the bucket permissions
 */
async function fixBucketPermissions() {
  try {
    console.log("🔧 Fixing bucket permissions...");

    // Make bucket public
    const publicSuccess = await makeBucketPublic();
    if (!publicSuccess) {
      throw new Error("Failed to make bucket public");
    }

    // Verify it's now public
    const verifySuccess = await verifyBucketPublic();
    if (!verifySuccess) {
      throw new Error("Failed to verify bucket is public");
    }

    // Test image access
    const testSuccess = await testImageAccessAfterFix();
    if (!testSuccess) {
      console.warn("⚠️  Bucket is public but images may still have issues");
    }

    console.log("\n🎉 Bucket permissions fixed!");
    console.log(
      "👀 You should now be able to view documents in the admin panel"
    );

    return true;
  } catch (error) {
    console.error("❌ Failed to fix bucket permissions:", error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  fixBucketPermissions()
    .then((success) => {
      if (success) {
        console.log("\n✅ Fix completed successfully!");
        console.log("🔄 Refresh the admin page to see the documents");
        process.exit(0);
      } else {
        console.log("\n💥 Fix failed!");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("\n💥 Fatal error:", error);
      process.exit(1);
    });
}

module.exports = {
  fixBucketPermissions,
  makeBucketPublic,
  verifyBucketPublic,
  testImageAccessAfterFix,
};
