import { useState } from "react";
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
import ServicesDropdown from "../ui/ServicesDropdown";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavigation = () => {
    if (!isAuthenticated) {
      return [
        { name: "Home", href: "/", icon: HomeIcon, highlight: true },
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

  // Services data for mobile view
  const servicesCategories = [
    {
      title: "Residential",
      services: [
        "House and Apartment Cleaning",
        "Deep Cleaning Services",
        "Move-in / Move-out Cleaning",
        "Maid and Domestic Help Services",
        "Luxury Villa Cleaning",
        "Airbnb & Short-Term Rental Cleaning",
      ],
    },
    {
      title: "Commercial",
      services: [
        "Office and Workspace Cleaning",
        "Shop and Retail Store Cleaning",
        "Hotel Room and Hall Cleaning",
        "School & University Cleaning",
        "Commercial Property Cleaning",
        "Warehouse Cleaning Solutions",
      ],
    },
    {
      title: "Specialized",
      services: [
        "Window and Glass Cleaning",
        "Post-Construction Cleaning",
        "Pool Maintenance and Cleaning",
        "Aircraft & Private Jet Cleaning",
        "Yacht & Boat Cleaning",
        "Industrial and Factory Cleaning",
      ],
    },
    {
      title: "Health & Safety",
      services: [
        "Disinfection & Sanitization",
        "Hospital & Clinic Cleaning",
        "Mold Inspection & Removal",
        "Pest Control & Fumigation",
        "24/7 Emergency Cleaning Services",
        "Green / Eco-Friendly Cleaning Services",
      ],
    },
    {
      title: "Maintenance",
      services: [
        "Routine Maintenance Cleaning",
        "Janitor and Caretaker Services",
        "Floor Scrubbing & Polishing",
        "Carpet and Rug Shampooing",
        "Sofa & Upholstery Cleaning",
        "Laundry and Ironing Services",
      ],
    },
    {
      title: "Outdoor & More",
      services: [
        "Lawn Mowing & Weed Removal",
        "Snow & Winter Services",
        "Garden and Outdoor Cleaning",
        "Roof & Terrace Cleaning",
        "Car Interior & Exterior Detailing",
        "Event Cleanup Services",
      ],
    },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center shadow-xl shadow-[#4EC6E5]/25 group-hover:shadow-2xl group-hover:shadow-[#4EC6E5]/40 transition-all duration-300 group-hover:scale-110">
                  <SparklesIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                  SIMORGH SERVICE
                </span>
                <span className="text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent leading-none tracking-wide">
                  SOLUTION FOR YOUR COMPANY
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href === "/" && location.pathname === "/");

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
                        "group relative inline-flex items-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border backdrop-blur-sm isolate",
                        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]",
                        isActive
                          ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] !text-white border-2 border-[#2BA8CD] shadow-2xl shadow-[#4EC6E5]/50 scale-105 transform relative before:absolute before:inset-0 before:bg-white/20 before:rounded-xl before:animate-pulse"
                          : item.highlight
                          ? "text-[#4EC6E5] border-[#4EC6E5]/30 bg-[#F0FBFE] hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:!text-white hover:border-[#4EC6E5] hover:shadow-xl hover:shadow-[#4EC6E5]/25 hover:scale-105 hover:z-50"
                          : "text-slate-700 hover:!text-white bg-white/50 hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] border-transparent hover:border-[#4EC6E5]/30 hover:shadow-lg hover:scale-105 hover:z-50"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2.5" />
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  </div>

                  {/* Services Dropdown - Show right after Home */}
                  {!isAuthenticated && item.name === "Home" && (
                    <div className="relative ml-2" style={{ zIndex: 200 }}>
                      <ServicesDropdown />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex lg:items-center lg:space-x-5">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" style={{ zIndex: 80 }}>
                  <button className="relative p-2.5 rounded-xl text-slate-600 hover:text-[#4EC6E5] hover:bg-[#F0FBFE] transition-all duration-200 group isolate hover:z-50">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      3
                    </span>
                  </button>
                </div>

                {/* User Info */}
                <div className="relative" style={{ zIndex: 70 }}>
                  <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] border border-[#BAEDFB]/30 isolate">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {user?.firstName || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-[#2BA8CD] capitalize font-medium">
                        {user?.role}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] flex items-center justify-center shadow-lg shadow-[#4EC6E5]/25">
                        <span className="text-white font-bold text-sm">
                          {(user?.firstName || user?.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="relative" style={{ zIndex: 60 }}>
                  <button
                    onClick={handleLogout}
                    className="group relative inline-flex items-center px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 border border-slate-200 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm isolate hover:z-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    <span className="relative z-10">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Auth Buttons */}
                <div className="relative" style={{ zIndex: 80 }}>
                  <Link
                    to="/login"
                    className="group relative inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm text-[#4EC6E5] border-[#4EC6E5]/30 bg-white/70 hover:bg-[#4EC6E5] hover:!text-white hover:border-[#4EC6E5] isolate hover:z-50"
                  >
                    <span className="relative z-10">Sign In</span>
                  </Link>
                </div>
                <div className="relative" style={{ zIndex: 70 }}>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm !text-white bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] border-[#4EC6E5] hover:from-[#3BB8DF] hover:to-[#2293B5] shadow-lg shadow-[#4EC6E5]/25 isolate hover:z-50"
                  >
                    <span className="relative z-10">Register</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            {isAuthenticated && (
              <div className="mr-3 flex items-center">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] flex items-center justify-center shadow-lg shadow-[#4EC6E5]/25">
                    <span className="text-white font-semibold text-sm">
                      {(user?.firstName || user?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-[#F0FBFE] border border-transparent hover:border-[#BAEDFB] transition-all duration-200 backdrop-blur-sm"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-out border-l border-slate-200/60">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  SIMORGH SERVICE
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="px-6 py-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] !text-white shadow-2xl shadow-[#4EC6E5]/50 scale-105 transform border-2 border-[#2BA8CD] relative before:absolute before:inset-0 before:bg-white/20 before:rounded-xl before:animate-pulse"
                        : item.highlight
                        ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white shadow-lg hover:shadow-xl hover:scale-105"
                        : "text-slate-700 hover:!text-white hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:shadow-lg hover:scale-105"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Services Section */}
              <div className="border-t border-slate-200/60 pt-4 mt-6">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-3" />
                    Services
                  </div>
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform duration-300 ${
                      mobileServicesOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {mobileServicesOpen && (
                  <div className="mt-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
                    <div className="space-y-4 px-4">
                      {servicesCategories.map((category, categoryIndex) => (
                        <div
                          key={categoryIndex}
                          className="border-l-4 border-[#BAEDFB] pl-4 py-2 bg-gradient-to-r from-[#F0FBFE] to-transparent rounded-r-xl"
                        >
                          <h4 className="text-sm font-bold text-slate-900 mb-3">
                            {category.title}
                          </h4>
                          <div className="space-y-2">
                            {category.services.map((service, serviceIndex) => (
                              <Link
                                key={serviceIndex}
                                to={`/services/${service
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")}`}
                                className="block px-3 py-2 text-xs text-slate-600 hover:text-[#4EC6E5] hover:bg-white rounded-lg transition-all duration-200 hover:shadow-sm hover:translate-x-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {service}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mobile Services Footer */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD] rounded-xl border border-[#BAEDFB]/30">
                      <div className="flex space-x-3">
                        <Link
                          to="/services"
                          className="flex-1 text-center py-3 px-4 bg-white border border-[#BAEDFB] text-xs font-semibold text-[#2BA8CD] rounded-xl hover:bg-[#F0FBFE] transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          All Services
                        </Link>
                        <Link
                          to="/contact"
                          className="flex-1 text-center py-3 px-4 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white text-xs font-semibold rounded-xl hover:from-[#3BB8DF] hover:to-[#2293B5] transition-all duration-200 shadow-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-slate-200/60 px-6 py-6 bg-gradient-to-r from-[#F0FBFE] to-[#E0F6FD]">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#BAEDFB]/30 shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {(user?.firstName || user?.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {user?.firstName || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-sm text-[#2BA8CD] capitalize font-medium">
                        {user?.role} Account
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Link
                      to="/customer/profile"
                      className="flex items-center px-4 py-3 text-slate-700 hover:text-[#4EC6E5] hover:bg-white/50 rounded-xl transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      Profile Settings
                    </Link>
                    {user?.role === "customer" && (
                      <Link
                        to="/customer/membership"
                        className="flex items-center px-4 py-3 text-slate-700 hover:text-[#4EC6E5] hover:bg-white/50 rounded-xl transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <CreditCardIcon className="h-5 w-5 mr-3" />
                        ForeverClean Membership
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Auth Buttons */}
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full text-center py-4 px-6 border border-[#4EC6E5]/30 rounded-2xl text-[#4EC6E5] font-semibold hover:bg-[#4EC6E5] hover:!text-white hover:border-[#4EC6E5] transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm bg-white/70"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center py-4 px-6 rounded-2xl !text-white font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>

                  {/* Features */}
                  <div className="pt-4 border-t border-[#BAEDFB]/30">
                    <p className="text-sm text-slate-600 text-center mb-4 font-medium">
                      Why choose SIMORGH SERVICE?
                    </p>
                    <div className="space-y-3 text-sm">
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
                          <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] rounded-full mr-3"></div>
                          {feature}
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
