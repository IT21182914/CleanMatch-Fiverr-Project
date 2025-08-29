import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { servicesAPI } from "../lib/api";
import { getServiceImage } from "../utils/serviceImages";
import ServiceImage from "../components/ui/ServiceImage";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [sortBy, setSortBy] = useState("popular"); // popular, price-low, price-high, name
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(["All Services"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const servicesGridRef = useRef(null);
  const navigate = useNavigate();

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await servicesAPI.getAll({ limit: 100 }); // Get more services

        if (response.data?.success) {
          const servicesData = response.data.data || [];
          const categoriesData = response.data.categories || [];

          // Transform backend data to match frontend structure
          const transformedServices = servicesData.map(service => ({
            id: service.id,
            name: service.name,
            description: service.description,
            memberPrice: `$${service.membership_price}/h`,
            regularPrice: `$${service.base_price}/h`,
            category: service.category,
            duration: service.duration_hours,
            features: [], // Remove duplicate description from features
            popular: false, // Can be enhanced later
            premium: false,
            emergency: false,
          }));

          setServices(transformedServices);
          setCategories(["All Services", ...categoriesData]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "All Services" || service.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  }); const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (
          parseInt(a.memberPrice.replace(/\D/g, "")) -
          parseInt(b.memberPrice.replace(/\D/g, ""))
        );
      case "price-high":
        return (
          parseInt(b.memberPrice.replace(/\D/g, "")) -
          parseInt(a.memberPrice.replace(/\D/g, ""))
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "popular":
      default:
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-scroll to services grid when searching
  useEffect(() => {
    if (searchTerm.trim() !== "" && servicesGridRef.current) {
      // Small delay to ensure the filtering has completed
      const timer = setTimeout(() => {
        const headerHeight = 200; // Approximate height of sticky header + some padding
        const elementTop = servicesGridRef.current.offsetTop - headerHeight;

        window.scrollTo({
          top: Math.max(0, elementTop),
          behavior: "smooth",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, sortedServices.length]);

  const handleServiceSelect = (service) => {
    // Navigate to the service details page or booking page
    navigate(`/services/${service.id}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Hero Section - Loading */}
        <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                Our Cleaning Services
              </h1>
              <p className="text-xs text-white/90 mb-2 max-w-xl mx-auto">
                Loading services...
              </p>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4EC6E5] mx-auto mb-4"></div>
            <p className="text-slate-600">Loading services...</p>
          </div>
        </div>

        {/* Skeleton Cards */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-20">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white/80 rounded-2xl p-4 sm:p-6 animate-pulse">
                <div className="w-full h-40 sm:h-48 bg-slate-200 rounded-xl mb-3 sm:mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded mb-4 w-3/4"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Hero Section - Error */}
        <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                Our Cleaning Services
              </h1>
              <p className="text-xs text-white/90 mb-2 max-w-xl mx-auto">
                Unable to load services
              </p>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex items-center justify-center py-20 min-h-[60vh]">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white font-semibold rounded-xl hover:from-[#3BB8DF] hover:to-[#2293B5] transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section - Minimal height */}
      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold mb-1">
              Our Cleaning Services
            </h1>
            <p className="text-xs text-white/90 mb-2 max-w-xl mx-auto">
              {services.length} specialized services available.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 flex items-center">
                <CheckBadgeIcon className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">Vetted</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 flex items-center">
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - Reduced padding */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Simple Search Input */}
            <div className="relative flex-1 lg:flex-none lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] focus:border-transparent text-sm"
              />
            </div>

            {/* Category Dropdown - Mobile Only */}
            <div className="flex items-center gap-2 lg:hidden w-full sm:w-auto">
              <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-slate-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Tabs - Desktop Only */}
          <div className="mt-2 hidden lg:flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === category
                  ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white shadow-md"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:text-[#4EC6E5] border border-slate-200/60 hover:border-[#4EC6E5]/30"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid - Reduced padding */}
      <div
        ref={servicesGridRef}
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6"
      >
        {/* Results Info - Reduced margin */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {searchTerm.trim() !== "" ? (
              <>
                Search Results for "{searchTerm}"
                {selectedCategory !== "All Services" && (
                  <span className="text-lg font-normal text-slate-600">
                    {" "}
                    in {selectedCategory}
                  </span>
                )}
              </>
            ) : selectedCategory === "All Services" ? (
              "All Services"
            ) : (
              selectedCategory
            )}
          </h2>
          <p className="text-slate-600">
            {sortedServices.length} service
            {sortedServices.length !== 1 ? "s" : ""} found
            {searchTerm.trim() !== "" && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#4EC6E5]/10 text-[#4EC6E5] font-medium">
                <MagnifyingGlassIcon className="h-3 w-3 mr-1" />
                Filtered
              </span>
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div
          className={`grid gap-4 sm:gap-6 ${sortedServices.length === 1
            ? "grid-cols-1 max-w-2xl mx-auto"
            : sortedServices.length <= 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : sortedServices.length <= 6
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
        >
          {sortedServices.map((service) => {
            return (
              <div key={service.id} className="group relative">
                <Link
                  to={`/services/${service.id}`}
                  className={`block h-full bg-white/80 hover:bg-white rounded-2xl border border-slate-200/60 hover:border-[#4EC6E5]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden ${sortedServices.length === 1 ? "p-6" : "p-4 sm:p-6"
                    }`}
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Service Image Header */}
                    <div className="relative mb-3 sm:mb-4">
                      <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden">
                        <ServiceImage
                          serviceName={service.name}
                          src={getServiceImage(service.name)}
                          service={service}
                          showBadges={false} // We'll render badges separately below
                        />
                      </div>

                      {/* Badges overlay */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {service.popular && (
                          <div className="flex items-center bg-amber-500/90 backdrop-blur-sm rounded-full px-2 py-1">
                            <StarIcon className="h-3 w-3 text-white mr-1" />
                            <span className="text-xs font-semibold text-white">
                              Popular
                            </span>
                          </div>
                        )}
                        {service.premium && (
                          <div className="flex items-center bg-amber-500/90 backdrop-blur-sm rounded-full px-2 py-1">
                            <StarIcon className="h-3 w-3 text-white mr-1" />
                            <span className="text-xs font-semibold text-white">
                              Premium
                            </span>
                          </div>
                        )}
                        {service.emergency && (
                          <div className="flex items-center bg-red-500/90 backdrop-blur-sm rounded-full px-2 py-1">
                            <ExclamationTriangleIcon className="h-3 w-3 text-white mr-1" />
                            <span className="text-xs font-semibold text-white">
                              24/7 Emergency
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Arrow overlay */}
                      <div className="absolute top-3 right-3">
                        <ChevronRightIcon className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Title */}
                    <h4
                      className={`font-bold text-slate-900 mb-3 leading-tight group-hover:text-[#2BA8CD] transition-colors duration-200 flex-grow ${sortedServices.length === 1 ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                        }`}
                    >
                      {service.name}
                    </h4>

                    {/* Description */}
                    <p
                      className={`text-slate-600 mb-4 leading-relaxed ${sortedServices.length === 1 ? "text-base" : "text-sm"
                        }`}
                    >
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {service.features && service.features
                          ?.slice(0, sortedServices.length === 1 ? 6 : 3)
                          .map((feature, index) => (
                            <span
                              key={index}
                              className={`bg-slate-100 text-slate-600 rounded-lg ${sortedServices.length === 1
                                ? "text-sm px-3 py-1"
                                : "text-xs px-2 py-1"
                                }`}
                            >
                              {feature}
                            </span>
                          ))}
                        {service.features && service.features?.length >
                          (sortedServices.length === 1 ? 6 : 3) && (
                            <span className="text-xs text-[#4EC6E5] font-medium">
                              +
                              {service.features.length -
                                (sortedServices.length === 1 ? 6 : 3)}{" "}
                              more
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Price and Category */}
                    <div className="mt-auto flex flex-col items-center">
                      <div className="mb-3">
                        <span
                          className={`inline-block bg-[#E0F6FD] text-[#2BA8CD] rounded-lg font-medium ${sortedServices.length === 1
                            ? "text-sm px-4 py-2"
                            : "text-xs px-3 py-1"
                            }`}
                        >
                          {service.category}
                        </span>
                      </div>

                      {/* Price Section - Mobile friendly */}
                      <div className="mb-3">
                        <div className="flex flex-col sm:items-center sm:justify-between gap-2 ">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-bold text-[#4EC6E5] ${sortedServices.length === 1
                                ? "text-2xl sm:text-3xl"
                                : "text-lg sm:text-xl"
                                }`}
                            >
                              {service.memberPrice}
                            </span>
                            <span
                              className={`text-slate-400 line-through ${sortedServices.length === 1
                                ? "text-sm sm:text-base"
                                : "text-xs sm:text-sm"
                                }`}
                            >
                              {service.regularPrice}
                            </span>
                          </div>
                          <div className="text-xs text-[#4EC6E5] font-medium">
                            Member Price / Regular Price
                          </div>
                        </div>
                      </div>

                      {/* Savings Badge */}
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-lg text-center">
                        Save up to 50% with Membership
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {sortedServices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              No services found
            </h3>
            <p className="text-slate-600 mb-8">
              Try adjusting your search or category filter to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Services");
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white font-semibold rounded-xl hover:from-[#3BB8DF] hover:to-[#2293B5] transition-all duration-300"
            >
              Show All Services
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      {/* <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book Your Cleaning Service?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of satisfied customers and experience the SIMORGH
            SERVICE difference today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="px-8 py-4 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4EC6E5]/25"
              style={{ color: "#ffffff" }}
            >
              Book Now
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Services;
