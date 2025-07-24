import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";
import ServicesDropdown from "./ServicesDropdown";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const servicesRef = useRef(null);

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };

    if (isServicesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isServicesDropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
      document.body.style.height = "unset";
      document.body.classList.remove("mobile-menu-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
      document.body.style.height = "unset";
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavigation = () => {
    if (!isAuthenticated) {
      return [
        { name: "Home", href: "/", icon: HomeIcon },
        {
          name: "Services",
          href: "/services",
          icon: SparklesIcon,
          hasDropdown: true,
          onClick: (e) => {
            e.preventDefault();
            setIsServicesDropdownOpen(!isServicesDropdownOpen);
          },
        },
        { name: "Agencies", href: "/agencies", icon: UserIcon },
        { name: "About us", href: "/about", icon: ClipboardDocumentListIcon },
        { name: "Contact us", href: "/contact", icon: ChatBubbleLeftRightIcon },
      ];
    }

    const baseNav = [{ name: "Dashboard", href: "/dashboard", icon: HomeIcon }];

    if (user?.role === "customer") {
      return [
        ...baseNav,
        {
          name: "Book Cleaning",
          href: "/book",
          icon: CalendarIcon,
          highlight: true,
        },
        { name: "AI Booking", href: "/book-ai", icon: SparklesIcon },
        {
          name: "My Bookings",
          href: "/customer/bookings",
          icon: ClipboardDocumentListIcon,
        },
        {
          name: "Membership",
          href: "/customer/membership",
          icon: CreditCardIcon,
        },
        { name: "Profile", href: "/customer/profile", icon: UserIcon },
      ];
    }

    if (user?.role === "cleaner") {
      return [
        ...baseNav,
        { name: "My Jobs", href: "/cleaner/jobs", icon: CalendarIcon },
        {
          name: "Availability",
          href: "/cleaner/availability",
          icon: CalendarIcon,
        },
        { name: "Earnings", href: "/cleaner/earnings", icon: CreditCardIcon },
        { name: "Profile", href: "/cleaner/profile", icon: UserIcon },
      ];
    }

    if (user?.role === "admin") {
      return [
        ...baseNav,
        { name: "Users", href: "/admin/users", icon: UserIcon },
        { name: "Bookings", href: "/admin/bookings", icon: CalendarIcon },
        { name: "Services", href: "/admin/services", icon: CalendarIcon },
        { name: "Analytics", href: "/admin/analytics", icon: CreditCardIcon },
      ];
    }

    return baseNav;
  };

  const navigation = getNavigation();

  return (
    <nav
      className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/60 sticky top-0 z-50 w-full"
      style={{
        visibility: "visible",
        display: "block",
        position: "sticky",
        top: 0,
        zIndex: 50,
        minHeight: "64px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full relative">
        <div className="flex justify-between items-center min-h-[64px] sm:min-h-[72px] md:min-h-[80px] lg:min-h-[88px] xl:min-h-[96px] w-full">
          {/* Logo Section */}
          <div className="flex items-center min-w-0 flex-shrink-0 mr-2 sm:mr-4">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img
                  src="/Simorgh-Service-Logo.webp"
                  alt="Simorgh Service Logo"
                  className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 xl:h-18 object-contain group-hover:scale-105 transition-all duration-300 filter group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5]/10 to-[#2BA8CD]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-3 xl:space-x-4 flex-shrink-0">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href === "/" && location.pathname === "/");

              // Services dropdown item
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center relative"
                    style={{ zIndex: 100 - index }}
                    ref={servicesRef}
                  >
                    <div className="relative">
                      <button
                        onClick={item.onClick}
                        className={cn(
                          "group relative inline-flex items-center px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-lg md:rounded-xl text-xs md:text-sm lg:text-sm font-semibold transition-all duration-300 border backdrop-blur-sm isolate",
                          "before:absolute before:inset-0 before:rounded-lg md:before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]",
                          isServicesDropdownOpen
                            ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] !text-white border-2 border-[#2BA8CD] shadow-lg md:shadow-2xl shadow-[#4EC6E5]/50 scale-105 transform relative before:absolute before:inset-0 before:bg-white/20 before:rounded-lg md:before:rounded-xl before:animate-pulse"
                            : "text-slate-700 hover:!text-white bg-white/50 hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] border-transparent hover:border-[#4EC6E5]/30 hover:shadow-lg hover:scale-105 hover:z-50"
                        )}
                      >
                        <Icon className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2.5" />
                        <span className="relative z-10 truncate mr-1">
                          {item.name}
                        </span>
                        <ChevronDownIcon
                          className={cn(
                            "h-3 w-3 md:h-4 md:w-4 transition-transform duration-200",
                            isServicesDropdownOpen ? "rotate-180" : ""
                          )}
                        />
                      </button>

                      {/* Services Dropdown */}
                      <ServicesDropdown
                        isOpen={isServicesDropdownOpen}
                        onClose={() => setIsServicesDropdownOpen(false)}
                        className="left-1/2 transform -translate-x-1/2"
                      />
                    </div>
                  </div>
                );
              }

              // Regular navigation items
              return (
                <div
                  key={item.name}
                  className="flex items-center relative"
                  style={{ zIndex: 100 - index }}
                >
                  <div className="relative">
                    <Link
                      to={item.href}
                      className={cn(
                        "group relative inline-flex items-center px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-lg md:rounded-xl text-xs md:text-sm lg:text-sm font-semibold transition-all duration-300 border backdrop-blur-sm isolate",
                        "before:absolute before:inset-0 before:rounded-lg md:before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]",
                        isActive
                          ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] !text-white border-2 border-[#2BA8CD] shadow-lg md:shadow-2xl shadow-[#4EC6E5]/50 scale-105 transform relative before:absolute before:inset-0 before:bg-white/20 before:rounded-lg md:before:rounded-xl before:animate-pulse"
                          : item.highlight
                          ? "text-[#4EC6E5] border-[#4EC6E5]/30 bg-[#F0FBFE] hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:!text-white hover:border-[#4EC6E5] hover:shadow-xl hover:shadow-[#4EC6E5]/25 hover:scale-105 hover:z-50"
                          : "text-slate-700 hover:!text-white bg-white/50 hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] border-transparent hover:border-[#4EC6E5]/30 hover:shadow-lg hover:scale-105 hover:z-50"
                      )}
                    >
                      <Icon className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2.5" />
                      <span className="relative z-10 truncate">
                        {item.name}
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-3 xl:space-x-5 flex-shrink-0">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" style={{ zIndex: 80 }}>
                  <button className="relative p-2 md:p-2.5 rounded-lg md:rounded-xl text-slate-600 hover:text-[#4EC6E5] hover:bg-[#F0FBFE] transition-all duration-200 group isolate hover:z-50">
                    <BellIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      3
                    </span>
                  </button>
                </div>

                {/* User Info */}
                <div className="relative" style={{ zIndex: 70 }}>
                  <div className="flex items-center space-x-2 md:space-x-3 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] border border-[#BAEDFB]/30 isolate">
                    <div className="text-right hidden lg:block">
                      <p className="text-xs md:text-sm font-semibold text-slate-900 truncate max-w-[100px] xl:max-w-none">
                        {user?.firstName || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-[#2BA8CD] capitalize font-medium">
                        {user?.role}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] flex items-center justify-center shadow-lg shadow-[#4EC6E5]/25">
                        <span className="text-white font-bold text-xs md:text-sm">
                          {(user?.firstName || user?.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="relative" style={{ zIndex: 60 }}>
                  <button
                    onClick={handleLogout}
                    className="group relative inline-flex items-center px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold text-slate-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 border border-slate-200 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm isolate hover:z-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                    <span className="relative z-10 hidden lg:inline">
                      Logout
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Auth Buttons */}
                <div className="relative" style={{ zIndex: 80 }}>
                  <Link
                    to="/login"
                    className="group relative inline-flex items-center px-3 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold border transition-all duration-300 hover:shadow-lg md:hover:shadow-xl hover:scale-105 backdrop-blur-sm text-[#4EC6E5] border-[#4EC6E5]/30 bg-white/70 hover:bg-[#4EC6E5] hover:!text-white hover:border-[#4EC6E5] isolate hover:z-50"
                  >
                    <span className="relative z-10">Sign In</span>
                  </Link>
                </div>
                <div className="relative" style={{ zIndex: 70 }}>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center px-3 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold border transition-all duration-300 hover:shadow-lg md:hover:shadow-xl hover:scale-105 backdrop-blur-sm !text-white bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] border-[#4EC6E5] hover:from-[#3BB8DF] hover:to-[#2293B5] shadow-lg shadow-[#4EC6E5]/25 isolate hover:z-50"
                  >
                    <span className="relative z-10">Register</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden flex-shrink-0">
            {isAuthenticated && (
              <div className="mr-2 sm:mr-3 flex items-center">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] flex items-center justify-center shadow-lg shadow-[#4EC6E5]/25">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {(user?.firstName || user?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border border-white sm:border-2 rounded-full"></div>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-slate-600 hover:text-slate-900 hover:bg-[#F0FBFE] border border-transparent hover:border-[#BAEDFB] transition-all duration-200 backdrop-blur-sm touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] active:scale-95"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                <span
                  className={`absolute top-0 left-0 h-0.5 w-5 sm:w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen
                      ? "rotate-45 translate-y-2 sm:translate-y-2.5"
                      : ""
                  }`}
                />
                <span
                  className={`absolute top-2 sm:top-2.5 left-0 h-0.5 w-5 sm:w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute top-4 sm:top-5 left-0 h-0.5 w-5 sm:w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen
                      ? "-rotate-45 -translate-y-2 sm:-translate-y-2.5"
                      : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Full Screen Mobile Menu */}
          <div className="fixed inset-0 bg-white z-[70] transform transition-transform duration-300 ease-out flex flex-col mobile-menu-panel">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-slate-200/60 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    SIMORGH SERVICE
                  </span>
                  <span className="text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent hidden sm:block">
                    SOLUTION FOR YOUR COMPANY
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors duration-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center touch-manipulation"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white">
              <div className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 space-y-1.5 sm:space-y-2 overflow-y-auto mobile-nav-scroll flex-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  // Services dropdown for mobile
                  if (item.hasDropdown) {
                    return (
                      <div key={item.name} className="space-y-2">
                        <Link
                          to="/services"
                          className="group flex items-center px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 w-full touch-manipulation min-h-[48px] sm:min-h-[52px] text-sm sm:text-base text-slate-700 hover:!text-white hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:shadow-md border border-slate-200 hover:border-[#4EC6E5] bg-white hover:scale-[1.02] active:scale-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2.5 sm:mr-3 flex-shrink-0" />
                          <span className="truncate flex-1">{item.name}</span>
                          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                        </Link>

                        {/* Mobile Services Quick Access */}
                        <div className="ml-4 space-y-1">
                          <Link
                            to="/services/1"
                            className="flex items-center text-slate-600 hover:text-[#4EC6E5] py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <HomeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            House Cleaning
                            <span className="ml-auto text-xs text-[#4EC6E5] font-semibold">
                              $18/h
                            </span>
                          </Link>
                          <Link
                            to="/services/2"
                            className="flex items-center text-slate-600 hover:text-[#4EC6E5] py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <SparklesIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            Deep Cleaning
                            <span className="ml-auto text-xs text-[#4EC6E5] font-semibold">
                              $22/h
                            </span>
                          </Link>
                          <Link
                            to="/services/3"
                            className="flex items-center text-slate-600 hover:text-[#4EC6E5] py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            Office Cleaning
                            <span className="ml-auto text-xs text-[#4EC6E5] font-semibold">
                              $22/h
                            </span>
                          </Link>
                          <Link
                            to="/services"
                            className="flex items-center text-[#4EC6E5] hover:text-[#2BA8CD] py-2 px-3 rounded-lg text-sm font-semibold transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            View All 50+ Services →
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "group flex items-center px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 w-full touch-manipulation min-h-[48px] sm:min-h-[52px]",
                        "text-sm sm:text-base",
                        isActive
                          ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] !text-white shadow-lg shadow-[#4EC6E5]/30 scale-[1.02] transform"
                          : item.highlight
                          ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white shadow-md"
                          : "text-slate-700 hover:!text-white hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:shadow-md border border-slate-200 hover:border-[#4EC6E5] bg-white hover:scale-[1.02] active:scale-100"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2.5 sm:mr-3 flex-shrink-0" />
                      <span className="truncate flex-1">{item.name}</span>
                      {item.highlight && (
                        <div className="ml-2 flex-shrink-0">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}

                {/* Services Link for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="border-t border-slate-200/60 pt-4 mt-4">
                    <Link
                      to="/services"
                      className="w-full flex items-center px-4 py-4 rounded-xl font-medium text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-[#4EC6E5] bg-white touch-manipulation min-h-[52px]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <SparklesIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="text-base sm:text-sm">
                        View All Services
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-slate-200/60 px-3 sm:px-4 py-4 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] flex-shrink-0">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {/* User Info Card */}
                  <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-[#BAEDFB]/30 shadow-md">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-base">
                        {(user?.firstName || user?.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-base text-slate-900 truncate">
                        {user?.firstName || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-sm text-[#2BA8CD] capitalize font-semibold">
                        {user?.role} Account
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                  </div>

                  {/* Role-Specific Quick Actions */}
                  <div className="space-y-2">
                    {user?.role === "customer" && (
                      <>
                        <Link
                          to="/customer/profile"
                          className="flex items-center px-4 py-3 text-slate-700 hover:text-[#4EC6E5] hover:bg-white/60 rounded-xl transition-all duration-200 touch-manipulation min-h-[48px]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <UserIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium truncate flex-1">
                            Profile Settings
                          </span>
                        </Link>
                        <Link
                          to="/customer/membership"
                          className="flex items-center px-4 py-3 text-slate-700 hover:text-[#4EC6E5] hover:bg-white/60 rounded-xl transition-all duration-200 touch-manipulation min-h-[48px]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <CreditCardIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium truncate flex-1">
                            ForeverClean Membership
                          </span>
                        </Link>
                      </>
                    )}

                    {user?.role === "cleaner" && (
                      <>
                        <Link
                          to="/cleaner/profile"
                          className="flex items-center px-4 py-3 text-slate-700 hover:text-[#4EC6E5] hover:bg-white/60 rounded-xl transition-all duration-200 touch-manipulation min-h-[48px]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <UserIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium truncate flex-1">
                            Profile Settings
                          </span>
                        </Link>
                        <Link
                          to="/cleaner/earnings"
                          className="flex items-center px-4 py-3 text-slate-700 hover:text-[#4EC6E5] hover:bg-white/60 rounded-xl transition-all duration-200 touch-manipulation min-h-[48px]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <CreditCardIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium truncate flex-1">
                            My Earnings
                          </span>
                        </Link>
                      </>
                    )}

                    {user?.role === "admin" && (
                      <>
                        <Link
                          to="/admin/users"
                          className="flex items-center px-4 py-3 text-slate-700 hover:text-[#4EC6E5] hover:bg-white/60 rounded-xl transition-all duration-200 touch-manipulation min-h-[48px]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <UserIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium truncate flex-1">
                            Manage Users
                          </span>
                        </Link>
                        <Link
                          to="/admin/analytics"
                          className="flex items-center px-4 py-3 text-slate-700 hover:text-[#4EC6E5] hover:bg-white/60 rounded-xl transition-all duration-200 touch-manipulation min-h-[48px]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <CreditCardIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium truncate flex-1">
                            Analytics
                          </span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="pt-2 border-t border-[#BAEDFB]/30">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 touch-manipulation min-h-[48px] font-medium"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="text-sm truncate flex-1">Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Auth Buttons */}
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="w-full text-center py-4 px-4 border-2 border-[#4EC6E5]/30 rounded-xl text-[#4EC6E5] font-semibold hover:bg-[#4EC6E5] hover:!text-white hover:border-[#4EC6E5] transition-all duration-300 backdrop-blur-sm bg-white/70 touch-manipulation min-h-[52px] flex items-center justify-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center py-4 px-4 rounded-xl !text-white font-semibold transition-all duration-300 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] shadow-lg shadow-[#4EC6E5]/25 touch-manipulation min-h-[52px] flex items-center justify-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>

                  {/* Features */}
                  <div className="pt-3 border-t border-[#BAEDFB]/30">
                    <p className="text-xs text-slate-600 text-center mb-3 font-medium">
                      Why choose SIMORGH SERVICE?
                    </p>
                    <div className="space-y-2 text-xs">
                      {[
                        "Professional vetted cleaners",
                        "Satisfaction guaranteed",
                        "Flexible scheduling",
                        "Insured & bonded",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-slate-600"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full mr-2 flex-shrink-0"></div>
                          <span className="truncate text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
