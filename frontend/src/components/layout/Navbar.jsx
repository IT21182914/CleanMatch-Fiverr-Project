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
import ServicesDropdown from "../ui/ServicesDropdown";

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

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold text-gray-900">
                  SIMORGH SERVICE
                </span>
                <span className="text-xs text-cyan-600 font-medium leading-none">
                  SOLUTION FOR YOUR COMPANY
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href === "/" && location.pathname === "/");

              return (
                <div key={item.name} className="flex items-center">
                  <Link
                    to={item.href}
                    className={cn(
                      "navbar-button group relative inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border overflow-hidden transform-gpu",
                      isActive
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 !text-white border-cyan-600 shadow-lg scale-105 ring-2 ring-cyan-200"
                        : item.highlight
                        ? "text-cyan-600 border-cyan-500 bg-white shadow-md hover:bg-cyan-500 hover:text-white hover:border-cyan-500 hover:shadow-xl hover:scale-105"
                        : "text-gray-600 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 border-transparent hover:border-cyan-200 hover:shadow-lg hover:scale-105"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                  {/* Show Services dropdown after Home */}
                  {item.name === "Home" && <ServicesDropdown />}
                </div>
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
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-2 border-white"
                    style={{ backgroundColor: "#4EC6E5" }}
                  >
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
                  className="navbar-button group relative inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 border border-gray-300 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:scale-105 transform-gpu"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Auth Buttons */}
                <Link
                  to="/login"
                  className="navbar-button group relative inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300 hover:shadow-xl hover:scale-105 transform-gpu overflow-hidden text-cyan-500 border-cyan-500 bg-transparent hover:bg-cyan-500 hover:!text-white hover:border-cyan-500"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="navbar-button group relative inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300 hover:shadow-xl hover:scale-105 transform-gpu overflow-hidden !text-white border-cyan-500 bg-cyan-500 hover:bg-cyan-600 hover:border-cyan-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            {isAuthenticated && (
              <div className="mr-3 flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-2 border-white"
                  style={{ backgroundColor: "#4EC6E5" }}
                >
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
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200"
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
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
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
                      "group flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 transform-gpu",
                      isActive
                        ? "bg-cyan-500 !text-white border border-cyan-500 shadow-lg scale-105"
                        : item.highlight
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-400 hover:shadow-lg hover:scale-105"
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
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
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
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform-gpu"
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
                      className="block w-full text-center py-3 px-4 border border-cyan-500 rounded-lg text-cyan-500 font-medium hover:bg-cyan-500 hover:!text-white hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:scale-105 transform-gpu"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center py-3 px-4 rounded-lg !text-white font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 transform-gpu bg-cyan-500 border border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
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
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
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
