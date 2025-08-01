import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  SparklesIcon,
  ArrowRightIcon,
  StarIcon,
  ShieldCheckIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { allServices, searchServices } from "../../data/services";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredServices, setFilteredServices] = useState(allServices);
  const searchRef = useRef(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownOpen(true);

    if (query.trim()) {
      const filtered = searchServices(query);
      setFilteredServices(filtered);
    } else {
      setFilteredServices(allServices);
    }
  };

  // Handle service selection
  const handleServiceSelect = (service) => {
    setSearchQuery(service.name);
    setIsDropdownOpen(false);
    // You can add navigation logic here if needed
    // navigate(`/services/${service.id}`);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredServices(allServices);
    setIsDropdownOpen(false);
  };
  return (
    <section
      className="hero-background relative pt-12 xs:pt-16 sm:pt-20 lg:pt-24 pb-16 xs:pb-20 sm:pb-24 md:pb-28 lg:pb-32 xl:pb-40 overflow-hidden"
      style={{
        backgroundImage: "url('/images/cleaner-hero.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        willChange: "transform", // Optimize for animations/transforms
        backfaceVisibility: "hidden", // Improve rendering performance
      }}
    >
      {/* Background Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/50"></div>

      {/* Background Elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 xs:-top-30 sm:-top-40 -right-20 xs:-right-30 sm:-right-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 xs:-bottom-30 sm:-bottom-40 -left-20 xs:-left-30 sm:-left-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-gradient-to-br from-[#6ED1EA]/10 to-[#4EC6E5]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center">
          {/* Special Offer Badge - Responsive */}
          <div className="inline-flex items-center px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] border border-[#BAEDFB]/50 mb-6 xs:mb-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-1.5 xs:w-2 h-1.5 xs:h-2 bg-[#4EC6E5] rounded-full mr-2 xs:mr-3 animate-pulse"></div>
            <SparklesIcon className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] mr-1.5 xs:mr-2" />
            <span className="text-xs xs:text-sm font-semibold bg-gradient-to-r from-[#2BA8CD] to-[#1B7A95] bg-clip-text text-transparent">
              50+ Professional Services • Up to 55% OFF with Membership
            </span>
          </div>

          {/* Main Headline - Responsive */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 xs:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Professional Cleaning Solutions
            </span>
            <span className="block bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent mt-1 xs:mt-2 py-1">
              Starting at $18/hour
            </span>
          </h1>

          {/* First Clean Offer - Responsive */}
          <div className="relative group mb-8 xs:mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-2xl xs:rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-4 xs:py-6 px-6 xs:px-10 rounded-2xl xs:rounded-3xl inline-block transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#4EC6E5]/25">
              <p className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-1">
                $18/hour with Membership
              </p>
              <p className="text-xs xs:text-sm opacity-90 font-medium">
                50+ services at incredible member rates
              </p>
            </div>
          </div>

          {/* Search Bar - Responsive */}
          <div
            className="relative max-w-2xl mx-auto mb-8 xs:mb-10 px-2 xs:px-0"
            ref={searchRef}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search from 50+ professional services..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#4EC6E5] focus:ring-2 focus:ring-[#4EC6E5]/20 focus:outline-none transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
                {filteredServices.length > 0 ? (
                  <div className="py-2">
                    {filteredServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm">
                              {service.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {service.category}
                            </div>
                          </div>
                          <div className="flex flex-col items-end ml-4">
                            <div className="text-sm font-bold text-[#4EC6E5]">
                              {service.memberPrice}
                            </div>
                            <div className="text-xs text-gray-400 line-through">
                              {service.regularPrice}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No services found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description - Responsive */}
          <p className="text-lg xs:text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 xs:mb-10 sm:mb-12 leading-relaxed px-2 xs:px-0">
            From house cleaning to luxury yacht maintenance 50+ professional
            services with vetted, insured cleaners. Join 900,000+ satisfied
            customers across 36+ cities.
          </p>

          {/* CTA Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 xs:gap-6 sm:gap-8">
            <Link to="/register" className="w-full sm:w-auto group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1B7A95] to-[#2293B5] rounded-xl xs:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  size="lg"
                  className="relative w-full sm:w-auto px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 bg-gradient-to-r from-[#1B7A95] to-[#2293B5] hover:from-[#2293B5] hover:to-[#2BA8CD] text-white font-bold text-lg xs:text-xl rounded-xl xs:rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-105"
                >
                  Get Membership - $18/hr
                  <ArrowRightIcon className="ml-2 xs:ml-3 h-5 xs:h-6 w-5 xs:w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </Link>
            <Link to="/services" className="w-full sm:w-auto group">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 border-2 border-slate-300 hover:border-[#4EC6E5] text-slate-700 hover:text-[#4EC6E5] font-bold text-lg xs:text-xl rounded-xl xs:rounded-2xl backdrop-blur-sm bg-white/70 hover:bg-white transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
              >
                View All 50+ Services
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Responsive */}
          <div className="mt-12 xs:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 xs:gap-6 md:gap-8 text-xs xs:text-sm text-slate-500">
            <div className="flex flex-col md:flex-row items-center">
              <StarIcon className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] fill-[#4EC6E5] mr-0 md:mr-2 mb-1 md:mb-0" />
              <span className="font-semibold text-center md:text-left">
                4.9/5 Rating
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <ShieldCheckIcon className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] mr-0 md:mr-2 mb-1 md:mb-0" />
              <span className="font-semibold text-center md:text-left">
                Insured & Bonded
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <UsersIcon className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] mr-0 md:mr-2 mb-1 md:mb-0" />
              <span className="font-semibold text-center md:text-left">
                75,000+ Customers
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <SparklesIcon className="h-4 xs:h-5 w-4 xs:w-5 text-[#4EC6E5] mr-0 md:mr-2 mb-1 md:mb-0" />
              <span className="font-semibold text-center md:text-left">
                50+ Services
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
