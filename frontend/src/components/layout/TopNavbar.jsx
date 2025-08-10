import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

const TopNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [notifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Public navigation for non-authenticated users
  const publicNavigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Services", href: "/services", icon: SparklesIcon },
    { name: "About us", href: "/about", icon: ClipboardDocumentListIcon },
    { name: "Contact us", href: "/contact", icon: ChatBubbleLeftRightIcon },
  ];

  // Determine if this should show the full public navbar
  const showPublicNav =
    !isAuthenticated ||
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/services") ||
    location.pathname.startsWith("/about") ||
    location.pathname.startsWith("/contact");

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/60 sticky top-0 z-40 w-full">
      <div className="w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex h-14 xs:h-16 sm:h-18 md:h-20 items-center justify-between overflow-visible">
          {/* Mobile menu button (only for authenticated users with sidebar) */}
          {isAuthenticated && !showPublicNav && (
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-[#F0FBFE] border border-transparent hover:border-[#BAEDFB] transition-all duration-200"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          )}

          {/* Logo - Always visible */}
          <Link
            to={isAuthenticated && !showPublicNav ? "/dashboard" : "/"}
            className="flex items-center space-x-2 xs:space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="h-3 w-3 xs:h-4 xs:w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm xs:text-base sm:text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                SIMORGH SERVICE
              </span>
              <span className="text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent hidden xs:block">
                SOLUTION FOR YOUR COMPANY
              </span>
            </div>
          </Link>

          {/* Public Navigation (Desktop) - Only show for public pages */}
          {showPublicNav && (
            <div className="hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-4">
              {publicNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <div key={item.name} className="flex items-center">
                    <Link
                      to={item.href}
                      className={cn(
                        "inline-flex items-center px-3 xl:px-4 py-2 xl:py-2.5 text-sm xl:text-base font-medium rounded-lg xl:rounded-xl transition-all duration-200 relative z-10",
                        isActive
                          ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white shadow-lg border border-[#4EC6E5]/30"
                          : "text-slate-700 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] border-transparent hover:border-[#4EC6E5]/30 hover:shadow-lg"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Authenticated User Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Notifications */}
                <div className="relative hidden sm:block">
                  <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-[#F0FBFE] rounded-lg transition-all duration-200">
                    <BellIcon className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* User Menu - Desktop */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">
                        {user?.firstName}
                      </p>
                      <p className="text-xs text-slate-600 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>

                {/* Mobile User Menu Button */}
                <div className="lg:hidden">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Non-authenticated User Section */
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-[#4EC6E5] hover:text-[#2BA8CD] hover:bg-[#F0FBFE] rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] rounded-lg shadow-lg shadow-[#4EC6E5]/25 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
