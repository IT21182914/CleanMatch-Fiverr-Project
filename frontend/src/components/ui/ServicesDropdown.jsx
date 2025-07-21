import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  SparklesIcon,
  HomeIcon,
  BuildingOfficeIcon,
  TruckIcon,
  WindowIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";

const ServicesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Enhanced services data with categories and icons
  const servicesCategories = [
    {
      title: "Residential",
      icon: HomeIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      services: [
        "House and Apartment Cleaning",
        "Deep Cleaning Services",
        "Move-in / Move-out Cleaning",
        "Maid and Domestic Help Services",
        "Luxury Villa Cleaning",
        "Airbnb & Short-Term Rental Cleaning",
      ],
    },
    {
      title: "Commercial",
      icon: BuildingOfficeIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
      services: [
        "Office and Workspace Cleaning",
        "Shop and Retail Store Cleaning",
        "Hotel Room and Hall Cleaning",
        "School & University Cleaning",
        "Commercial Property Cleaning",
        "Warehouse Cleaning Solutions",
      ],
    },
    {
      title: "Specialized",
      icon: WrenchScrewdriverIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      services: [
        "Window and Glass Cleaning",
        "Post-Construction Cleaning",
        "Pool Maintenance and Cleaning",
        "Aircraft & Private Jet Cleaning",
        "Yacht & Boat Cleaning",
        "Industrial and Factory Cleaning",
      ],
    },
    {
      title: "Health & Safety",
      icon: ShieldCheckIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
      services: [
        "Disinfection & Sanitization",
        "Hospital & Clinic Cleaning",
        "Mold Inspection & Removal",
        "Pest Control & Fumigation",
        "24/7 Emergency Cleaning Services",
        "Green / Eco-Friendly Cleaning Services",
      ],
    },
    {
      title: "Maintenance",
      icon: TruckIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      services: [
        "Routine Maintenance Cleaning",
        "Janitor and Caretaker Services",
        "Floor Scrubbing & Polishing",
        "Carpet and Rug Shampooing",
        "Sofa & Upholstery Cleaning",
        "Laundry and Ironing Services",
      ],
    },
    {
      title: "Outdoor & More",
      icon: CalendarDaysIcon,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      services: [
        "Lawn Mowing & Weed Removal",
        "Snow & Winter Services",
        "Garden and Outdoor Cleaning",
        "Roof & Terrace Cleaning",
        "Car Interior & Exterior Detailing",
        "Event Cleanup Services",
      ],
    },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative ml-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "navbar-button group relative inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border overflow-hidden transform-gpu",
          isOpen
            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-600 shadow-lg scale-105 ring-2 ring-cyan-200"
            : "text-gray-600 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 border-transparent hover:border-cyan-200 hover:shadow-lg hover:scale-105"
        )}
      >
        <SparklesIcon className="h-4 w-4 mr-2" />
        Services
        <ChevronDownIcon
          className={`h-4 w-4 ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 mt-2 transition-all duration-300 ease-out z-[9999] ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div
          className="w-[800px] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden backdrop-blur-sm relative"
          style={{
            left: "-200px",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-cyan-500" />
              Professional Cleaning Services
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive cleaning solutions for every need
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-3 gap-6 p-6">
            {servicesCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <div
                  key={categoryIndex}
                  className="group/category hover:bg-gray-50 rounded-xl p-4 transition-all duration-200"
                >
                  {/* Category Header */}
                  <div className="flex items-center mb-3">
                    <div
                      className={`p-2 rounded-lg ${category.bgColor} group-hover/category:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`h-4 w-4 ${category.color}`} />
                    </div>
                    <h4 className="ml-3 font-semibold text-gray-900 text-sm">
                      {category.title}
                    </h4>
                  </div>

                  {/* Services List */}
                  <div className="space-y-1">
                    {category.services.map((service, serviceIndex) => (
                      <Link
                        key={serviceIndex}
                        to={`/services/${service
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`}
                        className="block px-3 py-2 text-xs text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-150 hover:translate-x-1 hover:shadow-sm"
                      >
                        {service}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Need something specific?
                </p>
                <p className="text-xs text-gray-500">
                  Contact us for custom cleaning solutions
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/services"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  All Services
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-4 py-2 bg-cyan-500 text-white text-sm font-medium rounded-lg hover:bg-cyan-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ backgroundColor: "#4EC6E5" }}
                >
                  Get Quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesDropdown;
