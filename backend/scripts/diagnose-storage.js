const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL || "https://vywkpkvvcqibfoskbnga.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d2twa3Z2Y3FpYmZvc2tibmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQxMDA3MiwiZXhwIjoyMDY3OTg2MDcyfQ.0TlrMCSfn0_jX3oz5bpjqowk7sdxOxapsyJfJ1R2NOg"
);

/**
 * Check specific files that are failing to load
 */
async function checkFailingFiles() {
  try {
    console.log("🔍 Checking failing document files...");

    // Files from the error screenshots
    const failingFiles = [
      "user-62/id-front/9215ad81-3846-4792-99e5-ba2f509684ab.png",
      "user-62/id-back/4e349f64-f90e-4b7b-a6e3-d4dbbd92657e.png",
    ];

    for (const filePath of failingFiles) {
      console.log(`\n📄 Checking: ${filePath}`);

      // Try to get file info
      const { data, error } = await supabase.storage
        .from("id-proofs")
        .list(filePath.split("/").slice(0, -1).join("/"), {
          limit: 100,
          search: filePath.split("/").pop().split(".")[0], // Search by filename without extension
        });

      if (error) {
        console.log(`❌ Error listing files: ${error.message}`);
      } else {
        console.log(`📋 Files found: ${data.length}`);
        data.forEach((file) => {
          console.log(
            `  - ${file.name} (${file.metadata?.size || "unknown size"})`
          );
        });
      }

      // Try to get public URL
      const { data: urlData } = supabase.storage
        .from("id-proofs")
        .getPublicUrl(filePath);

      console.log(`🔗 Public URL: ${urlData.publicUrl}`);

      // Try to download the file
      const { data: downloadData, error: downloadError } =
        await supabase.storage.from("id-proofs").download(filePath);

      if (downloadError) {
        console.log(`❌ Download error: ${downloadError.message}`);
      } else {
        console.log(
          `✅ File exists and can be downloaded (${downloadData.size} bytes)`
        );
      }
    }
  } catch (error) {
    console.error("❌ Exception while checking files:", error);
  }
}

/**
 * List all files in the bucket
 */
async function listAllFiles() {
  try {
    console.log("\n📁 Listing all files in id-proofs bucket...");

    const { data, error } = await supabase.storage.from("id-proofs").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("❌ Error listing files:", error);
      return;
    }

    console.log(`📋 Found ${data.length} items in root:`);
    data.forEach((item) => {
      console.log(`  ${item.name}/ (${item.metadata?.size || "folder"})`);
    });

    // List user folders
    const userFolders = data.filter((item) => item.name.startsWith("user-"));

    for (const folder of userFolders.slice(0, 3)) {
      // Check first 3 user folders
      console.log(`\n📂 Checking folder: ${folder.name}`);

      const { data: folderContents, error: folderError } =
        await supabase.storage
          .from("id-proofs")
          .list(folder.name, { limit: 50 });

      if (folderError) {
        console.log(`  ❌ Error: ${folderError.message}`);
      } else {
        console.log(`  📄 Contains ${folderContents.length} items:`);
        folderContents.forEach((file) => {
          console.log(
            `    - ${file.name} (${file.metadata?.size || "unknown"} bytes)`
          );
        });
      }
    }
  } catch (error) {
    console.error("❌ Exception while listing files:", error);
  }
}

/**
 * Main diagnostic function
 */
async function diagnoseStorageIssues() {
  try {
    console.log("🩺 Diagnosing Supabase storage issues...");

    await checkFailingFiles();
    await listAllFiles();

    console.log("\n✅ Diagnosis complete!");
  } catch (error) {
    console.error("❌ Fatal error during diagnosis:", error);
  }
}

// Run if called directly
if (require.main === module) {
  diagnoseStorageIssues()
    .then(() => {
      console.log("\n🎉 Diagnosis completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Fatal error:", error);
      process.exit(1);
    });
}

module.exports = {
  diagnoseStorageIssues,
  checkFailingFiles,
  listAllFiles,
};
