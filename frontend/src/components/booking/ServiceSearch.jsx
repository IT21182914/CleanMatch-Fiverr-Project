import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  StarIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { LoadingGrid } from "../ui/Loading";
import { formatCurrency } from "../../lib/utils";
import { getServiceImage } from "../../utils/serviceImages";
import ServiceImage from "../ui/ServiceImage";

const ServiceSearch = ({
  services,
  loading,
  serviceError,
  onServiceSelect,
  onRetry,
}) => {
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(12); // Show 12 services per page
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Filter services based on search and category
  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      // If selectedCategory is a service name, filter by that specific service
      const isServiceName = services.some(
        (service) => service.name === selectedCategory
      );
      if (isServiceName) {
        filtered = filtered.filter(
          (service) => service.name === selectedCategory
        );
      } else {
        // Otherwise, filter by category as before
        filtered = filtered.filter(
          (service) =>
            service.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
    }

    setFilteredServices(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [services, searchTerm, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of services grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Get unique categories and all service names for filtering
  const categories = [
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ];

  // Get all service names for the dropdown
  const allServiceNames = services.map((service) => service.name).sort();

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 touch-pan-x touch-pan-y">
      {/* Hero Section - Fully Responsive */}
      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">
              Choose Your Cleaning Service
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4 max-w-xs sm:max-w-md md:max-w-xl mx-auto px-2">
              {services.length} specialized services available for booking.
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 flex items-center">
                <CheckBadgeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="text-xs sm:text-sm font-medium">Vetted</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 flex items-center">
                <ShieldCheckIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="text-xs sm:text-sm font-medium">
                  Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - Fully Responsive */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="flex-1 relative order-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] text-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category/Service Filter */}
            <div className="relative order-2 sm:w-auto">
              <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] text-sm appearance-none"
              >
                <option value="all">All Services ({services.length})</option>
                <optgroup label="Categories">
                  <optgroup label="Categories">
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Individual Services">
                    {allServiceNames.map((serviceName) => (
                      <option key={serviceName} value={serviceName}>
                        {serviceName}
                      </option>
                    ))}
                  </optgroup>
                </optgroup>
                <optgroup label="Individual Services">
                  {allServiceNames.map((serviceName) => (
                    <option key={serviceName} value={serviceName}>
                      {serviceName}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || selectedCategory !== "all") && (
              <div className="order-3">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center justify-center whitespace-nowrap w-full sm:w-auto text-sm py-2.5"
                >
                  <XMarkIcon className="h-4 w-4 mr-1.5" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Search Results Counter - Mobile Optimized */}
          {!loading && (
            <div className="mt-3 sm:mt-2 text-xs sm:text-sm text-slate-600 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span>
                  {filteredServices.length === services.length
                    ? `Showing all ${services.length} services`
                    : `Found ${filteredServices.length} service${filteredServices.length !== 1 ? "s" : ""
                    }`}
                </span>
                {(searchTerm || selectedCategory !== "all") && (
                  <span className="mt-1 sm:mt-0">
                    {searchTerm && `matching "${searchTerm}"`}
                    {searchTerm && selectedCategory !== "all" && " "}
                    {selectedCategory !== "all" && `in ${selectedCategory}`}
                  </span>
                )}
                {filteredServices.length > servicesPerPage && (
                  <span className="mt-1 sm:mt-0">
                    • Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
              {searchTerm.trim() !== "" && (
                <div className="mt-2 sm:mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#4EC6E5]/10 text-[#4EC6E5] font-medium">
                    <MagnifyingGlassIcon className="h-3 w-3 mr-1" />
                    Filtered
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Services Grid Container - Fully Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Services Grid */}
        {loading ? (
          <LoadingGrid count={6} />
        ) : serviceError ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <InformationCircleIcon className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{serviceError}</p>
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <SparklesIcon className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
              No services found
            </h3>
            <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
              Try adjusting your search or category filter to find what you're
              looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white font-semibold rounded-xl hover:from-[#3BB8DF] hover:to-[#2293B5] transition-all duration-300 text-sm sm:text-base"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-3 sm:gap-4 md:gap-6 ${currentServices.length === 1
                ? "grid-cols-1 max-w-xl sm:max-w-2xl lg:max-w-4xl mx-auto"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4"
                }`}
            >
              {currentServices.map((service) => {
                // Use actual API pricing - membership_price for members, base_price for non-members
                const memberPrice = service.membership_price
                  ? parseFloat(service.membership_price)
                  : service.memberPrice
                    ? parseInt(service.memberPrice.replace(/\D/g, ""))
                    : 18;

                const regularPrice = service.base_price
                  ? parseFloat(service.base_price)
                  : service.regularPrice
                    ? parseInt(service.regularPrice.replace(/\D/g, ""))
                    : 36;

                return (
                  <div key={service.id} className="group relative">
                    <div
                      onClick={() => onServiceSelect(service)}
                      className={`block h-full bg-white/80 hover:bg-white rounded-xl sm:rounded-2xl border border-slate-200/60 hover:border-[#4EC6E5]/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden cursor-pointer ${currentServices.length === 1
                        ? "p-6 sm:p-8"
                        : "p-4 sm:p-6"
                        }`}
                    >
                      {/* Background Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>

                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col">
                        {/* Service Image Header */}
                        <div className="relative mb-3 sm:mb-4">
                          <div
                            className={`w-full rounded-lg sm:rounded-xl overflow-hidden ${currentServices.length === 1
                              ? "h-56 sm:h-64 lg:h-72"
                              : "h-40 sm:h-48"
                              }`}
                          >
                            <ServiceImage
                              serviceName={service.name}
                              src={getServiceImage(service.name)}
                              service={service}
                              showBadges={false} // We'll render badges separately below
                            />
                          </div>

                          {/* Badges overlay */}
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1">
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
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                            <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 drop-shadow-lg" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-bold text-slate-900 mb-2 sm:mb-3 leading-tight group-hover:text-[#2BA8CD] transition-colors duration-200 flex-grow ${currentServices.length === 1
                            ? "text-xl sm:text-2xl lg:text-3xl"
                            : "text-base sm:text-lg"
                            }`}
                        >
                          {service.name}
                        </h3>

                        {/* Description */}
                        <p
                          className={`text-slate-600 mb-3 sm:mb-4 leading-relaxed overflow-hidden ${currentServices.length === 1
                            ? "text-sm sm:text-base max-h-20 sm:max-h-24"
                            : "text-xs sm:text-sm max-h-12 sm:max-h-16"
                            }`}
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp:
                              currentServices.length === 1 ? 3 : 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {service.description}
                        </p>

                        {/* Features */}
                        {service.features && (
                          <div className="mb-3 sm:mb-4">
                            <div className="flex flex-wrap gap-1">
                              {service.features
                                ?.slice(0, currentServices.length === 1 ? 6 : 3)
                                .map((feature, index) => (
                                  <span
                                    key={index}
                                    className={`bg-slate-100 text-slate-600 rounded-lg ${currentServices.length === 1
                                      ? "text-xs sm:text-sm px-2 sm:px-3 py-1"
                                      : "text-xs px-2 py-1"
                                      }`}
                                  >
                                    {feature}
                                  </span>
                                ))}
                              {service.features?.length >
                                (currentServices.length === 1 ? 6 : 3) && (
                                  <span className="text-xs text-[#4EC6E5] font-medium">
                                    +
                                    {service.features.length -
                                      (currentServices.length === 1 ? 6 : 3)}{" "}
                                    more
                                  </span>
                                )}
                            </div>
                          </div>
                        )}

                        {/* Price and Category */}
                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-2">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`font-bold text-[#4EC6E5] ${currentServices.length === 1
                                  ? "text-2xl sm:text-3xl"
                                  : "text-lg sm:text-xl"
                                  }`}
                              >
                                {formatCurrency(memberPrice)}/h
                              </span>
                              <span
                                className={`text-slate-400 line-through ${currentServices.length === 1
                                  ? "text-sm sm:text-base"
                                  : "text-xs sm:text-sm"
                                  }`}
                              >
                                {formatCurrency(regularPrice)}/h
                              </span>
                            </div>
                            {service.category && (
                              <span
                                className={`bg-[#E0F6FD] text-[#2BA8CD] rounded-lg font-medium shrink-0 ${currentServices.length === 1
                                  ? "text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                                  : "text-xs px-2 sm:px-3 py-1"
                                  }`}
                              >
                                {service.category}
                              </span>
                            )}
                          </div>

                          {/* Savings Badge */}
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold px-3 py-1.5 sm:py-2 rounded-lg text-center mb-2">
                            {(() => {
                              const savingsPercent = regularPrice > 0
                                ? Math.round(((regularPrice - memberPrice) / regularPrice) * 100)
                                : 50;
                              return `Save ${savingsPercent}% with Membership`;
                            })()}
                          </div>

                          {/* Rating Display (if available) */}
                          {service.rating && (
                            <div className="flex items-center justify-between sm:justify-start gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(service.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs sm:text-sm text-gray-600">
                                {service.rating} ({service.review_count || 0})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls - Fully Responsive */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-6 sm:mt-8 px-4 sm:px-0">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center text-sm sm:text-base py-2 px-4 w-full sm:w-auto justify-center"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {/* Page Numbers - Mobile Optimized */}
                <div className="flex items-center gap-1 sm:gap-1 overflow-x-auto max-w-full">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;

                    // Mobile: Show fewer pages, Desktop: Show more
                    const showRange = isMobile ? 1 : 2;

                    const shouldShow =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - showRange &&
                        page <= currentPage + showRange);

                    if (!shouldShow) {
                      if (
                        page === currentPage - (showRange + 1) ||
                        page === currentPage + (showRange + 1)
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-1 sm:px-2 text-gray-400 text-sm"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        variant={isCurrentPage ? "primary" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm shrink-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center text-sm sm:text-base py-2 px-4 w-full sm:w-auto justify-center"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceSearch;
