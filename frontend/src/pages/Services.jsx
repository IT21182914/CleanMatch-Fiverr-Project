import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
import { allServices, searchServices } from "../data/services";
import { categories } from "../data/services/categories";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [sortBy, setSortBy] = useState("popular"); // popular, price-low, price-high, name
  const servicesGridRef = useRef(null);

  const filteredServices = searchServices(searchTerm, selectedCategory);

  const sortedServices = [...filteredServices].sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Cleaning Services
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Professional cleaning solutions for every need. From residential
              to commercial, we've got you covered with {allServices.length}{" "}
              specialized services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center">
                <CheckBadgeIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Vetted & Insured Professionals
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] focus:border-transparent text-sm transition-all duration-200 ${
                  searchTerm.trim() !== ""
                    ? "border-[#4EC6E5] ring-1 ring-[#4EC6E5]/20"
                    : "border-slate-200"
                }`}
              />
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

          {/* Category Tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
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

      {/* Services Grid */}
      <div
        ref={servicesGridRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Results Info */}
        <div className="mb-8">
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
          className={`grid gap-6 ${
            sortedServices.length === 1
              ? "grid-cols-1 max-w-2xl mx-auto"
              : sortedServices.length <= 3
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : sortedServices.length <= 6
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {sortedServices.map((service) => {
            const Icon = service.icon;

            return (
              <div key={service.id} className="group relative">
                <Link
                  to={`/services/${service.id}`}
                  className={`block h-full bg-white/80 hover:bg-white rounded-2xl border border-slate-200/60 hover:border-[#4EC6E5]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden ${
                    sortedServices.length === 1 ? "p-8" : "p-6"
                  }`}
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`rounded-xl flex items-center justify-center transition-all duration-300 ${
                            sortedServices.length === 1
                              ? "w-16 h-16"
                              : "w-12 h-12"
                          } ${
                            service.premium
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25"
                              : service.emergency
                              ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25"
                              : "bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] shadow-lg shadow-[#4EC6E5]/25"
                          } group-hover:scale-110`}
                        >
                          <Icon
                            className={`text-white ${
                              sortedServices.length === 1
                                ? "h-8 w-8"
                                : "h-6 w-6"
                            }`}
                          />
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
                      <ChevronRightIcon className="h-5 w-5 text-slate-400 group-hover:text-[#4EC6E5] group-hover:translate-x-1 transition-all duration-200" />
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-bold text-slate-900 mb-3 leading-tight group-hover:text-[#2BA8CD] transition-colors duration-200 flex-grow ${
                        sortedServices.length === 1 ? "text-2xl" : "text-lg"
                      }`}
                    >
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-slate-600 mb-4 leading-relaxed ${
                        sortedServices.length === 1 ? "text-base" : "text-sm"
                      }`}
                    >
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {service.features
                          ?.slice(0, sortedServices.length === 1 ? 6 : 3)
                          .map((feature, index) => (
                            <span
                              key={index}
                              className={`bg-slate-100 text-slate-600 rounded-lg ${
                                sortedServices.length === 1
                                  ? "text-sm px-3 py-1"
                                  : "text-xs px-2 py-1"
                              }`}
                            >
                              {feature}
                            </span>
                          ))}
                        {service.features?.length >
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
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-bold text-[#4EC6E5] ${
                              sortedServices.length === 1
                                ? "text-3xl"
                                : "text-xl"
                            }`}
                          >
                            {service.memberPrice}
                          </span>
                          <span
                            className={`text-slate-400 line-through ${
                              sortedServices.length === 1
                                ? "text-base"
                                : "text-sm"
                            }`}
                          >
                            {service.regularPrice}
                          </span>
                        </div>
                        <span
                          className={`bg-[#E0F6FD] text-[#2BA8CD] rounded-lg font-medium ${
                            sortedServices.length === 1
                              ? "text-sm px-4 py-2"
                              : "text-xs px-3 py-1"
                          }`}
                        >
                          {service.category}
                        </span>
                      </div>

                      {/* Savings Badge */}
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-lg text-center">
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
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book Your Cleaning Service?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of satisfied customers and experience the CleanMatch
            difference today.
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
      </div>
    </div>
  );
};

export default Services;
