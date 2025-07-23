import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  SparklesIcon,
  HomeIcon,
  BuildingOffice2Icon,
  TruckIcon,
  WindowIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  BeakerIcon,
  CogIcon,
  CommandLineIcon,
  CloudIcon,
  SunIcon,
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  ClockIcon,
  MapPinIcon,
  KeyIcon,
  CurrencyDollarIcon,
  ComputerDesktopIcon,
  PrinterIcon,
  ScissorsIcon,
  FireIcon,
  MegaphoneIcon,
  FunnelIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  BugAntIcon,
  BriefcaseIcon,
  Squares2X2Icon,
  AcademicCapIcon,
  TrophyIcon,
  ChevronRightIcon,
  StarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const ServicesDropdown = ({ isOpen, onClose, className = "" }) => {
  const [hoveredService, setHoveredService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const services = [
    {
      id: 1,
      name: "Cleaning of the house and apartment",
      memberPrice: "$18/h",
      regularPrice: "$36/h",
      category: "Residential",
      icon: HomeIcon,
      description:
        "Complete house and apartment cleaning including all rooms, surfaces, and common areas. Perfect for maintaining a spotless living environment.",
      features: [
        "All rooms cleaned",
        "Kitchen & bathroom deep clean",
        "Dusting & vacuuming",
        "Trash removal",
      ],
      popular: true,
    },
    {
      id: 2,
      name: "Deep Cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Residential",
      icon: SparklesIcon,
      description:
        "Comprehensive deep cleaning service that reaches every corner. Ideal for seasonal cleaning or move-in preparation.",
      features: [
        "Inside appliances",
        "Baseboards & windows",
        "Cabinet interiors",
        "Light fixtures",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "Office Cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Commercial",
      icon: BuildingOffice2Icon,
      description:
        "Professional office cleaning services to maintain a productive and healthy workplace environment.",
      features: [
        "Desk sanitization",
        "Floor maintenance",
        "Restroom cleaning",
        "Common areas",
      ],
    },
    {
      id: 4,
      name: "Move in & out Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Specialized",
      icon: TruckIcon,
      description:
        "Thorough cleaning for moving situations. Ensure your old home is spotless or your new home is move-in ready.",
      features: [
        "Complete property clean",
        "Inside appliances",
        "All surfaces",
        "Final inspection",
      ],
    },
    {
      id: 5,
      name: "Glass and Window Cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Specialized",
      icon: WindowIcon,
      description:
        "Professional window and glass cleaning for crystal-clear views and enhanced natural light.",
      features: [
        "Interior & exterior windows",
        "Glass doors",
        "Mirrors",
        "Glass surfaces",
      ],
    },
    {
      id: 6,
      name: "Disinfect cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Health & Safety",
      icon: ShieldCheckIcon,
      description:
        "Advanced disinfection cleaning using hospital-grade products for maximum health protection.",
      features: [
        "EPA-approved disinfectants",
        "High-touch surfaces",
        "Air quality improvement",
        "Health certification",
      ],
    },
    {
      id: 7,
      name: "Maid service",
      memberPrice: "$18/h",
      regularPrice: "$36/h",
      category: "Residential",
      icon: UserGroupIcon,
      description:
        "Regular maid service for ongoing home maintenance and housekeeping needs.",
      features: [
        "Scheduled visits",
        "Consistent quality",
        "Trusted professionals",
        "Flexible scheduling",
      ],
    },
    {
      id: 8,
      name: "Event cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Event Services",
      icon: CalendarIcon,
      description:
        "Pre and post-event cleaning services to ensure your venue is perfect for guests and spotless afterward.",
      features: [
        "Pre-event setup",
        "During event support",
        "Post-event cleanup",
        "Venue restoration",
      ],
    },
    {
      id: 9,
      name: "Construction cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Commercial",
      icon: WrenchScrewdriverIcon,
      description:
        "Specialized post-construction cleaning to remove debris, dust, and prepare spaces for occupancy.",
      features: [
        "Debris removal",
        "Dust elimination",
        "Surface preparation",
        "Final walkthrough",
      ],
    },
    {
      id: 10,
      name: "Shop and Store Cleaning",
      memberPrice: "$18/h",
      regularPrice: "$36/h",
      category: "Commercial",
      icon: BuildingStorefrontIcon,
      description:
        "Retail space cleaning to maintain a welcoming environment for customers and staff.",
      features: [
        "Sales floor cleaning",
        "Fitting rooms",
        "Storage areas",
        "Customer restrooms",
      ],
    },
    {
      id: 11,
      name: "Hospital & Practice Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Health & Safety",
      icon: HeartIcon,
      description:
        "Medical facility cleaning with strict hygiene protocols and specialized equipment.",
      features: [
        "Medical-grade disinfection",
        "HIPAA compliance",
        "Biohazard handling",
        "Sterile environments",
      ],
    },
    {
      id: 12,
      name: "Pool Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Outdoor",
      icon: BeakerIcon,
      description:
        "Complete pool and spa cleaning services including water treatment and equipment maintenance.",
      features: [
        "Water chemistry balance",
        "Filter cleaning",
        "Skimming & vacuuming",
        "Equipment check",
      ],
    },
    {
      id: 13,
      name: "Housekeeping Services",
      memberPrice: "$18/h",
      regularPrice: "$36/h",
      category: "Residential",
      icon: HomeIcon,
      description:
        "Comprehensive housekeeping services for daily, weekly, or monthly home maintenance.",
      features: [
        "Regular maintenance",
        "Laundry service",
        "Organization",
        "Deep cleaning options",
      ],
    },
    {
      id: 14,
      name: "Private Jet & Aircraft Cleaning",
      memberPrice: "$42/h",
      regularPrice: "$75/h",
      category: "Luxury",
      icon: CommandLineIcon,
      description:
        "Specialized aircraft cleaning services meeting aviation industry standards and luxury expectations.",
      features: [
        "Interior detailing",
        "Exterior washing",
        "Safety compliance",
        "Luxury finishes",
      ],
      premium: true,
    },
    {
      id: 15,
      name: "Yacht and Ship Cleaning",
      memberPrice: "$32/h",
      regularPrice: "$65/h",
      category: "Luxury",
      icon: CloudIcon,
      description:
        "Marine vessel cleaning services for yachts, boats, and ships with specialized marine products.",
      features: [
        "Deck cleaning",
        "Interior cabins",
        "Marine-safe products",
        "Hull maintenance",
      ],
      premium: true,
    },
    {
      id: 16,
      name: "Weeds Cutting & Mowing",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Outdoor",
      icon: ScissorsIcon,
      description:
        "Professional landscaping services including weed removal and lawn maintenance.",
      features: [
        "Weed removal",
        "Grass cutting",
        "Edge trimming",
        "Debris cleanup",
      ],
    },
    {
      id: 17,
      name: "Industrial Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Commercial",
      icon: CogIcon,
      description:
        "Heavy-duty industrial cleaning for factories, warehouses, and manufacturing facilities.",
      features: [
        "Heavy machinery cleaning",
        "Safety protocols",
        "Chemical handling",
        "Waste management",
      ],
    },
    {
      id: 18,
      name: "Hotel Service",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Hospitality",
      icon: KeyIcon,
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
      id: 19,
      name: "Winter Services",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Seasonal",
      icon: SunIcon,
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
      icon: SunIcon,
      description:
        "Greenhouse and winter garden maintenance to keep your plants thriving year-round.",
      features: [
        "Plant care",
        "Glass cleaning",
        "Humidity control",
        "Pest prevention",
      ],
    },
    {
      id: 21,
      name: "Roof and terrace cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Outdoor",
      icon: HomeIcon,
      description:
        "High-level cleaning services for roofs, terraces, and elevated outdoor spaces.",
      features: [
        "Safety equipment",
        "Weather protection",
        "Drainage cleaning",
        "Surface restoration",
      ],
    },
    {
      id: 22,
      name: "Residential cleaning",
      memberPrice: "$18/h",
      regularPrice: "$36/h",
      category: "Residential",
      icon: HomeIcon,
      description:
        "Standard residential cleaning services for homes, apartments, and condominiums.",
      features: [
        "All living areas",
        "Kitchen & bathrooms",
        "Bedroom service",
        "Common areas",
      ],
    },
    {
      id: 23,
      name: "Maintenance cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Maintenance",
      icon: WrenchScrewdriverIcon,
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
      id: 24,
      name: "Paving stone cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Outdoor",
      icon: Squares2X2Icon,
      description:
        "Specialized cleaning and restoration of paving stones, driveways, and walkways.",
      features: [
        "Pressure washing",
        "Stain removal",
        "Sealing service",
        "Restoration",
      ],
    },
    {
      id: 25,
      name: "Parquet cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Specialized",
      icon: Squares2X2Icon,
      description:
        "Expert parquet and hardwood floor cleaning with specialized products and techniques.",
      features: [
        "Wood-safe products",
        "Finish protection",
        "Stain treatment",
        "Polishing service",
      ],
    },
    {
      id: 26,
      name: "Facade cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Commercial",
      icon: BuildingOffice2Icon,
      description:
        "Professional building facade cleaning for commercial and residential properties.",
      features: [
        "High-rise cleaning",
        "Material-specific care",
        "Safety equipment",
        "Weather protection",
      ],
    },
    {
      id: 27,
      name: "Caretaker service",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Maintenance",
      icon: KeyIcon,
      description:
        "Comprehensive caretaker services for property management and maintenance oversight.",
      features: [
        "Property oversight",
        "Security monitoring",
        "Maintenance coordination",
        "Emergency response",
      ],
    },
    {
      id: 28,
      name: "Floor cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Specialized",
      icon: Squares2X2Icon,
      description:
        "Professional floor cleaning for all surface types including tile, hardwood, and carpet.",
      features: [
        "All floor types",
        "Deep sanitization",
        "Stain removal",
        "Protective coatings",
      ],
    },
    {
      id: 29,
      name: "Luxury Villa cleaning and maintenance",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Luxury",
      icon: HomeIcon,
      description:
        "Premium cleaning services for luxury villas with white-glove attention to detail.",
      features: [
        "White-glove service",
        "Luxury standards",
        "Privacy protection",
        "Concierge cleaning",
      ],
      premium: true,
    },
    {
      id: 30,
      name: "Security Services",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Security",
      icon: ShieldCheckIcon,
      description:
        "Security-conscious cleaning services with background-checked and bonded professionals.",
      features: [
        "Background checks",
        "Security protocols",
        "Confidentiality",
        "Bonded staff",
      ],
    },
    {
      id: 31,
      name: "Carpet and Rug Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Specialized",
      icon: Squares2X2Icon,
      description:
        "Deep carpet and rug cleaning using advanced techniques and eco-friendly products.",
      features: [
        "Steam cleaning",
        "Stain treatment",
        "Odor removal",
        "Fabric protection",
      ],
    },
    {
      id: 32,
      name: "Upholstery Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Specialized",
      icon: Squares2X2Icon,
      description:
        "Professional upholstery cleaning for furniture, chairs, and fabric surfaces.",
      features: [
        "Fabric care",
        "Stain removal",
        "Sanitization",
        "Color protection",
      ],
    },
    {
      id: 33,
      name: "Car Cleaning (Inside and Out)",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Automotive",
      icon: TruckIcon,
      description:
        "Complete automotive cleaning services including interior detailing and exterior washing.",
      features: [
        "Interior detailing",
        "Exterior wash",
        "Wax protection",
        "Tire care",
      ],
    },
    {
      id: 34,
      name: "Computer & Printer Cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Technology",
      icon: ComputerDesktopIcon,
      description:
        "Specialized cleaning for computers, printers, and electronic equipment.",
      features: [
        "Dust removal",
        "Screen cleaning",
        "Keyboard sanitization",
        "Cable management",
      ],
    },
    {
      id: 35,
      name: "Laundry and Ironing Service",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Personal Services",
      icon: ScissorsIcon,
      description:
        "Professional laundry and ironing services with care for all fabric types.",
      features: [
        "Fabric care",
        "Professional pressing",
        "Stain treatment",
        "Pickup & delivery",
      ],
    },
    {
      id: 36,
      name: "Kitchen Deep Cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Specialized",
      icon: FireIcon,
      description:
        "Comprehensive kitchen cleaning including appliances, surfaces, and hidden areas.",
      features: [
        "Appliance deep clean",
        "Grease removal",
        "Sanitization",
        "Organization",
      ],
    },
    {
      id: 37,
      name: "Billboard Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Commercial",
      icon: MegaphoneIcon,
      description:
        "High-altitude billboard and signage cleaning with specialized equipment and safety protocols.",
      features: [
        "High-altitude work",
        "Safety equipment",
        "Weather-resistant",
        "Visibility enhancement",
      ],
    },
    {
      id: 38,
      name: "Ventilation and Filter Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "HVAC",
      icon: FunnelIcon,
      description:
        "HVAC system cleaning including vents, ducts, and filters for improved air quality.",
      features: [
        "Duct cleaning",
        "Filter replacement",
        "Air quality improvement",
        "System efficiency",
      ],
    },
    {
      id: 39,
      name: "Sauna deep cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Wellness",
      icon: FireIcon,
      description:
        "Specialized sauna and spa cleaning with attention to hygiene and relaxation standards.",
      features: [
        "Heat-resistant cleaning",
        "Sanitization",
        "Wood care",
        "Humidity control",
      ],
    },
    {
      id: 40,
      name: "Emergency cleaning services 24/7",
      memberPrice: "$45/h",
      regularPrice: "$99/h",
      category: "Emergency",
      icon: ExclamationTriangleIcon,
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
    {
      id: 41,
      name: "Mold Removal",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Health & Safety",
      icon: BugAntIcon,
      description:
        "Professional mold remediation and removal services with health safety protocols.",
      features: [
        "Mold testing",
        "Safe removal",
        "Prevention treatment",
        "Health protection",
      ],
    },
    {
      id: 42,
      name: "Pest Control",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Health & Safety",
      icon: BugAntIcon,
      description:
        "Comprehensive pest control and prevention services using safe, effective methods.",
      features: [
        "Pest identification",
        "Safe treatments",
        "Prevention plans",
        "Follow-up service",
      ],
    },
    {
      id: 43,
      name: "Janitorial Cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Commercial",
      icon: BriefcaseIcon,
      description:
        "Professional janitorial services for offices, schools, and commercial buildings.",
      features: [
        "Daily maintenance",
        "Restroom service",
        "Trash removal",
        "Supply restocking",
      ],
    },
    {
      id: 44,
      name: "Tile Deep Cleaning (Horizontal & Vertical)",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Specialized",
      icon: Squares2X2Icon,
      description:
        "Intensive tile and grout cleaning for floors, walls, and all tiled surfaces.",
      features: [
        "Grout restoration",
        "Stain removal",
        "Sealing service",
        "Color enhancement",
      ],
    },
    {
      id: 45,
      name: "Commercial Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Commercial",
      icon: BuildingOffice2Icon,
      description:
        "Comprehensive commercial cleaning services for businesses of all sizes.",
      features: [
        "Office spaces",
        "Common areas",
        "Meeting rooms",
        "Professional standards",
      ],
    },
    {
      id: 46,
      name: "Warehouse Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Commercial",
      icon: BuildingStorefrontIcon,
      description:
        "Large-scale warehouse and distribution center cleaning with industrial equipment.",
      features: [
        "Large-scale cleaning",
        "Safety protocols",
        "Equipment handling",
        "Logistics coordination",
      ],
    },
    {
      id: 47,
      name: "School & University Hall Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Educational",
      icon: AcademicCapIcon,
      description:
        "Educational facility cleaning with focus on health, safety, and learning environments.",
      features: [
        "Classroom cleaning",
        "Common areas",
        "Health protocols",
        "Student safety",
      ],
    },
    {
      id: 48,
      name: "Sports Center Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Sports & Recreation",
      icon: TrophyIcon,
      description:
        "Athletic facility cleaning including locker rooms, equipment, and playing surfaces.",
      features: [
        "Locker rooms",
        "Equipment cleaning",
        "Playing surfaces",
        "Sanitization",
      ],
    },
    {
      id: 49,
      name: "Staircase Cleaning",
      memberPrice: "$22/h",
      regularPrice: "$45/h",
      category: "Specialized",
      icon: ArrowTrendingUpIcon,
      description:
        "Specialized staircase cleaning for safety and aesthetic maintenance.",
      features: [
        "Safety cleaning",
        "Handrail sanitization",
        "Step care",
        "Lighting enhancement",
      ],
    },
    {
      id: 50,
      name: "Airbnb Cleaning",
      memberPrice: "$24/h",
      regularPrice: "$54/h",
      category: "Hospitality",
      icon: KeyIcon,
      description:
        "Short-term rental cleaning services to ensure 5-star guest experiences.",
      features: [
        "Turnover cleaning",
        "Guest standards",
        "Quick turnaround",
        "Host support",
      ],
    },
  ];

  const categories = [
    "All Services",
    "Residential",
    "Commercial",
    "Specialized",
    "Health & Safety",
    "Luxury",
    "Outdoor",
    "Emergency",
    "Hospitality",
    "Educational",
    "Sports & Recreation",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Services");

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "All Services" ||
      service.category === selectedCategory;
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-0 right-0 bg-white/98 backdrop-blur-2xl shadow-2xl border border-slate-200/60 rounded-3xl z-[100] mt-4 max-h-[85vh] overflow-hidden animate-fade-in-scale ${className}`}
      style={{ minWidth: "900px", maxWidth: "1200px" }}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Our Services
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {services.length} professional cleaning solutions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white rounded-xl text-sm font-semibold shadow-lg">
              Up to 50% OFF with Membership
            </div>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Responsive Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-center transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white shadow-lg transform scale-105"
                    : "bg-white/70 text-slate-600 hover:bg-white hover:text-[#4EC6E5] border border-slate-200 hover:border-[#4EC6E5]/30 hover:scale-105"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            const isHovered = hoveredService === service.id;

            return (
              <div
                key={service.id}
                className="relative group"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <Link
                  to={`/services/${service.id}`}
                  className="block p-4 bg-white/80 hover:bg-white rounded-2xl border border-slate-200/60 hover:border-[#4EC6E5]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 group relative overflow-hidden"
                  onClick={onClose}
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            service.premium
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25"
                              : service.emergency
                              ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25"
                              : "bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] shadow-lg shadow-[#4EC6E5]/25"
                          } group-hover:scale-110`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                          {service.popular && (
                            <div className="flex items-center mb-1">
                              <StarIcon className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                              <span className="text-xs font-semibold text-amber-600">
                                Popular
                              </span>
                            </div>
                          )}
                          {service.premium && (
                            <div className="flex items-center mb-1">
                              <StarIcon className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                              <span className="text-xs font-semibold text-amber-600">
                                Premium
                              </span>
                            </div>
                          )}
                          {service.emergency && (
                            <div className="flex items-center mb-1">
                              <ExclamationTriangleIcon className="h-3 w-3 text-red-500 mr-1" />
                              <span className="text-xs font-semibold text-red-600">
                                24/7 Emergency
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRightIcon className="h-4 w-4 text-slate-400 group-hover:text-[#4EC6E5] group-hover:translate-x-1 transition-all duration-200" />
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-2 text-sm leading-tight group-hover:text-[#2BA8CD] transition-colors duration-200">
                      {service.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-[#4EC6E5]">
                          {service.memberPrice}
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                          {service.regularPrice}
                        </span>
                      </div>
                      <span className="text-xs bg-[#E0F6FD] text-[#2BA8CD] px-2 py-1 rounded-lg font-medium">
                        {service.category}
                      </span>
                    </div>

                    {/* Hover Description */}
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        isHovered ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {service.features?.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white/80 text-slate-600 px-2 py-1 rounded-lg border border-slate-200/60"
                          >
                            {feature}
                          </span>
                        ))}
                        {service.features?.length > 2 && (
                          <span className="text-xs text-[#4EC6E5] font-medium">
                            +{service.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No services found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-slate-600">
              <CheckBadgeIcon className="h-4 w-4 text-[#4EC6E5] mr-2" />
              <span className="font-medium">All cleaners vetted & insured</span>
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <ShieldCheckIcon className="h-4 w-4 text-[#4EC6E5] mr-2" />
              <span className="font-medium">Satisfaction guaranteed</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/book"
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4EC6E5]/25"
            >
              Book Now
            </Link>
            <Link
              to="/services"
              onClick={onClose}
              className="px-6 py-3 border-2 border-[#4EC6E5]/30 text-[#4EC6E5] hover:bg-[#4EC6E5] hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 bg-white/70"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4ec6e5, #2ba8cd);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #3bb8df, #2293b5);
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesDropdown;
