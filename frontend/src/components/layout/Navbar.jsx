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
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        { name: "Home", href: "/", icon: HomeIcon },
        {
          name: "Book Cleaning",
          href: "/register",
          icon: CalendarIcon,
          highlight: true,
        },
        {
          name: "How It Works",
          href: "/#how-it-works",
          icon: ClipboardDocumentListIcon,
        },
        { name: "Support", href: "/#support", icon: ChatBubbleLeftRightIcon },
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
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold text-gray-900">
                  CleanMatch
                </span>
                <span className="text-xs text-yellow-600 font-medium leading-none">
                  Professional Cleaning
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      : item.highlight
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName || user?.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {(user?.firstName || user?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Phone Number */}
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">(555) 123-CLEAN</span>
                </div>

                {/* Auth Buttons */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-navy-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-200"
                  style={{ backgroundColor: "#1F2A44" }}
                >
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            {isAuthenticated && (
              <div className="mr-3 flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {(user?.firstName || user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  CleanMatch
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200",
                      isActive
                        ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        : item.highlight
                        ? "bg-yellow-500 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-gray-200 px-4 py-6">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {(user?.firstName || user?.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.firstName || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {user?.role} Account
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Link
                      to="/customer/profile"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      Profile Settings
                    </Link>
                    {user?.role === "customer" && (
                      <Link
                        to="/customer/membership"
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
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
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Phone */}
                  <div className="flex items-center justify-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <span className="font-medium">(555) 123-CLEAN</span>
                  </div>

                  {/* Auth Buttons */}
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full text-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center py-3 px-4 rounded-lg text-white font-medium transition-opacity duration-200"
                      style={{ backgroundColor: "#1F2A44" }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Book Your First Clean - $19
                    </Link>
                  </div>

                  {/* Features */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center mb-3">
                      Why choose CleanMatch?
                    </p>
                    <div className="space-y-2 text-sm">
                      {[
                        "Professional vetted cleaners",
                        "Satisfaction guaranteed",
                        "Flexible scheduling",
                        "Insured & bonded",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
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
