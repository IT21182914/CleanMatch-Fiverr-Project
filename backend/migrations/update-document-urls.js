require("dotenv").config();
const { query, connectDB } = require("../config/database");

const updateDocumentUrls = async () => {
  try {
    await connectDB();
    console.log("🔄 Updating document URLs for test freelancers...");

    // Update document URLs for our test freelancers (IDs 34, 35, 36)
    const updates = [
      {
        userId: 34,
        idFront: "/uploads/documents/sample-id-front-34.svg",
        idBack: "/uploads/documents/sample-id-back-34.svg",
        ssnFront: "/uploads/documents/sample-ssn-front-34.svg",
        ssnBack: "/uploads/documents/sample-ssn-back-34.svg",
      },
      {
        userId: 35,
        idFront: "/uploads/documents/sample-id-front-35.svg",
        idBack: "/uploads/documents/sample-id-back-35.svg",
        ssnFront: "/uploads/documents/sample-ssn-front-35.svg",
        ssnBack: "/uploads/documents/sample-ssn-back-35.svg",
      },
      {
        userId: 36,
        idFront: "/uploads/documents/sample-id-front-36.svg",
        idBack: "/uploads/documents/sample-id-back-36.svg",
        ssnFront: "/uploads/documents/sample-ssn-front-36.svg",
        ssnBack: "/uploads/documents/sample-ssn-back-36.svg",
      },
    ];

    for (const update of updates) {
      const result = await query(
        `UPDATE cleaner_profiles 
         SET id_front_url = $1, id_back_url = $2, ssn_front_url = $3, ssn_back_url = $4
         WHERE user_id = $5`,
        [
          update.idFront,
          update.idBack,
          update.ssnFront,
          update.ssnBack,
          update.userId,
        ]
      );

      if (result.rowCount > 0) {
        console.log(`✅ Updated documents for user ID: ${update.userId}`);
      } else {
        console.log(
          `⚠️ No cleaner profile found for user ID: ${update.userId}`
        );
      }
    }

    console.log("\n🎉 Document URLs updated successfully!");
    console.log("🔗 Test the documents at:");
    console.log(
      "   - http://localhost:5000/uploads/documents/sample-id-front-34.svg"
    );
    console.log(
      "   - http://localhost:5000/uploads/documents/sample-id-back-34.svg"
    );
    console.log("   - etc.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating document URLs:", error);
    process.exit(1);
  }
};

updateDocumentUrls();
