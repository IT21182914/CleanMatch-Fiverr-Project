require("dotenv").config();
const { query, connectDB } = require("./config/database");

/**
 * Update services with the comprehensive cleaning services list
 */
async function updateServices() {
  try {
    console.log("🛠️ Updating cleaning services...");

    // Initialize database connection
    await connectDB();
    console.log("✅ Database connected");

    // Clear existing services first
    await query("DELETE FROM services");
    console.log("🗑️ Cleared existing services");

    const services = [
      {
        name: "Cleaning of the house and apartment",
        description:
          "Complete house and apartment cleaning including dusting, vacuuming, mopping floors, cleaning bathrooms and kitchen. Perfect for regular maintenance of your home.",
        base_price: 36.0,
        membership_price: 18.0,
        category: "Residential Cleaning",
        is_active: true,
      },
      {
        name: "Deep Cleaning",
        description:
          "Comprehensive deep cleaning including inside appliances, baseboards, windows, and detailed cleaning of all areas. Great for move-ins or seasonal cleaning.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Deep Cleaning",
        is_active: true,
      },
      {
        name: "Office Cleaning",
        description:
          "Professional office cleaning including desk sanitization, floor maintenance, restroom cleaning, and trash removal. Perfect for businesses and coworking spaces.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Commercial Cleaning",
        is_active: true,
      },
      {
        name: "Move in & out Cleaning",
        description:
          "Thorough cleaning for moving situations. Includes cleaning inside cabinets, appliances, and ensuring the space is move-in ready for new occupants.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Move-in/Move-out",
        is_active: true,
      },
      {
        name: "Glass and Window Cleaning",
        description:
          "Professional interior and exterior window cleaning. Includes screens, sills, and frames for crystal clear windows that let in maximum light.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Window Cleaning",
        is_active: true,
      },
      {
        name: "Disinfect cleaning",
        description:
          "Specialized disinfection cleaning using hospital-grade disinfectants to eliminate germs, bacteria, and viruses from all surfaces.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Specialty Cleaning",
        is_active: true,
      },
      {
        name: "Maid service",
        description:
          "Professional maid service for regular home maintenance including cleaning, organizing, and light housekeeping tasks.",
        base_price: 36.0,
        membership_price: 18.0,
        category: "Residential Cleaning",
        is_active: true,
      },
      {
        name: "Event cleaning",
        description:
          "Pre and post-event cleaning services for parties, corporate events, and special occasions. Includes setup and breakdown cleaning.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Event Cleaning",
        is_active: true,
      },
      {
        name: "Construction cleaning",
        description:
          "Specialized cleaning after construction or renovation work. Includes dust removal, debris cleanup, and detailed cleaning of all surfaces.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Post-Construction",
        is_active: true,
      },
      {
        name: "Shop and Store Cleaning",
        description:
          "Commercial cleaning for retail stores, shops, and boutiques. Includes floor cleaning, display area maintenance, and customer area upkeep.",
        base_price: 36.0,
        membership_price: 18.0,
        category: "Commercial Cleaning",
        is_active: true,
      },
      {
        name: "Hospital & Practice Cleaning",
        description:
          "Medical facility cleaning with strict hygiene protocols. Specialized cleaning for hospitals, clinics, and medical practices.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Medical Cleaning",
        is_active: true,
      },
      {
        name: "Pool Cleaning",
        description:
          "Complete pool maintenance and cleaning including water treatment, debris removal, and pool area sanitization.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Pool Services",
        is_active: true,
      },
      {
        name: "Housekeeping Services",
        description:
          "Comprehensive housekeeping services including cleaning, laundry, organizing, and general home maintenance tasks.",
        base_price: 36.0,
        membership_price: 18.0,
        category: "Residential Cleaning",
        is_active: true,
      },
      {
        name: "Private Jet & Aircraft Cleaning",
        description:
          "Luxury aircraft cleaning services including interior detailing, cabin sanitization, and exterior washing for private jets and aircraft.",
        base_price: 75.0,
        membership_price: 42.0,
        category: "Luxury Services",
        is_active: true,
      },
      {
        name: "Yacht and Ship Cleaning",
        description:
          "Marine vessel cleaning including deck cleaning, interior detailing, and specialized marine cleaning services for yachts and ships.",
        base_price: 65.0,
        membership_price: 32.0,
        category: "Marine Services",
        is_active: true,
      },
      {
        name: "Weeds Cutting & Mowing",
        description:
          "Outdoor maintenance services including weed removal, grass cutting, and lawn mowing for residential and commercial properties.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Outdoor Services",
        is_active: true,
      },
      {
        name: "Industrial Cleaning",
        description:
          "Heavy-duty industrial cleaning for factories, warehouses, and manufacturing facilities using specialized equipment and techniques.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Industrial Cleaning",
        is_active: true,
      },
      {
        name: "Hotel Service",
        description:
          "Hospitality cleaning services for hotels, motels, and bed & breakfasts including room cleaning, common area maintenance, and guest services.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Hospitality Cleaning",
        is_active: true,
      },
      {
        name: "Winter Services",
        description:
          "Seasonal winter cleaning and maintenance services including snow removal, ice treatment, and winter damage cleanup.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Seasonal Services",
        is_active: true,
      },
      {
        name: "Winter garden cleaning",
        description:
          "Specialized cleaning for winter gardens, conservatories, and greenhouse spaces including glass cleaning and plant area maintenance.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Garden Services",
        is_active: true,
      },
      {
        name: "Roof and terrace cleaning",
        description:
          "High-level cleaning services for roofs, terraces, and elevated outdoor spaces including debris removal and surface cleaning.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Exterior Cleaning",
        is_active: true,
      },
      {
        name: "Residential cleaning",
        description:
          "Standard residential cleaning services for homes, apartments, and condominiums including all essential cleaning tasks.",
        base_price: 36.0,
        membership_price: 18.0,
        category: "Residential Cleaning",
        is_active: true,
      },
      {
        name: "Maintenance cleaning",
        description:
          "Regular maintenance cleaning services to keep properties in excellent condition with scheduled cleaning routines.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Maintenance",
        is_active: true,
      },
      {
        name: "Paving stone cleaning",
        description:
          "Specialized cleaning for paved surfaces, driveways, and walkways including pressure washing and stain removal.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Exterior Cleaning",
        is_active: true,
      },
      {
        name: "Parquet cleaning",
        description:
          "Specialized hardwood floor cleaning and maintenance including parquet floors, with proper care techniques and products.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Floor Cleaning",
        is_active: true,
      },
      {
        name: "Facade cleaning",
        description:
          "Building exterior cleaning including facade washing, window cleaning, and building front maintenance for commercial and residential properties.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Exterior Cleaning",
        is_active: true,
      },
      {
        name: "Caretaker service",
        description:
          "Property caretaking services including cleaning, maintenance oversight, and general property care for residential and commercial properties.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Property Management",
        is_active: true,
      },
      {
        name: "Floor cleaning",
        description:
          "Comprehensive floor cleaning services for all types of flooring including hardwood, tile, carpet, and specialty floor surfaces.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Floor Cleaning",
        is_active: true,
      },
      {
        name: "Luxury Villa cleaning and maintenance",
        description:
          "Premium cleaning services for luxury homes and villas including detailed cleaning, maintenance, and concierge-level service.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Luxury Services",
        is_active: true,
      },
      {
        name: "Security Services",
        description:
          "Security-focused cleaning services for sensitive areas including background-checked staff and specialized security protocols.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Security Services",
        is_active: true,
      },
      {
        name: "Carpet and Rug Cleaning",
        description:
          "Professional carpet and rug cleaning using steam cleaning or dry cleaning methods. Removes stains, odors, and deep-seated dirt.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Carpet Cleaning",
        is_active: true,
      },
      {
        name: "Upholstery Cleaning",
        description:
          "Professional furniture and upholstery cleaning for sofas, chairs, and fabric furniture including stain removal and fabric protection.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Furniture Cleaning",
        is_active: true,
      },
      {
        name: "Car Cleaning (Inside and Out)",
        description:
          "Complete automotive cleaning services including interior detailing, exterior washing, and full vehicle maintenance cleaning.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Automotive Cleaning",
        is_active: true,
      },
      {
        name: "Computer & Printer Cleaning",
        description:
          "Specialized electronics cleaning for computers, printers, and office equipment including dust removal and sanitization.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Electronics Cleaning",
        is_active: true,
      },
      {
        name: "Laundry and Ironing Service",
        description:
          "Complete laundry services including washing, drying, ironing, and folding with pickup and delivery options available.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Laundry Services",
        is_active: true,
      },
      {
        name: "Kitchen Deep Cleaning",
        description:
          "Intensive kitchen cleaning including inside oven, refrigerator, microwave, cabinet cleaning, and degreasing of all surfaces.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Kitchen Cleaning",
        is_active: true,
      },
      {
        name: "Billboard Cleaning",
        description:
          "Commercial billboard and sign cleaning services including high-level access cleaning and advertising display maintenance.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Commercial Cleaning",
        is_active: true,
      },
      {
        name: "Ventilation and Filter Cleaning",
        description:
          "HVAC and ventilation system cleaning including air duct cleaning, filter replacement, and ventilation system maintenance.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "HVAC Cleaning",
        is_active: true,
      },
      {
        name: "Sauna deep cleaning",
        description:
          "Specialized sauna and spa cleaning including wood treatment, sanitization, and maintenance of sauna facilities.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Spa Services",
        is_active: true,
      },
      {
        name: "Emergency cleaning services 24/7",
        description:
          "Round-the-clock emergency cleaning services for urgent situations including flood cleanup, accident cleanup, and emergency sanitization.",
        base_price: 99.0,
        membership_price: 45.0,
        category: "Emergency Services",
        is_active: true,
      },
      {
        name: "Mold Removal",
        description:
          "Professional mold remediation and removal services including moisture control, sanitization, and prevention measures.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Remediation Services",
        is_active: true,
      },
      {
        name: "Pest Control",
        description:
          "Integrated pest management services including inspection, treatment, and prevention for residential and commercial properties.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Pest Control",
        is_active: true,
      },
      {
        name: "Janitorial Cleaning",
        description:
          "Professional janitorial services for offices, schools, and commercial buildings including daily maintenance and deep cleaning.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Janitorial Services",
        is_active: true,
      },
      {
        name: "Tile Deep Cleaning (Horizontal & Vertical)",
        description:
          "Comprehensive tile and grout cleaning for floors, walls, and surfaces including stain removal and grout restoration.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Tile Cleaning",
        is_active: true,
      },
      {
        name: "Commercial Cleaning",
        description:
          "Professional commercial cleaning services for businesses, offices, and commercial facilities with flexible scheduling.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Commercial Cleaning",
        is_active: true,
      },
      {
        name: "Warehouse Cleaning",
        description:
          "Large-scale warehouse and distribution center cleaning including floor maintenance, rack cleaning, and industrial facility care.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Industrial Cleaning",
        is_active: true,
      },
      {
        name: "School & University Hall Cleaning",
        description:
          "Educational facility cleaning for schools, universities, and academic institutions including classrooms, halls, and common areas.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Educational Cleaning",
        is_active: true,
      },
      {
        name: "Sports Center Cleaning",
        description:
          "Athletic facility cleaning for gyms, sports centers, and recreational facilities including equipment sanitization and locker room cleaning.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Sports Facility Cleaning",
        is_active: true,
      },
      {
        name: "Staircase Cleaning",
        description:
          "Specialized staircase cleaning for residential and commercial buildings including handrail sanitization and step cleaning.",
        base_price: 45.0,
        membership_price: 22.0,
        category: "Specialty Cleaning",
        is_active: true,
      },
      {
        name: "Airbnb Cleaning",
        description:
          "Vacation rental cleaning services optimized for Airbnb and short-term rentals including turnover cleaning and guest preparation.",
        base_price: 54.0,
        membership_price: 24.0,
        category: "Vacation Rental Cleaning",
        is_active: true,
      },
    ];

    // First, check if the services table has a membership_price column
    try {
      await query(
        "ALTER TABLE services ADD COLUMN IF NOT EXISTS membership_price DECIMAL(10, 2)"
      );
      console.log("✅ Added membership_price column to services table");
    } catch (error) {
      console.log(
        "📝 membership_price column already exists or couldn't be added"
      );
    }

    // Remove duration_hours constraint and make it optional
    try {
      await query(
        "ALTER TABLE services ALTER COLUMN duration_hours DROP NOT NULL"
      );
      console.log("✅ Made duration_hours optional");
    } catch (error) {
      console.log("📝 duration_hours was already optional");
    }

    console.log(`🔄 Inserting ${services.length} services...`);

    for (const service of services) {
      await query(
        `INSERT INTO services (name, description, base_price, membership_price, category, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          service.name,
          service.description,
          service.base_price,
          service.membership_price,
          service.category,
          service.is_active,
        ]
      );
    }

    console.log(`✅ Successfully created ${services.length} cleaning services`);

    // Display summary
    console.log("\n📊 Services Summary:");
    const categoryCounts = {};
    services.forEach((service) => {
      categoryCounts[service.category] =
        (categoryCounts[service.category] || 0) + 1;
    });

    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} services`);
    });

    console.log("\n💰 Pricing Overview:");
    console.log("   Regular prices range from $36-$99 per hour");
    console.log("   Membership prices range from $18-$45 per hour");
    console.log("   Average savings with membership: ~50%");
  } catch (error) {
    console.error("❌ Error updating services:", error);
    throw error;
  }
}

// Run the update if this file is executed directly
if (require.main === module) {
  updateServices()
    .then(() => {
      console.log("\n✅ Services update completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Services update failed:", error);
      process.exit(1);
    });
}

module.exports = { updateServices };
