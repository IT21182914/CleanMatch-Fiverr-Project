const fs = require("fs");
const path = require("path");

// Create sample document images for testing
const createSampleDocuments = async () => {
  const uploadsDir = path.join(__dirname, "uploads", "documents");

  // Ensure uploads/documents directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create a simple SVG document placeholder
  const sampleDocumentSVG = `
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <rect x="20" y="20" width="260" height="160" fill="white" stroke="#d1d5db" stroke-width="2"/>
  <text x="150" y="80" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">SAMPLE DOCUMENT</text>
  <text x="150" y="100" text-anchor="middle" font-family="Arial" font-size="12" fill="#9ca3af">For Testing Purposes</text>
  <text x="150" y="120" text-anchor="middle" font-family="Arial" font-size="10" fill="#d1d5db">CleanMatch Admin System</text>
</svg>`;

  // Document types to create
  const documentTypes = [
    { type: "id-front", label: "ID FRONT" },
    { type: "id-back", label: "ID BACK" },
    { type: "ssn-front", label: "SSN FRONT" },
    { type: "ssn-back", label: "SSN BACK" },
  ];

  // Create documents for user IDs 34, 35, 36 (our test freelancers)
  for (const userId of [34, 35, 36]) {
    for (const doc of documentTypes) {
      const customSVG = sampleDocumentSVG
        .replace("SAMPLE DOCUMENT", doc.label)
        .replace("For Testing Purposes", `User ID: ${userId}`)
        .replace("#f3f4f6", doc.type.includes("id") ? "#eff6ff" : "#f0fdf4");

      const filename = `sample-${doc.type}-${userId}.svg`;
      const filepath = path.join(uploadsDir, filename);

      try {
        fs.writeFileSync(filepath, customSVG);
        console.log(`✅ Created ${filename}`);
      } catch (error) {
        console.error(`❌ Failed to create ${filename}:`, error.message);
      }
    }
  }

  console.log("\n🎉 Sample documents created successfully!");
  console.log("📁 Location:", uploadsDir);
  console.log(
    "🌐 Access via: http://localhost:5000/uploads/documents/[filename]"
  );
};

createSampleDocuments();
