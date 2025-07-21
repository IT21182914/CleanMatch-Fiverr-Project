import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  SparklesIcon,
  HomeIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";

const ServicesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const servicesCategories = [
    {
      title: "Residential Services",
      subtitle: "Premium home cleaning solutions",
      icon: HomeIcon,
      iconColor: "text-[#4EC6E5]",
      gradient: "from-[#4EC6E5] to-[#3BB8DF]",
      bgGradient: "from-[#F0FBFE] to-[#E0F6FD]",
      services: [
        { name: "Luxury Home Cleaning", popular: true },
        { name: "Deep Cleaning & Sanitization", popular: false },
        { name: "Move-in / Move-out Services", popular: true },
        { name: "Executive Maid Services", popular: false },
        { name: "Premium Villa Maintenance", popular: false },
        { name: "Airbnb Property Management", popular: true },
      ],
    },
    {
      title: "Commercial Solutions",
      subtitle: "Enterprise-grade cleaning services",
      icon: BuildingOfficeIcon,
      iconColor: "text-[#2BA8CD]",
      gradient: "from-[#2BA8CD] to-[#2293B5]",
      bgGradient: "from-[#F0FBFE] to-[#BAEDFB]",
      services: [
        { name: "Corporate Office Cleaning", popular: true },
        { name: "Retail & Showroom Services", popular: false },
        { name: "Hospitality Solutions", popular: true },
        { name: "Educational Facility Care", popular: false },
        { name: "Medical Facility Cleaning", popular: true },
        { name: "Industrial Complex Services", popular: false },
      ],
    },
    {
      title: "Specialized Services",
      subtitle: "Expert technical cleaning solutions",
      icon: WrenchScrewdriverIcon,
      iconColor: "text-[#6ED1EA]",
      gradient: "from-[#6ED1EA] to-[#4EC6E5]",
      bgGradient: "from-[#E0F6FD] to-[#BAEDFB]",
      services: [
        { name: "Window & Facade Cleaning", popular: false },
        { name: "Post-Construction Cleanup", popular: true },
        { name: "Pool & Spa Maintenance", popular: false },
        { name: "Luxury Vehicle Detailing", popular: true },
        { name: "Marine Vessel Cleaning", popular: false },
        { name: "Aircraft Interior Services", popular: false },
      ],
    },
    {
      title: "Health & Safety",
      subtitle: "Advanced sanitization protocols",
      icon: ShieldCheckIcon,
      iconColor: "text-[#1B7A95]",
      gradient: "from-[#1B7A95] to-[#2293B5]",
      bgGradient: "from-[#F0FBFE] to-[#E0F6FD]",
      services: [
        { name: "Medical-Grade Disinfection", popular: true },
        { name: "Biohazard Cleanup Services", popular: false },
        { name: "Mold Remediation", popular: true },
        { name: "Pest Management Solutions", popular: false },
        { name: "Emergency Response Team", popular: true },
        { name: "Green Cleaning Protocols", popular: false },
      ],
    },
    {
      title: "Maintenance Programs",
      subtitle: "Ongoing care and upkeep services",
      icon: TruckIcon,
      iconColor: "text-[#7FE0F8]",
      gradient: "from-[#7FE0F8] to-[#4EC6E5]",
      bgGradient: "from-[#BAEDFB] to-[#7FE0F8]",
      services: [
        { name: "Facility Management", popular: true },
        { name: "Floor Care & Restoration", popular: false },
        { name: "Textile & Upholstery Care", popular: true },
        { name: "Laundry & Pressing Services", popular: false },
        { name: "HVAC System Cleaning", popular: false },
        { name: "Preventive Maintenance", popular: true },
      ],
    },
    {
      title: "Outdoor & Seasonal",
      subtitle: "Comprehensive exterior services",
      icon: CalendarDaysIcon,
      iconColor: "text-[#3BB8DF]",
      gradient: "from-[#3BB8DF] to-[#2BA8CD]",
      bgGradient: "from-[#E0F6FD] to-[#F0FBFE]",
      services: [
        { name: "Landscape & Garden Care", popular: false },
        { name: "Seasonal Deep Cleaning", popular: true },
        { name: "Exterior Building Wash", popular: false },
        { name: "Event Setup & Cleanup", popular: true },
        { name: "Winter Services", popular: false },
        { name: "Pressure Washing Services", popular: false },
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
      setHoveredCategory(null);
    }, 350); // Slightly increased timeout for better UX
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
      className="relative isolate" // Removed margin, will be handled by parent
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: "auto" }}
    >
      {/* Trigger Button */}
      <button
        className={cn(
          "group relative inline-flex items-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border backdrop-blur-sm isolate",
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]",
          isOpen
            ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white border-[#4EC6E5] shadow-xl shadow-[#4EC6E5]/25 scale-105 z-50"
            : "text-slate-700 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] border-transparent hover:border-[#4EC6E5]/30 hover:shadow-lg hover:scale-105 hover:z-50"
        )}
      >
        <div className="relative z-10 flex items-center">
          <SparklesIcon className="h-4 w-4 mr-2.5 transition-transform duration-300 group-hover:rotate-12" />
          <span className="tracking-wide">Services</span>
          <ChevronDownIcon
            className={`h-4 w-4 ml-2 transition-all duration-300 ${
              isOpen ? "rotate-180 scale-110" : "rotate-0"
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 mt-4 transition-all duration-500 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 -translate-y-4 pointer-events-none scale-95"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div
          className="w-[900px] bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 overflow-hidden relative shadow-2xl shadow-slate-900/20 flex flex-col isolate"
          style={{
            left: "-200px", // Adjusted positioning
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
            maxHeight: "80vh",
            zIndex: 9999,
          }}
        >
          {/* Premium Header */}
          <div className="relative bg-gradient-to-r from-[#1B7A95] via-[#2293B5] to-[#2BA8CD] px-8 py-6 overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5]/10 via-[#6ED1EA]/10 to-[#7FE0F8]/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center tracking-tight">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-[#4EC6E5] to-[#6ED1EA] mr-3 shadow-lg">
                      <SparklesIcon className="h-6 w-6 text-white" />
                    </div>
                    Professional Services
                  </h3>
                  <p className="text-[#BAEDFB] mt-2 text-sm font-medium">
                    Premium cleaning solutions tailored for excellence
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-[#BAEDFB] text-sm">
                    <StarIcon className="h-4 w-4 fill-[#7FE0F8] text-[#7FE0F8] mr-1" />
                    <span className="font-semibold">4.9/5</span>
                    <span className="ml-1">Rating</span>
                  </div>
                  <p className="text-[#6ED1EA] text-xs mt-1">1000+ Projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 min-h-0">
            <div className="grid grid-cols-3 gap-6 p-8">
              {servicesCategories.map((category, categoryIndex) => {
                const Icon = category.icon;
                const isHovered = hoveredCategory === categoryIndex;

                return (
                  <div
                    key={categoryIndex}
                    className={cn(
                      "group/category relative rounded-2xl p-6 transition-all duration-300 cursor-pointer border",
                      isHovered
                        ? "bg-white shadow-xl shadow-slate-900/10 border-slate-300 scale-105 -translate-y-1"
                        : "bg-gradient-to-br from-white to-slate-50/50 border-slate-200/60 hover:border-slate-300"
                    )}
                    onMouseEnter={() => setHoveredCategory(categoryIndex)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {/* Category Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "p-3 rounded-2xl bg-gradient-to-br transition-all duration-300 shadow-lg",
                            category.bgGradient,
                            isHovered ? "scale-110 shadow-xl" : "shadow-md"
                          )}
                        >
                          <Icon className={cn("h-5 w-5", category.iconColor)} />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-slate-900 text-lg mb-1 tracking-tight">
                        {category.title}
                      </h4>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        {category.subtitle}
                      </p>
                    </div>

                    {/* Services List */}
                    <div className="space-y-2">
                      {category.services.map((service, serviceIndex) => (
                        <Link
                          key={serviceIndex}
                          to={`/services/${service.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")}`}
                          className="group/service flex items-center justify-between px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md hover:translate-x-1 border border-transparent hover:border-slate-200"
                        >
                          <div className="flex items-center">
                            <span className="font-medium">{service.name}</span>
                            {service.popular && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#6ED1EA] text-white rounded-full shadow-lg">
                                Popular
                              </span>
                            )}
                          </div>
                          <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover/service:opacity-100 transition-opacity duration-200 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premium Footer */}
          <div className="bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] px-8 py-6 border-t border-[#BAEDFB]/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    Need Custom Solutions?
                  </p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Tailored services for unique requirements
                  </p>
                </div>
                <div className="flex items-center text-slate-500 text-xs space-x-4">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-[#4EC6E5] rounded-full mr-1.5 animate-pulse"></div>
                    24/7 Available
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-[#6ED1EA] rounded-full mr-1.5 animate-pulse"></div>
                    Insured & Bonded
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to="/services"
                  className="inline-flex items-center px-6 py-2.5 bg-white border border-[#BAEDFB] text-sm font-semibold text-[#2293B5] rounded-xl hover:bg-[#F0FBFE] hover:border-[#4EC6E5] transition-all duration-200 hover:shadow-lg"
                >
                  Browse All Services
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white text-sm font-semibold rounded-xl hover:from-[#3BB8DF] hover:to-[#2293B5] transition-all duration-300 hover:shadow-xl hover:shadow-[#4EC6E5]/30 hover:-translate-y-0.5 group"
                >
                  Get Free Quote
                  <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
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
