const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL || "https://vywkpkvvcqibfoskbnga.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d2twa3Z2Y3FpYmZvc2tibmdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQxMDA3MiwiZXhwIjoyMDY3OTg2MDcyfQ.0TlrMCSfn0_jX3oz5bpjqowk7sdxOxapsyJfJ1R2NOg"
);

/**
 * Test CORS by trying to fetch images from different origins
 */
async function testCORSAccess() {
  try {
    console.log("🌐 Testing CORS access to Supabase storage...");

    const testUrl =
      "https://vywkpkvvcqibfoskbnga.supabase.co/storage/v1/object/public/id-proofs/user-62/id-front/9215ad81-3846-4792-99e5-ba2f509684ab.png";

    console.log("🔗 Testing URL:", testUrl);

    // Test with fetch
    try {
      const response = await fetch(testUrl, {
        method: "HEAD", // Just check headers
        mode: "cors",
      });

      console.log(
        `✅ Fetch response: ${response.status} ${response.statusText}`
      );
      console.log("📋 Response headers:");

      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      if (response.status === 200) {
        console.log("✅ File is accessible via CORS");
      } else {
        console.log("❌ File returned non-200 status");
      }
    } catch (fetchError) {
      console.log("❌ CORS fetch failed:", fetchError.message);
    }

    // Test with a regular GET
    try {
      const fullResponse = await fetch(testUrl);
      console.log(`\n📊 Full fetch response: ${fullResponse.status}`);

      if (fullResponse.ok) {
        const contentType = fullResponse.headers.get("content-type");
        const contentLength = fullResponse.headers.get("content-length");
        console.log(`✅ Content-Type: ${contentType}`);
        console.log(`✅ Content-Length: ${contentLength}`);
      }
    } catch (error) {
      console.log("❌ Full fetch failed:", error.message);
    }
  } catch (error) {
    console.error("❌ Exception during CORS test:", error);
  }
}

/**
 * Create a simple HTML test page to test image loading
 */
async function createImageTest() {
  try {
    console.log("\n🧪 Creating image loading test...");

    const testUrl =
      "https://vywkpkvvcqibfoskbnga.supabase.co/storage/v1/object/public/id-proofs/user-62/id-front/9215ad81-3846-4792-99e5-ba2f509684ab.png";

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Image Test</title>
</head>
<body>
    <h1>Document Image Test</h1>
    
    <h2>Direct Image Tag</h2>
    <img id="testImage" src="${testUrl}" alt="Test Document" 
         style="max-width: 300px; border: 2px solid #ccc;" 
         onload="console.log('Image loaded successfully')"
         onerror="console.error('Image failed to load')" />
    
    <h2>URL Information</h2>
    <p><strong>URL:</strong> <a href="${testUrl}" target="_blank">${testUrl}</a></p>
    
    <h2>JavaScript Test</h2>
    <button onclick="testImageLoad()">Test Image Load with JavaScript</button>
    <div id="result"></div>
    
    <script>
        function testImageLoad() {
            const resultDiv = document.getElementById('result');
            const img = new Image();
            
            img.onload = function() {
                resultDiv.innerHTML = '<p style="color: green;">✅ Image loaded successfully via JavaScript</p>';
                console.log('Image dimensions:', img.width, 'x', img.height);
            };
            
            img.onerror = function(e) {
                resultDiv.innerHTML = '<p style="color: red;">❌ Image failed to load via JavaScript</p>';
                console.error('Image load error:', e);
            };
            
            img.src = '${testUrl}';
        }
        
        // Test on page load
        window.onload = function() {
            console.log('Testing image load...');
            testImageLoad();
        };
    </script>
</body>
</html>
    `;

    const fs = require("fs");
    const path = require("path");

    const testFilePath = path.join(__dirname, "..", "test-image-load.html");
    fs.writeFileSync(testFilePath, htmlContent);

    console.log(`✅ Created test file: ${testFilePath}`);
    console.log("📖 Open this file in your browser to test image loading");
  } catch (error) {
    console.error("❌ Error creating test file:", error);
  }
}

/**
 * Check bucket configuration
 */
async function checkBucketConfig() {
  try {
    console.log("\n🪣 Checking bucket configuration...");

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("❌ Error listing buckets:", error);
      return;
    }

    const idProofsBucket = buckets.find(
      (bucket) => bucket.name === "id-proofs"
    );

    if (!idProofsBucket) {
      console.log("❌ id-proofs bucket not found");
      return;
    }

    console.log("✅ Bucket found:");
    console.log(`  Name: ${idProofsBucket.name}`);
    console.log(`  ID: ${idProofsBucket.id}`);
    console.log(`  Public: ${idProofsBucket.public}`);
    console.log(`  Created: ${idProofsBucket.created_at}`);
    console.log(`  Updated: ${idProofsBucket.updated_at}`);

    if (!idProofsBucket.public) {
      console.log("⚠️  Bucket is not public - this may cause access issues");
    } else {
      console.log("✅ Bucket is public");
    }
  } catch (error) {
    console.error("❌ Exception checking bucket config:", error);
  }
}

/**
 * Main diagnostic function
 */
async function diagnoseImageLoadIssues() {
  try {
    console.log("🔍 Diagnosing image loading issues...");

    await checkBucketConfig();
    await testCORSAccess();
    await createImageTest();

    console.log("\n🎯 Summary:");
    console.log("1. Check if the bucket is public");
    console.log("2. Test CORS access from browser");
    console.log("3. Open the generated HTML test file in browser");
    console.log("4. Check browser console for detailed errors");
  } catch (error) {
    console.error("❌ Fatal error during diagnosis:", error);
  }
}

// Run if called directly
if (require.main === module) {
  diagnoseImageLoadIssues()
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
  diagnoseImageLoadIssues,
  testCORSAccess,
  checkBucketConfig,
};
