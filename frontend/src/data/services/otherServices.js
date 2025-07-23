import { serviceIcons } from "./serviceIcons";

export const otherServices = [
  // Event Services
  {
    id: 8,
    name: "Event cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Event Services",
    icon: serviceIcons.CalendarIcon,
    description:
      "Pre and post-event cleaning services to ensure your venue is perfect for guests and spotless afterward.",
    features: [
      "Pre-event setup",
      "During event support",
      "Post-event cleanup",
      "Venue restoration",
    ],
  },

  // Hospitality
  {
    id: 18,
    name: "Hotel Service",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Hospitality",
    icon: serviceIcons.KeyIcon,
    description:
      "Complete hotel cleaning services including guest rooms, common areas, and facilities.",
    features: [
      "Room turnover",
      "Hospitality standards",
      "Guest satisfaction",
      "24/7 availability",
    ],
  },
  {
    id: 50,
    name: "Airbnb Cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Hospitality",
    icon: serviceIcons.KeyIcon,
    description:
      "Short-term rental cleaning services to ensure 5-star guest experiences.",
    features: [
      "Turnover cleaning",
      "Guest standards",
      "Quick turnaround",
      "Host support",
    ],
  },

  // Seasonal
  {
    id: 19,
    name: "Winter Services",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Seasonal",
    icon: serviceIcons.SunIcon,
    description:
      "Specialized winter cleaning services including snow removal and seasonal maintenance.",
    features: [
      "Snow removal",
      "Ice treatment",
      "Winter prep",
      "Seasonal storage",
    ],
  },
  {
    id: 20,
    name: "Winter garden cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Seasonal",
    icon: serviceIcons.SunIcon,
    description:
      "Greenhouse and winter garden maintenance to keep your plants thriving year-round.",
    features: [
      "Plant care",
      "Glass cleaning",
      "Humidity control",
      "Pest prevention",
    ],
  },

  // Maintenance
  {
    id: 23,
    name: "Maintenance cleaning",
    memberPrice: "$22/h",
    regularPrice: "$45/h",
    category: "Maintenance",
    icon: serviceIcons.WrenchScrewdriverIcon,
    description:
      "Regular maintenance cleaning to keep properties in optimal condition year-round.",
    features: [
      "Preventive care",
      "Regular inspections",
      "Minor repairs",
      "Maintenance logs",
    ],
  },
  {
    id: 27,
    name: "Caretaker service",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Maintenance",
    icon: serviceIcons.KeyIcon,
    description:
      "Comprehensive caretaker services for property management and maintenance oversight.",
    features: [
      "Property oversight",
      "Security monitoring",
      "Maintenance coordination",
      "Emergency response",
    ],
  },

  // Security
  {
    id: 30,
    name: "Security Services",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Security",
    icon: serviceIcons.ShieldCheckIcon,
    description:
      "Security-conscious cleaning services with background-checked and bonded professionals.",
    features: [
      "Background checks",
      "Security protocols",
      "Confidentiality",
      "Bonded staff",
    ],
  },

  // Automotive
  {
    id: 33,
    name: "Car Cleaning (Inside and Out)",
    memberPrice: "$22/h",
    regularPrice: "$45/h",
    category: "Automotive",
    icon: serviceIcons.TruckIcon,
    description:
      "Complete automotive cleaning services including interior detailing and exterior washing.",
    features: [
      "Interior detailing",
      "Exterior wash",
      "Wax protection",
      "Tire care",
    ],
  },

  // Technology
  {
    id: 34,
    name: "Computer & Printer Cleaning",
    memberPrice: "$22/h",
    regularPrice: "$45/h",
    category: "Technology",
    icon: serviceIcons.ComputerDesktopIcon,
    description:
      "Specialized cleaning for computers, printers, and electronic equipment.",
    features: [
      "Dust removal",
      "Screen cleaning",
      "Keyboard sanitization",
      "Cable management",
    ],
  },

  // Personal Services
  {
    id: 35,
    name: "Laundry and Ironing Service",
    memberPrice: "$22/h",
    regularPrice: "$45/h",
    category: "Personal Services",
    icon: serviceIcons.ScissorsIcon,
    description:
      "Professional laundry and ironing services with care for all fabric types.",
    features: [
      "Fabric care",
      "Professional pressing",
      "Stain treatment",
      "Pickup & delivery",
    ],
  },

  // HVAC
  {
    id: 38,
    name: "Ventilation and Filter Cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "HVAC",
    icon: serviceIcons.FunnelIcon,
    description:
      "HVAC system cleaning including vents, ducts, and filters for improved air quality.",
    features: [
      "Duct cleaning",
      "Filter replacement",
      "Air quality improvement",
      "System efficiency",
    ],
  },

  // Wellness
  {
    id: 39,
    name: "Sauna deep cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Wellness",
    icon: serviceIcons.FireIcon,
    description:
      "Specialized sauna and spa cleaning with attention to hygiene and relaxation standards.",
    features: [
      "Heat-resistant cleaning",
      "Sanitization",
      "Wood care",
      "Humidity control",
    ],
  },

  // Emergency
  {
    id: 40,
    name: "Emergency cleaning services 24/7",
    memberPrice: "$45/h",
    regularPrice: "$99/h",
    category: "Emergency",
    icon: serviceIcons.ExclamationTriangleIcon,
    description:
      "Round-the-clock emergency cleaning services for urgent situations and disasters.",
    features: [
      "24/7 availability",
      "Rapid response",
      "Disaster cleanup",
      "Emergency protocols",
    ],
    emergency: true,
  },

  // Educational
  {
    id: 47,
    name: "School & University Hall Cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Educational",
    icon: serviceIcons.AcademicCapIcon,
    description:
      "Educational facility cleaning with focus on health, safety, and learning environments.",
    features: [
      "Classroom cleaning",
      "Common areas",
      "Health protocols",
      "Student safety",
    ],
  },

  // Sports & Recreation
  {
    id: 48,
    name: "Sports Center Cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Sports & Recreation",
    icon: serviceIcons.TrophyIcon,
    description:
      "Athletic facility cleaning including locker rooms, equipment, and playing surfaces.",
    features: [
      "Locker rooms",
      "Equipment cleaning",
      "Playing surfaces",
      "Sanitization",
    ],
  },
];
