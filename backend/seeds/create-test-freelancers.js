require("dotenv").config();
const { query, connectDB } = require("../config/database");
const bcrypt = require("bcryptjs");

/**
 * Create test freelancer users with documents for testing admin approval
 */
const createTestFreelancers = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await connectDB();

    console.log("🔄 Creating test freelancer users...");

    // Sample freelancer data
    const freelancers = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j.freelancer@example.com",
        phone: "555-0101",
        address: "123 Main St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        ssn: "123-45-6789",
        dob: "1990-05-15",
        experience:
          "3 years of professional house cleaning experience. Specialized in deep cleaning and eco-friendly products.",
        transportation: "Own car",
        backgroundCheckConsent: true,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        serviceAreas: ["60601", "60602", "60603"],
      },
      {
        firstName: "Maria",
        lastName: "Rodriguez",
        email: "maria.rodriguez.cleaner@example.com",
        phone: "555-0102",
        address: "456 Oak Ave",
        city: "Chicago",
        state: "IL",
        zipCode: "60610",
        ssn: "987-65-4321",
        dob: "1985-08-22",
        experience:
          "5+ years in residential and commercial cleaning. Excellent references from previous clients.",
        transportation: "Public transit",
        backgroundCheckConsent: true,
        availableDays: [
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        serviceAreas: ["60610", "60611", "60614"],
      },
      {
        firstName: "Jennifer",
        lastName: "Kim",
        email: "jennifer.kim.cleaning@example.com",
        phone: "555-0103",
        address: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zipCode: "60622",
        ssn: "456-78-9123",
        dob: "1992-12-03",
        experience:
          "2 years experience with focus on apartment cleaning and organization services.",
        transportation: "Own car",
        backgroundCheckConsent: true,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"],
        serviceAreas: ["60622", "60623", "60647"],
      },
    ];

    for (const freelancerData of freelancers) {
      console.log(
        `📝 Creating freelancer: ${freelancerData.firstName} ${freelancerData.lastName}`
      );

      // Hash password
      const hashedPassword = await bcrypt.hash("TestPassword123!", 10);

      // Create user account
      const userResult = await query(
        `INSERT INTO users (
          first_name, last_name, email, password, phone, role, 
          address, city, state, zip_code, is_verified, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
        RETURNING id`,
        [
          freelancerData.firstName,
          freelancerData.lastName,
          freelancerData.email,
          hashedPassword,
          freelancerData.phone,
          "cleaner",
          freelancerData.address,
          freelancerData.city,
          freelancerData.state,
          freelancerData.zipCode,
          true,
        ]
      );

      const userId = userResult.rows[0].id;
      console.log(`✅ Created user with ID: ${userId}`);

      // Create cleaner profile
      await query(
        `INSERT INTO cleaner_profiles (
          user_id, bio, experience_years, background_check_status, 
          cleaning_services, preferred_hours, message,
          id_front_url, id_back_url, ssn_front_url, ssn_back_url,
          agreement_accepted, terms_1099_accepted, brings_supplies, has_experience,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())`,
        [
          userId,
          freelancerData.experience,
          3, // experience_years
          "pending", // This is what makes them show up in admin pending list
          [freelancerData.serviceAreas[0]], // cleaning_services array
          JSON.stringify(freelancerData.availableDays), // preferred_hours
          freelancerData.experience, // message
          `/uploads/documents/sample-id-front-${userId}.jpg`, // Mock document paths
          `/uploads/documents/sample-id-back-${userId}.jpg`,
          `/uploads/documents/sample-ssn-front-${userId}.jpg`,
          `/uploads/documents/sample-ssn-back-${userId}.jpg`,
          true, // agreement_accepted
          true, // terms_1099_accepted
          true, // brings_supplies
          true, // has_experience
        ]
      );

      console.log(`✅ Created cleaner profile for ${freelancerData.firstName}`);
    }

    console.log("🎉 All test freelancers created successfully!");
    console.log("\n📋 Test Data Summary:");
    console.log("- 3 freelancer accounts created");
    console.log("- All have 'pending' background check status");
    console.log("- Mock document paths assigned");
    console.log("- Ready for admin approval testing");

    console.log("\n🔐 Login credentials for testing:");
    freelancers.forEach((f, index) => {
      console.log(`${index + 1}. ${f.email} / TestPassword123!`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test freelancers:", error);
    process.exit(1);
  }
};

// Run the script
createTestFreelancers();
