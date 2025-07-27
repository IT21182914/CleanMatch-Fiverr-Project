import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SearchDropdown from "./SearchDropdown";

const SearchInput = ({
  searchTerm,
  onSearchChange,
  services = [],
  onServiceSelect,
  placeholder = "Search services...",
  className = "",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Filter services for dropdown
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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    onSearchChange(value);
    setSelectedIndex(-1); // Reset selection when typing

    // Show dropdown when typing or when focused with no search term
    if (value.trim() !== "" || isFocused) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen || filteredServices.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredServices.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredServices.length) {
          const selectedService = filteredServices[selectedIndex];
          handleServiceSelect(selectedService);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleServiceSelect = (service) => {
    if (onServiceSelect) {
      onServiceSelect(service);
    }
    setIsDropdownOpen(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className={`relative flex-1 ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4EC6E5] focus:border-transparent text-sm transition-all duration-200 ${
            searchTerm.trim() !== "" || isFocused
              ? "border-[#4EC6E5] ring-1 ring-[#4EC6E5]/20"
              : "border-slate-200"
          }`}
        />
      </div>

      <SearchDropdown
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        services={services}
        isOpen={isDropdownOpen}
        onClose={handleCloseDropdown}
        onItemClick={handleServiceSelect}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};

export default SearchInput;
