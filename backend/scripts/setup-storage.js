const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client with service role key for backend operations
const supabase = createClient(
  process.env.SUPABASE_URL || "https://vywkpkvvcqibfoskbnga.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d2twa3Z2Y3FpYmZvc2tibmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQxMDA3MiwiZXhwIjoyMDY3OTg2MDcyfQ.0TlrMCSfn0_jX3oz5bpjqowk7sdxOxapsyJfJ1R2NOg"
);

/**
 * Create the id-proofs bucket if it doesn't exist
 */
async function createIdProofsBucket() {
  try {
    console.log("🪣 Creating Supabase storage bucket for ID proofs...");

    // First, check if the bucket already exists
    const { data: existingBuckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("❌ Error listing buckets:", listError);
      return false;
    }

    const bucketExists = existingBuckets.some(
      (bucket) => bucket.name === "id-proofs"
    );

    if (bucketExists) {
      console.log("✅ Bucket 'id-proofs' already exists");
      return true;
    }

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket("id-proofs", {
      public: true, // Make it publicly accessible
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ],
      fileSizeLimit: 10485760, // 10MB
    });

    if (error) {
      console.error("❌ Error creating bucket:", error);
      return false;
    }

    console.log("✅ Successfully created 'id-proofs' bucket:", data);
    return true;
  } catch (error) {
    console.error("❌ Exception creating bucket:", error);
    return false;
  }
}

/**
 * Test the bucket by uploading a test file
 */
async function testBucketUpload() {
  try {
    console.log("🧪 Testing bucket upload...");

    const testContent = Buffer.from("test file content for id proofs bucket");
    const testPath = "test/test-upload.txt";

    const { data, error } = await supabase.storage
      .from("id-proofs")
      .upload(testPath, testContent, {
        contentType: "text/plain",
      });

    if (error) {
      console.error("❌ Test upload failed:", error);
      return false;
    }

    console.log("✅ Test upload successful:", data);

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("id-proofs")
      .getPublicUrl(testPath);

    console.log("🔗 Test file public URL:", urlData.publicUrl);

    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from("id-proofs")
      .remove([testPath]);

    if (deleteError) {
      console.warn("⚠️  Could not delete test file:", deleteError);
    } else {
      console.log("🗑️  Test file cleaned up");
    }

    return true;
  } catch (error) {
    console.error("❌ Exception during test upload:", error);
    return false;
  }
}

/**
 * Main function to set up the storage bucket
 */
async function setupIdProofsStorage() {
  try {
    console.log("🚀 Setting up ID Proofs storage...");

    // Create the bucket
    const bucketCreated = await createIdProofsBucket();
    if (!bucketCreated) {
      throw new Error("Failed to create or access id-proofs bucket");
    }

    // Test the bucket
    const testPassed = await testBucketUpload();
    if (!testPassed) {
      console.warn(
        "⚠️  Bucket created but test upload failed - check permissions"
      );
    }

    console.log("✅ ID Proofs storage setup complete!");
    return true;
  } catch (error) {
    console.error("❌ Failed to setup ID Proofs storage:", error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  setupIdProofsStorage()
    .then((success) => {
      if (success) {
        console.log("\n🎉 Storage setup completed successfully!");
        process.exit(0);
      } else {
        console.log("\n💥 Storage setup failed!");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("\n💥 Fatal error during storage setup:", error);
      process.exit(1);
    });
}

module.exports = {
  setupIdProofsStorage,
  createIdProofsBucket,
  testBucketUpload,
};
