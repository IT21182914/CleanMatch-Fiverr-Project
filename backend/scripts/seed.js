require("dotenv").config();
const bcrypt = require("bcryptjs");
const { query, connectDB } = require("../config/database");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    await connectDB();

    // Create admin user
    await seedAdminUser();

    // Create sample services
    await seedServices();

    // Create sample users
    await seedSampleUsers();

    // Create sample bookings
    await seedSampleBookings();

    console.log("✅ Database seeding completed successfully!");
    console.log("📋 Sample accounts created:");
    console.log("   🔐 Admin: admin@CleanMatch.com / admin123!");
    console.log("   👤 Customer: customer@example.com / customer123!");
    console.log(
      "   🧹 Cleaners: cleaner1@example.com, cleaner2@example.com, cleaner3@example.com / cleaner123!"
    );
    console.log("📊 Sample data includes:");
    console.log("   - 10+ professional cleaning services");
    console.log("   - 3 verified cleaners with profiles");
    console.log("   - Sample bookings and reviews");
    console.log("");
    console.log("🚀 Your CleanMatch platform is ready to use!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

const seedAdminUser = async () => {
  try {
    const existingAdmin = await query("SELECT id FROM users WHERE email = $1", [
      "admin@CleanMatch.com",
    ]);

    if (existingAdmin.rows.length > 0) {
      console.log("👤 Admin user already exists, skipping...");
      return;
    }

    const adminPassword = await bcrypt.hash("admin123!", 12);
    await query(
      `INSERT INTO users (
        email, password, first_name, last_name, phone, role, 
        address, city, state, zip_code, is_verified, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        "admin@CleanMatch.com",
        adminPassword,
        "Admin",
        "User",
        "555-0100",
        "admin",
        "123 Admin Plaza",
        "New York",
        "NY",
        "10001",
        true,
        true,
      ]
    );

    console.log("✅ Admin user created: admin@CleanMatch.com");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

const seedServices = async () => {
  try {
    const existingServices = await query("SELECT COUNT(*) FROM services");
    if (parseInt(existingServices.rows[0].count) > 0) {
      console.log("🛠️ Services already exist, skipping...");
      return;
    }

    const services = [
      {
        name: "Standard House Cleaning",
        description:
          "Complete house cleaning including dusting, vacuuming, mopping floors, cleaning bathrooms and kitchen. Perfect for regular maintenance of your home.",
        base_price: 80.0,
        duration_hours: 2,
        category: "Residential Cleaning",
      },
      {
        name: "Deep Cleaning Service",
        description:
          "Comprehensive deep cleaning including inside appliances, baseboards, windows, and detailed cleaning of all areas. Great for move-ins or seasonal cleaning.",
        base_price: 150.0,
        duration_hours: 4,
        category: "Deep Cleaning",
      },
      {
        name: "Office Cleaning",
        description:
          "Professional office cleaning including desk sanitization, floor maintenance, restroom cleaning, and trash removal. Perfect for businesses and coworking spaces.",
        base_price: 120.0,
        duration_hours: 3,
        category: "Office Cleaning",
      },
      {
        name: "Move-in/Move-out Cleaning",
        description:
          "Thorough cleaning for moving situations. Includes cleaning inside cabinets, appliances, and ensuring the space is move-in ready for new occupants.",
        base_price: 200.0,
        duration_hours: 5,
        category: "Move-in/Move-out",
      },
      {
        name: "Post-Construction Cleanup",
        description:
          "Specialized cleaning after construction or renovation work. Includes dust removal, debris cleanup, and detailed cleaning of all surfaces.",
        base_price: 250.0,
        duration_hours: 6,
        category: "Post-Construction",
      },
      {
        name: "Window Cleaning Service",
        description:
          "Professional interior and exterior window cleaning. Includes screens, sills, and frames for crystal clear windows that let in maximum light.",
        base_price: 100.0,
        duration_hours: 2,
        category: "Window Cleaning",
      },
      {
        name: "Carpet Deep Cleaning",
        description:
          "Professional carpet cleaning using steam cleaning or dry cleaning methods. Removes stains, odors, and deep-seated dirt for fresh carpets.",
        base_price: 120.0,
        duration_hours: 3,
        category: "Carpet Cleaning",
      },
      {
        name: "Kitchen Deep Clean",
        description:
          "Intensive kitchen cleaning including inside oven, refrigerator, microwave, cabinet cleaning, and degreasing of all surfaces.",
        base_price: 90.0,
        duration_hours: 2,
        category: "Specialty Cleaning",
      },
      {
        name: "Bathroom Deep Clean",
        description:
          "Thorough bathroom cleaning including tile scrubbing, grout cleaning, fixture polishing, and mold/mildew removal for a sparkling bathroom.",
        base_price: 70.0,
        duration_hours: 1,
        category: "Specialty Cleaning",
      },
      {
        name: "Apartment Cleaning",
        description:
          "Perfect for small to medium apartments, includes all essential cleaning tasks: dusting, vacuuming, mopping, and bathroom cleaning.",
        base_price: 60.0,
        duration_hours: 1.5,
        category: "Residential Cleaning",
      },
      {
        name: "Eco-Friendly Cleaning",
        description:
          "Green cleaning service using only eco-friendly, non-toxic products. Safe for families, pets, and the environment.",
        base_price: 85.0,
        duration_hours: 2,
        category: "Specialty Cleaning",
      },
      {
        name: "Garage Cleaning & Organization",
        description:
          "Complete garage organization and cleaning including floor cleaning, cobweb removal, and organization of storage areas.",
        base_price: 110.0,
        duration_hours: 3,
        category: "Specialty Cleaning",
      },
    ];

    for (const service of services) {
      await query(
        `INSERT INTO services (name, description, base_price, duration_hours, category)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          service.name,
          service.description,
          service.base_price,
          service.duration_hours,
          service.category,
        ]
      );
    }

    console.log(`✅ ${services.length} cleaning services created`);
  } catch (error) {
    console.error("Error seeding services:", error);
  }
};

const seedSampleUsers = async () => {
  try {
    // Create sample customer
    const customerPassword = await bcrypt.hash("customer123!", 12);
    const customerResult = await query(
      `INSERT INTO users (
        email, password, first_name, last_name, phone, role, 
        address, city, state, zip_code, is_verified, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id`,
      [
        "customer@example.com",
        customerPassword,
        "John",
        "Doe",
        "555-0200",
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
        phone: "555-0201",
        address: "456 Oak Street",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        bio: "Experienced professional cleaner with 5+ years in residential and commercial cleaning. Specialized in deep cleaning and eco-friendly solutions. Dedicated to providing spotless results and excellent customer service.",
        experienceYears: 5,
        hourlyRate: 25.0,
        serviceRadius: 15,
        rating: 4.8,
        totalJobs: 127,
      },
      {
        email: "cleaner2@example.com",
        firstName: "Michael",
        lastName: "Smith",
        phone: "555-0202",
        address: "789 Pine Avenue",
        city: "New York",
        state: "NY",
        zipCode: "10003",
        bio: "Professional cleaner specializing in deep cleaning and post-construction cleanup. 8 years of experience with attention to detail and reliable service. Certified in commercial cleaning standards.",
        experienceYears: 8,
        hourlyRate: 30.0,
        serviceRadius: 20,
        rating: 4.9,
        totalJobs: 203,
      },
      {
        email: "cleaner3@example.com",
        firstName: "Emily",
        lastName: "Davis",
        phone: "555-0203",
        address: "321 Elm Boulevard",
        city: "New York",
        state: "NY",
        zipCode: "10004",
        bio: "Eco-friendly cleaning specialist with excellent attention to detail. Passionate about using green products and sustainable cleaning methods. Perfect for families with children and pets.",
        experienceYears: 3,
        hourlyRate: 22.0,
        serviceRadius: 12,
        rating: 4.7,
        totalJobs: 89,
      },
    ];

    for (const cleaner of cleaners) {
      const cleanerPassword = await bcrypt.hash("cleaner123!", 12);

      const cleanerResult = await query(
        `INSERT INTO users (
          email, password, first_name, last_name, phone, role, 
          address, city, state, zip_code, is_verified, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
        RETURNING id`,
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

        // Create cleaner profile with availability schedule
        const availabilitySchedule = {
          monday: { available: true, startTime: "08:00", endTime: "18:00" },
          tuesday: { available: true, startTime: "08:00", endTime: "18:00" },
          wednesday: { available: true, startTime: "08:00", endTime: "18:00" },
          thursday: { available: true, startTime: "08:00", endTime: "18:00" },
          friday: { available: true, startTime: "08:00", endTime: "18:00" },
          saturday: { available: true, startTime: "09:00", endTime: "17:00" },
          sunday: { available: false, startTime: "10:00", endTime: "16:00" },
        };

        await query(
          `INSERT INTO cleaner_profiles (
            user_id, bio, experience_years, hourly_rate, service_radius, 
            rating, total_jobs, is_available, background_check_status, availability_schedule
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (user_id) DO UPDATE SET 
            bio = EXCLUDED.bio,
            experience_years = EXCLUDED.experience_years,
            hourly_rate = EXCLUDED.hourly_rate,
            service_radius = EXCLUDED.service_radius,
            rating = EXCLUDED.rating,
            total_jobs = EXCLUDED.total_jobs`,
          [
            cleanerId,
            cleaner.bio,
            cleaner.experienceYears,
            cleaner.hourlyRate,
            cleaner.serviceRadius,
            cleaner.rating,
            cleaner.totalJobs,
            true,
            "approved",
            JSON.stringify(availabilitySchedule),
          ]
        );
      }
    }

    console.log("✅ Sample users created (1 customer + 3 cleaners)");
  } catch (error) {
    console.error("Error seeding sample users:", error);
  }
};

const seedSampleBookings = async () => {
  try {
    // Get sample data
    const customerResult = await query(
      "SELECT id FROM users WHERE email = 'customer@example.com'"
    );
    const serviceResult = await query(
      "SELECT id FROM services ORDER BY id LIMIT 3"
    );
    const cleanerResult = await query(
      "SELECT id FROM users WHERE role = 'cleaner' ORDER BY id LIMIT 3"
    );

    if (
      customerResult.rows.length === 0 ||
      serviceResult.rows.length === 0 ||
      cleanerResult.rows.length === 0
    ) {
      console.log("⚠️ Insufficient data for sample bookings, skipping...");
      return;
    }

    const customerId = customerResult.rows[0].id;
    const services = serviceResult.rows;
    const cleaners = cleanerResult.rows;

    // Create sample bookings with different statuses
    const bookings = [
      {
        serviceId: services[0].id,
        cleanerId: cleaners[0].id,
        date: getDateString(1), // Tomorrow
        time: "10:00",
        duration: 2,
        amount: 80.0,
        status: "confirmed",
        paymentStatus: "paid",
      },
      {
        serviceId: services[1].id,
        cleanerId: cleaners[1].id,
        date: getDateString(3), // In 3 days
        time: "14:00",
        duration: 4,
        amount: 150.0,
        status: "pending",
        paymentStatus: "pending",
      },
      {
        serviceId: services[2].id,
        cleanerId: cleaners[2].id,
        date: getDateString(-2), // 2 days ago
        time: "09:00",
        duration: 3,
        amount: 120.0,
        status: "completed",
        paymentStatus: "paid",
      },
    ];

    for (const booking of bookings) {
      await query(
        `INSERT INTO bookings (
          customer_id, cleaner_id, service_id, booking_date, booking_time, 
          duration_hours, total_amount, status, payment_status, address, city, state, zip_code
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          customerId,
          booking.cleanerId,
          booking.serviceId,
          booking.date,
          booking.time,
          booking.duration,
          booking.amount,
          booking.status,
          booking.paymentStatus,
          "123 Main St",
          "New York",
          "NY",
          "10001",
        ]
      );
    }

    // Create a sample review for the completed booking
    const completedBookingResult = await query(
      "SELECT id FROM bookings WHERE status = 'completed' LIMIT 1"
    );

    if (completedBookingResult.rows.length > 0) {
      const bookingId = completedBookingResult.rows[0].id;

      await query(
        `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          bookingId,
          customerId,
          cleaners[2].id,
          5,
          "Excellent service! Sarah was very professional and thorough. My office has never looked better. Highly recommend!",
        ]
      );
    }

    console.log("✅ Sample bookings and reviews created");
  } catch (error) {
    console.error("Error seeding sample bookings:", error);
  }
};

// Helper function to get date string
const getDateString = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
