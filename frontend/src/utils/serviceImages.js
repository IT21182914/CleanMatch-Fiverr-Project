// Service image mapping based on available images in public/services folder
export const getServiceImage = (serviceName) => {
  // Normalize service name for matching
  const normalizedName = serviceName.toLowerCase().trim();

  // Service name to image path mapping
  const serviceImageMap = {
    // Folder 1 images (.png)
    "construction cleaning": "/services/1/Construction Cleaning.png",
    "deep cleaning": "/services/1/Deep Cleaning.png",
    "disinfect cleaning": "/services/1/Disinfect Cleaning.png",
    "event cleaning": "/services/1/Event Cleaning.png",
    "glass and window cleaning": "/services/1/Glass & Window Cleaning.png",
    "glass & window cleaning": "/services/1/Glass & Window Cleaning.png",
    "cleaning of the house and apartment":
      "/services/1/House & Apartment Cleaning.png",
    "house & apartment cleaning": "/services/1/House & Apartment Cleaning.png",
    "maid service": "/services/1/Maid Service.png",
    "move in & out cleaning": "/services/1/Move InOut Cleaning.png",
    "move inout cleaning": "/services/1/Move InOut Cleaning.png",
    "office cleaning": "/services/1/Office Cleaning.png",
    "shop and store cleaning": "/services/1/Shop & Store Cleaning.png",
    "shop & store cleaning": "/services/1/Shop & Store Cleaning.png",

    // Folder 2 images (.jpg)
    "hospital & practice cleaning":
      "/services/2/HOSPITAL & PRACTICE CLEANING.jpg",
    "hospital and practice cleaning":
      "/services/2/HOSPITAL & PRACTICE CLEANING.jpg",
    "hotel service": "/services/2/HOTEL CLEANING.jpg",
    "hotel cleaning": "/services/2/HOTEL CLEANING.jpg",
    "housekeeping services": "/services/2/HOUSEKEEPING SERVICES.jpg",
    "industrial cleaning": "/services/2/INDUSTRIAL CLEANING.jpg",
    "pool cleaning": "/services/2/Pool Cleaning.jpg",
    "private jet & aircraft cleaning":
      "/services/2/Private Jet & Aircraft Cleaning.jpg",
    "private jet and aircraft cleaning":
      "/services/2/Private Jet & Aircraft Cleaning.jpg",
    "weeds cutting & mowing": "/services/2/Weed Cutting & Mowing.jpg",
    "weed cutting & mowing": "/services/2/Weed Cutting & Mowing.jpg",
    "winter garden cleaning": "/services/2/Winter Garden Cleaning.jpg",
    "winter services": "/services/2/WINTER SERVICES.jpg",
    "yacht and ship cleaning": "/services/2/Yacht and Ship Cleaning.jpg",

    // Folder 3 images (.png)
    "caretaker service": "/services/3/Caretaker Service.png",
    "facade cleaning": "/services/3/Facade Cleaning.png",
    "floor cleaning": "/services/3/Floor Cleaning.png",
    "luxury villa cleaning and maintenance":
      "/services/3/Luxury Villa Cleaning & Maintenance.png",
    "luxury villa cleaning & maintenance":
      "/services/3/Luxury Villa Cleaning & Maintenance.png",
    "maintenance cleaning": "/services/3/Maintenance Cleaning.png",
    "parquet cleaning": "/services/3/Parquet Cleaning.png",
    "paving stone cleaning": "/services/3/Paving Stone Cleaning.png",
    "residential cleaning": "/services/3/Residential Cleaning.png",
    "roof and terrace cleaning": "/services/3/Roof & Terrace Cleaning.png",
    "roof & terrace cleaning": "/services/3/Roof & Terrace Cleaning.png",
    "security services": "/services/3/Security Services.png",

    // Folder 4 images (.png)
    "billboard cleaning": "/services/4/Billboard Cleaning.png",
    "car cleaning (inside & out)":
      "/services/4/Car Cleaning (Inside & Out).png",
    "car cleaning (inside and out)":
      "/services/4/Car Cleaning (Inside & Out).png",
    "carpet and rug cleaning": "/services/4/Carpet and Rug Cleaning.png",
    "computer & printer cleaning":
      "/services/4/Computer & Printer Cleaning.png",
    "computer and printer cleaning":
      "/services/4/Computer & Printer Cleaning.png",
    "emergency cleaning services 24/7":
      "/services/4/Emergency Cleaning Services (247).png",
    "emergency cleaning services (24/7)":
      "/services/4/Emergency Cleaning Services (247).png",
    "kitchen deep cleaning": "/services/4/Kitchen Deep Cleaning.png",
    "laundry and ironing service":
      "/services/4/Laundry and Ironing Service.png",
    "sauna deep cleaning": "/services/4/Sauna Deep Cleaning.png",
    "upholstery cleaning": "/services/4/Upholstery Cleaning.png",
    "ventilation and filter cleaning":
      "/services/4/Ventilation and Filter Cleaning.png",

    // Folder 5 images (.png)
    "airbnb cleaning": "/services/5/Airbnb Cleaning.png",
    "commercial cleaning": "/services/5/Commercial Cleaning.png",
    "janitorial cleaning": "/services/5/Janitorial Cleaning.png",
    "mold removal": "/services/5/Mold Removal.png",
    "pest control": "/services/5/Pest Control.png",
    "school & university hall cleaning":
      "/services/5/School & University Hall Cleaning.png",
    "school and university hall cleaning":
      "/services/5/School & University Hall Cleaning.png",
    "sports center cleaning": "/services/5/Sports Center Cleaning.png",
    "staircase cleaning": "/services/5/Staircase Cleaning.png",
    "tile deep cleaning (horizontal & vertical)":
      "/services/5/Tile Deep Cleaning.png",
    "tile deep cleaning": "/services/5/Tile Deep Cleaning.png",
    "warehouse cleaning": "/services/5/Warehouse Cleaning.png",
  };

  // Try exact match first
  if (serviceImageMap[normalizedName]) {
    return serviceImageMap[normalizedName];
  }

  // Try partial matches for flexibility
  for (const [key, imagePath] of Object.entries(serviceImageMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return imagePath;
    }
  }

  // Default fallback image - you can create a generic cleaning image
  return "/services/1/House & Apartment Cleaning.png";
};

// Helper function to get all available service categories with their images
export const getServiceCategories = () => {
  return [
    {
      name: "Residential",
      image: "/services/1/House & Apartment Cleaning.png",
      description: "Home and apartment cleaning services",
    },
    {
      name: "Commercial",
      image: "/services/1/Office Cleaning.png",
      description: "Business and office cleaning",
    },
    {
      name: "Deep Cleaning",
      image: "/services/1/Deep Cleaning.png",
      description: "Comprehensive deep cleaning services",
    },
    {
      name: "Specialized",
      image: "/services/4/Carpet and Rug Cleaning.png",
      description: "Specialized cleaning services",
    },
    {
      name: "Luxury",
      image: "/services/2/Private Jet & Aircraft Cleaning.jpg",
      description: "Premium luxury cleaning services",
    },
    {
      name: "Health & Safety",
      image: "/services/1/Disinfect Cleaning.png",
      description: "Health and safety focused cleaning",
    },
  ];
};
