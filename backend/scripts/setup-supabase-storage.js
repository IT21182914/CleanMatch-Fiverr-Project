const { createClient } = require("@supabase/supabase-js");
const { createBucketIfNotExists } = require("../utils/supabaseStorage");
require("dotenv").config();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL || "https://vywkpkvvcqibfoskbnga.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d2twa3Z2Y3FpYmZvc2tibmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQxMDA3MiwiZXhwIjoyMDY3OTg2MDcyfQ.0TlrMCSfn0_jX3oz5bpjqowk7sdxOxapsyJfJ1R2NOg"
);

/**
 * Set up Supabase Storage for secure document uploads
 */
async function setupSupabaseStorage() {
  try {
    console.log("🚀 Setting up Supabase Storage for CleanMatch...");

    // Create the id-proofs bucket using existing utility
    await createBucketIfNotExists("id-proofs");

    // List existing buckets to verify
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("❌ Error listing buckets:", listError);
    } else {
      console.log("📋 Available buckets:");
      buckets.forEach((bucket) => {
        console.log(
          `  - ${bucket.name} (${bucket.public ? "public" : "private"})`
        );
      });
    }

    // Test upload functionality
    console.log("\n🧪 Testing upload functionality...");

    const testFileName = `test-${Date.now()}.txt`;
    const testContent = "This is a test file for CleanMatch document uploads";

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("id-proofs")
      .upload(`test/${testFileName}`, testContent, {
        contentType: "text/plain",
      });

    if (uploadError) {
      console.error("❌ Test upload failed:", uploadError);
    } else {
      console.log("✅ Test upload successful");

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("id-proofs")
        .getPublicUrl(`test/${testFileName}`);

      console.log("🔗 Test file URL:", urlData.publicUrl);

      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from("id-proofs")
        .remove([`test/${testFileName}`]);

      if (deleteError) {
        console.error("⚠️  Failed to cleanup test file:", deleteError);
      } else {
        console.log("🧹 Test file cleaned up");
      }
    }

    console.log("\n✅ Supabase Storage setup completed successfully!");
    console.log("\n📝 Document Upload Endpoints:");
    console.log(
      "- POST /api/auth/register-with-documents - Register with document uploads"
    );
    console.log("- Supported fields: idFront, idBack, ssnFront, ssnBack");
    console.log("- Max file size: 10MB per file");
    console.log("- Supported formats: JPEG, PNG, WebP");
    console.log("\n🔐 Security Features:");
    console.log("- Files organized by user ID in separate folders");
    console.log("- Service role key used only on backend");
    console.log("- Automatic cleanup on failed registrations");
    console.log("- Public URLs stored in PostgreSQL database");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

/**
 * Display storage information and statistics
 */
async function displayStorageInfo() {
  try {
    console.log("\n📊 Storage Information:");
    console.log("=".repeat(50));

    const bucketName = "id-proofs";

    // List files in the bucket
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list("", {
        limit: 10,
        offset: 0,
      });

    if (error) {
      console.error("❌ Error listing files:", error);
    } else {
      console.log(`📁 Files in ${bucketName} bucket: ${files.length}`);
      files.forEach((file, index) => {
        if (index < 5) {
          // Show first 5 files
          console.log(
            `  ${index + 1}. ${file.name} (${
              file.metadata?.size || "Unknown size"
            })`
          );
        }
      });
      if (files.length > 5) {
        console.log(`  ... and ${files.length - 5} more files`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to display storage info:", error);
  }
}

// Main execution
async function main() {
  await setupSupabaseStorage();
  await displayStorageInfo();
  console.log("\n🎉 Setup complete! Ready for secure document uploads.");
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupSupabaseStorage, displayStorageInfo };
