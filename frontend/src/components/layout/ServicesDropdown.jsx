import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  SparklesIcon,
  ChevronRightIcon,
  StarIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { allServices, searchServices } from "../../data/services";
import { categories } from "../../data/services/categories";

const ServicesDropdown = ({ isOpen, onClose, className = "" }) => {
  const [hoveredService, setHoveredService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const dropdownRef = useRef(null);

  const filteredServices = searchServices(searchTerm, selectedCategory);

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
      className={`absolute top-full left-0 right-0 bg-white/98 backdrop-blur-2xl shadow-2xl border border-slate-200/60 rounded-3xl z-[100] mt-4 max-h-[85vh] flex flex-col overflow-hidden animate-fade-in-scale w-[calc(100vw-2rem)] md:w-auto md:min-w-[900px] md:max-w-[1200px] mx-auto ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-3 md:p-4 border-b border-slate-200/60 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 md:gap-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Our Services
              </h2>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                {allServices.length} professional cleaning solutions
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* View All Button - Prominently Displayed */}
            <Link to="/services" className="flex-1 sm:flex-none">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4EC6E5]/25 group flex items-center justify-center"
              >
                <span className="text-sm md:text-base">View All Services</span>
                <ChevronRightIcon className="ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <div className="px-3 md:px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl text-xs md:text-sm font-semibold shadow-lg text-center">
              Up to 50% OFF with Membership
            </div>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="flex flex-col gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Compact Category Tabs - Mobile Optimized */}
          <div className="flex flex-wrap gap-1 md:gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
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
      <div className="flex-1 min-h-0 px-3 md:px-6 pt-4 md:pt-6 pb-6 md:pb-8 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pb-4 md:pb-6">
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
                  className="block p-3 md:p-4 bg-white/80 hover:bg-white rounded-2xl border border-slate-200/60 hover:border-[#4EC6E5]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 group relative overflow-hidden"
                  onClick={onClose}
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F0FBFE] to-[#E0F6FD] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            service.premium
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25"
                              : service.emergency
                              ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25"
                              : "bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] shadow-lg shadow-[#4EC6E5]/25"
                          } group-hover:scale-110`}
                        >
                          <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          {/* Added min-w-0 and flex-1 for better text wrapping */}
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
                      <ChevronRightIcon className="h-3 w-3 md:h-4 md:w-4 text-slate-400 group-hover:text-[#4EC6E5] group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-2 text-sm md:text-sm leading-tight group-hover:text-[#2BA8CD] transition-colors duration-200">
                      {service.name}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-base md:text-lg font-bold text-[#4EC6E5]">
                          {service.memberPrice}
                        </span>
                        <span className="text-xs md:text-sm text-slate-400 line-through">
                          {service.regularPrice}
                        </span>
                      </div>
                      <span className="text-xs bg-[#E0F6FD] text-[#2BA8CD] px-2 py-1 rounded-lg font-medium w-fit">
                        {service.category}
                      </span>
                    </div>

                    {/* Mobile: Always show description, Desktop: Show on hover */}
                    <div className="md:hidden mb-2">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    {/* Desktop Hover Description */}
                    <div
                      className={`hidden md:block transition-all duration-300 overflow-hidden ${
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
          <div className="text-center py-12 mb-4">
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
      <div className="flex-shrink-0 px-3 md:px-4 py-3 md:py-2 border-t border-slate-200/60 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2">
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center text-xs text-slate-600">
              <CheckBadgeIcon className="h-3 w-3 text-[#4EC6E5] mr-1" />
              <span className="font-medium">Vetted & insured</span>
            </div>
            <div className="flex items-center text-xs text-slate-600">
              <ShieldCheckIcon className="h-3 w-3 text-[#4EC6E5] mr-1" />
              <span className="font-medium">Satisfaction guaranteed</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Link
              to="/book"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 md:px-3 py-2 md:py-1.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] font-medium text-sm rounded-lg transition-all duration-300 shadow-md shadow-[#4EC6E5]/25 text-center"
              style={{ color: "white" }}
            >
              Book Now
            </Link>
            <Link
              to="/services"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 md:px-3 py-2 md:py-1.5 border border-[#4EC6E5]/30 text-[#4EC6E5] hover:bg-[#4EC6E5] font-medium text-sm rounded-lg transition-all duration-300 bg-white/70 hover:text-white text-center"
              style={{
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#4EC6E5";
              }}
            >
              View All
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
