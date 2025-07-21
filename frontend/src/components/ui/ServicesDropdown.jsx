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
      iconColor: "text-blue-600",
      gradient: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
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
      iconColor: "text-emerald-600",
      gradient: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
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
      iconColor: "text-violet-600",
      gradient: "from-violet-600 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
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
      iconColor: "text-red-600",
      gradient: "from-red-600 to-rose-600",
      bgGradient: "from-red-50 to-rose-50",
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
      iconColor: "text-orange-600",
      gradient: "from-orange-600 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
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
      iconColor: "text-cyan-600",
      gradient: "from-cyan-600 to-sky-600",
      bgGradient: "from-cyan-50 to-sky-50",
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
    }, 200);
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
      {/* Trigger Button */}
      <button
        className={cn(
          "group relative inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-500 ease-out backdrop-blur-sm border",
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-[100%]",
          isOpen
            ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700 shadow-2xl shadow-slate-900/25 scale-105"
            : "text-slate-700 bg-white/80 hover:bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10 hover:scale-105 hover:-translate-y-0.5"
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
        className={`absolute top-full left-0 mt-3 transition-all duration-500 ease-out z-[9999] ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 -translate-y-4 pointer-events-none scale-95"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div
          className="w-[900px] bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 overflow-hidden relative shadow-2xl shadow-slate-900/20 flex flex-col"
          style={{
            left: "-250px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
            maxHeight: "80vh",
          }}
        >
          {/* Premium Header */}
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center tracking-tight">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 mr-3 shadow-lg">
                      <SparklesIcon className="h-6 w-6 text-white" />
                    </div>
                    Professional Services
                  </h3>
                  <p className="text-slate-300 mt-2 text-sm font-medium">
                    Premium cleaning solutions tailored for excellence
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-slate-300 text-sm">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">4.9/5</span>
                    <span className="ml-1">Rating</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">1000+ Projects</p>
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
                          <Icon className="h-5 w-5 text-slate-700" />
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
                              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full">
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
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-t border-slate-200/60 flex-shrink-0">
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
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                    24/7 Available
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></div>
                    Insured & Bonded
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to="/services"
                  className="inline-flex items-center px-6 py-2.5 bg-white border border-slate-300 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:shadow-lg"
                >
                  Browse All Services
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group"
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
