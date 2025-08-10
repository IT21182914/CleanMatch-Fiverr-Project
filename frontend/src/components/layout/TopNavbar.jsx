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

const TopNavbar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSidebarCollapsed = false,
}) => {
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

  // Determine if sidebar is active (same logic as Layout component)
  const isFullWidth =
    location.pathname === "/" ||
    location.pathname.includes("/auth/") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const sidebarActive = isAuthenticated && !isFullWidth;

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/60 sticky top-0 z-40 w-full">
      <div
        className={cn(
          "w-full transition-all duration-300 ease-in-out transform",
          sidebarActive ? (isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64") : ""
        )}
      >
        <div
          className={cn(
            "w-full transition-all duration-300",
            sidebarActive
              ? // When sidebar is active, remove almost all left padding to bring content extremely close to sidebar
                "px-0 xs:px-1 sm:px-1 md:px-1 lg:px-0"
              : // When no sidebar, use normal padding
                "px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8",
            sidebarActive
              ? isSidebarCollapsed
                ? // Collapsed sidebar: use more width, less centering constraints
                  "max-w-none lg:max-w-6xl xl:max-w-7xl 2xl:max-w-none mx-auto"
                : // Expanded sidebar: standard max width
                  "max-w-none lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
              : // No sidebar: original full width behavior
                "max-w-none xl:max-w-7xl xl:mx-auto"
          )}
        >
          <div className="flex h-14 xs:h-16 items-center justify-between">
            {/* Left section: Mobile menu + Logo */}
            <div className={cn(
              "flex items-center",
              sidebarActive ? "-ml-4 lg:-ml-8 space-x-0" : "space-x-3"
            )}>
              {/* Mobile menu button (only for authenticated users with sidebar) */}
              {isAuthenticated && !showPublicNav && (
                <div className="lg:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-[#F0FBFE] border border-transparent hover:border-[#BAEDFB] transition-all duration-200 touch-manipulation"
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Toggle navigation menu"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                </div>
              )}

              {/* Logo - Responsive design */}
              <Link
                to={isAuthenticated && !showPublicNav ? "/dashboard" : "/"}
                className={cn(
                  "flex items-center hover:opacity-80 transition-all duration-500 ease-in-out transform",
                  sidebarActive ? "space-x-8" : "space-x-2"
                )}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-lg flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-4 w-4 text-white" />
                </div>
                {/* Show full text only on public pages or larger screens */}
                {showPublicNav ? (
                  <div className="flex flex-col">
                    <span className="text-base xs:text-lg sm:text-xl font-bold font-mono tracking-wide bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      SIMORGH SERVICE
                    </span>
                    <span className="text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent hidden xs:block">
                      SOLUTION FOR YOUR COMPANY
                    </span>
                  </div>
                ) : (
                  /* Dashboard logo showing full service name */
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-base sm:text-lg lg:text-xl font-bold font-mono tracking-wide bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent",
                      sidebarActive ? "-ml-3 lg:-ml-6" : ""
                    )}>
                      SIMORGH SERVICE
                    </span>
                  </div>
                )}
              </Link>
            </div>

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
      </div>
    </nav>
  );
};

export default TopNavbar;
