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
        { name: "Services", href: "/services", icon: CalendarIcon },
      ];
    }

    const baseNav = [{ name: "Dashboard", href: "/dashboard", icon: HomeIcon }];

    if (user?.role === "customer") {
      return [
        ...baseNav,
        { name: "Book Service", href: "/book", icon: CalendarIcon },
        { name: "My Bookings", href: "/customer/bookings", icon: CalendarIcon },
        { name: "Payment History", href: "/payments", icon: CreditCardIcon },
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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                CleanMatch
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      location.pathname === item.href
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, {user?.firstName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                    location.pathname === item.href
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <p className="text-base font-medium text-gray-800">
                    {user?.firstName || user?.email}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
