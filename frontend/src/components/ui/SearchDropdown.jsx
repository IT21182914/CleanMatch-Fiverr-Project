import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  StarIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const SearchDropdown = ({
  searchTerm,
  services = [],
  isOpen,
  onClose,
  onItemClick,
  selectedIndex = -1,
  className = "",
}) => {
  const dropdownRef = useRef(null);

  // Filter services based on search term
  const filteredServices =
    searchTerm.trim() === ""
      ? services.slice(0, 8) // Show first 8 services when no search term
      : services
          .filter(
            (service) =>
              service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              service.features?.some((feature) =>
                feature.toLowerCase().includes(searchTerm.toLowerCase())
              )
          )
          .slice(0, 10); // Limit to 10 results

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

  const handleServiceClick = (service) => {
    onItemClick(service);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-0 right-0 bg-white/98 backdrop-blur-2xl shadow-2xl border border-slate-200/60 rounded-2xl z-50 mt-2 max-h-[400px] overflow-hidden animate-fade-in-scale ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200/60 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">
              {searchTerm.trim() === "" ? "All Services" : "Search Results"}
            </span>
          </div>
          <span className="text-xs text-slate-600">
            {filteredServices.length} result
            {filteredServices.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Services List */}
      <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
        {filteredServices.length > 0 ? (
          <div className="py-2">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={service.id}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] border-l-2 border-[#4EC6E5]"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => handleServiceClick(service)}
                  onMouseEnter={() => {
                    /* No action needed for hover in this implementation */
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {/* Service Icon */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        service.premium
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25"
                          : service.emergency
                          ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25"
                          : "bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] shadow-lg shadow-[#4EC6E5]/25"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                            {service.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {service.popular && (
                              <div className="flex items-center">
                                <StarIcon className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                                <span className="text-xs font-medium text-amber-600">
                                  Popular
                                </span>
                              </div>
                            )}
                            {service.premium && (
                              <div className="flex items-center">
                                <StarIcon className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                                <span className="text-xs font-medium text-amber-600">
                                  Premium
                                </span>
                              </div>
                            )}
                            {service.emergency && (
                              <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-3 w-3 text-red-500 mr-1" />
                                <span className="text-xs font-medium text-red-600">
                                  24/7 Emergency
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-[#4EC6E5]">
                            {service.memberPrice}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            {service.regularPrice}
                          </span>
                        </div>
                        <span className="text-xs bg-[#E0F6FD] text-[#2BA8CD] px-2 py-1 rounded-lg font-medium">
                          {service.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MagnifyingGlassIcon className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">
              No services found
            </h3>
            <p className="text-sm text-slate-600">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredServices.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200/60 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD]">
          <Link
            to="/services"
            className="flex items-center justify-center w-full py-2 text-sm font-medium text-[#4EC6E5] hover:text-[#2BA8CD] transition-colors duration-200"
            onClick={onClose}
          >
            View All Services
            <ChevronRightIcon className="h-3 w-3 ml-1" />
          </Link>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
          animation: fadeInScale 0.2s ease-out;
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

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SearchDropdown;
