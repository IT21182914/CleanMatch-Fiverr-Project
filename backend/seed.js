require("dotenv").config();
const bcrypt = require("bcryptjs");
const { query, connectDB } = require("./config/database");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123!", 12);
    await query(
      `
      INSERT INTO users (email, password, first_name, last_name, role, is_verified, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
    `,
      [
        "admin@cleanmatch.com",
        adminPassword,
        "Admin",
        "User",
        "admin",
        true,
        true,
      ]
    );

    // Create sample services
    const services = [
      {
        name: "Basic House Cleaning",
        description:
          "Standard cleaning including dusting, vacuuming, mopping, and bathroom cleaning.",
        basePrice: 25.0,
        durationHours: 2,
        category: "Residential",
      },
      {
        name: "Deep House Cleaning",
        description:
          "Comprehensive cleaning including all basic services plus oven, refrigerator, and detailed cleaning.",
        basePrice: 35.0,
        durationHours: 4,
        category: "Residential",
      },
      {
        name: "Office Cleaning",
        description:
          "Professional office cleaning including workstations, conference rooms, and common areas.",
        basePrice: 30.0,
        durationHours: 2,
        category: "Commercial",
      },
      {
        name: "Post-Construction Cleanup",
        description:
          "Specialized cleaning for newly constructed or renovated spaces.",
        basePrice: 40.0,
        durationHours: 6,
        category: "Specialized",
      },
      {
        name: "Move-in/Move-out Cleaning",
        description:
          "Thorough cleaning for property transitions, ensuring everything is spotless.",
        basePrice: 45.0,
        durationHours: 5,
        category: "Specialized",
      },
      {
        name: "Carpet Cleaning",
        description:
          "Professional carpet cleaning using advanced equipment and eco-friendly solutions.",
        basePrice: 20.0,
        durationHours: 2,
        category: "Specialized",
      },
      {
        name: "Window Cleaning",
        description:
          "Interior and exterior window cleaning for a crystal-clear view.",
        basePrice: 15.0,
        durationHours: 1,
        category: "Specialized",
      },
      {
        name: "Apartment Cleaning",
        description:
          "Perfect for small to medium apartments, includes all essential cleaning tasks.",
        basePrice: 20.0,
        durationHours: 1.5,
        category: "Residential",
      },
    ];

    for (const service of services) {
      await query(
        `
        INSERT INTO services (name, description, base_price, duration_hours, category)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (name) DO NOTHING
      `,
        [
          service.name,
          service.description,
          service.basePrice,
          service.durationHours,
          service.category,
        ]
      );
    }

    // Create sample customer
    const customerPassword = await bcrypt.hash("customer123!", 12);
    const customerResult = await query(
      `
      INSERT INTO users (email, password, first_name, last_name, phone, role, address, city, state, zip_code, is_verified, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `,
      [
        "customer@example.com",
        customerPassword,
        "John",
        "Doe",
        "+1234567890",
        "customer",
        "123 Main St",
        "New York",
        "NY",
        "10001",
        true,
        true,
      ]
    );

    // Create sample cleaners
    const cleaners = [
      {
        email: "cleaner1@example.com",
        firstName: "Sarah",
        lastName: "Johnson",
        phone: "+1234567891",
        address: "456 Oak St",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        bio: "Experienced cleaner with 5+ years in residential cleaning.",
        experienceYears: 5,
        hourlyRate: 25.0,
        serviceRadius: 15,
      },
      {
        email: "cleaner2@example.com",
        firstName: "Michael",
        lastName: "Smith",
        phone: "+1234567892",
        address: "789 Pine St",
        city: "New York",
        state: "NY",
        zipCode: "10003",
        bio: "Professional cleaner specializing in deep cleaning and post-construction cleanup.",
        experienceYears: 8,
        hourlyRate: 30.0,
        serviceRadius: 20,
      },
      {
        email: "cleaner3@example.com",
        firstName: "Emily",
        lastName: "Davis",
        phone: "+1234567893",
        address: "321 Elm St",
        city: "New York",
        state: "NY",
        zipCode: "10004",
        bio: "Eco-friendly cleaning specialist with excellent attention to detail.",
        experienceYears: 3,
        hourlyRate: 22.0,
        serviceRadius: 10,
      },
    ];

    for (const cleaner of cleaners) {
      const cleanerPassword = await bcrypt.hash("cleaner123!", 12);

      const cleanerResult = await query(
        `
        INSERT INTO users (email, password, first_name, last_name, phone, role, address, city, state, zip_code, is_verified, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
        [
          cleaner.email,
          cleanerPassword,
          cleaner.firstName,
          cleaner.lastName,
          cleaner.phone,
          "cleaner",
          cleaner.address,
          cleaner.city,
          cleaner.state,
          cleaner.zipCode,
          true,
          true,
        ]
      );

      if (cleanerResult.rows.length > 0) {
        const cleanerId = cleanerResult.rows[0].id;

        // Create cleaner profile
        await query(
          `
          INSERT INTO cleaner_profiles (user_id, bio, experience_years, hourly_rate, service_radius, rating, is_available, background_check_status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (user_id) DO UPDATE SET 
            bio = EXCLUDED.bio,
            experience_years = EXCLUDED.experience_years,
            hourly_rate = EXCLUDED.hourly_rate,
            service_radius = EXCLUDED.service_radius
        `,
          [
            cleanerId,
            cleaner.bio,
            cleaner.experienceYears,
            cleaner.hourlyRate,
            cleaner.serviceRadius,
            4.5,
            true,
            "approved",
          ]
        );
      }
    }

    // Create sample booking
    if (customerResult.rows.length > 0) {
      const customerId = customerResult.rows[0].id;

      // Get a service ID
      const serviceResult = await query("SELECT id FROM services LIMIT 1");
      if (serviceResult.rows.length > 0) {
        const serviceId = serviceResult.rows[0].id;

        // Get a cleaner ID
        const cleanerResult = await query(
          "SELECT id FROM users WHERE role = 'cleaner' LIMIT 1"
        );
        if (cleanerResult.rows.length > 0) {
          const cleanerId = cleanerResult.rows[0].id;

          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          await query(
            `
            INSERT INTO bookings (customer_id, cleaner_id, service_id, booking_date, booking_time, duration_hours, total_amount, status, address, city, state, zip_code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `,
            [
              customerId,
              cleanerId,
              serviceId,
              tomorrow.toISOString().split("T")[0],
              "10:00",
              2,
              50.0,
              "confirmed",
              "123 Main St",
              "New York",
              "NY",
              "10001",
            ]
          );
        }
      }
    }

    console.log("✅ Database seeding completed successfully!");
    console.log("📋 Sample accounts created:");
    console.log("   Admin: admin@cleanmatch.com / admin123!");
    console.log("   Customer: customer@example.com / customer123!");
    console.log(
      "   Cleaners: cleaner1@example.com, cleaner2@example.com, cleaner3@example.com / cleaner123!"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
