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
  XMarkIcon,
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

  // Public navigation for non-authenticated users
  const publicNavigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Services", href: "/services", icon: SparklesIcon },
    {
      name: "About us",
      href: "/about",
      icon: ClipboardDocumentListIcon,
    },
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
    <>
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
                ? isSidebarCollapsed
                  ? // Collapsed sidebar: adequate padding to ensure logo visibility
                    "px-2 xs:px-3 sm:px-4 md:px-5 lg:px-4"
                  : // Expanded sidebar: minimal padding to get close to sidebar
                    "px-1 xs:px-1 sm:px-2 md:px-2 lg:px-1"
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
            <div className="flex h-12 xs:h-14 sm:h-16 lg:h-18 xl:h-20 items-center justify-between">
              {/* Left section: Mobile menu + Logo */}
              <div
                className={cn(
                  "flex items-center flex-shrink-0",
                  sidebarActive
                    ? isSidebarCollapsed
                      ? // Collapsed sidebar: safe positioning with proper spacing
                        "ml-0 space-x-2 sm:space-x-4 lg:space-x-6"
                      : // Expanded sidebar: closer positioning
                        "-ml-1 sm:-ml-2 lg:-ml-4 space-x-1 sm:space-x-2"
                    : // No sidebar: normal spacing
                      "space-x-2 sm:space-x-3"
                )}
              >
                {/* Mobile menu button (only for authenticated users with sidebar OR public nav on mobile) */}
                {((isAuthenticated && !showPublicNav) ||
                  (showPublicNav && !isAuthenticated)) && (
                  <div className="lg:hidden">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-[#F0FBFE] border border-transparent hover:border-[#BAEDFB] transition-all duration-200 touch-manipulation"
                      aria-expanded={isMobileMenuOpen}
                      aria-label="Toggle navigation menu"
                    >
                      {isMobileMenuOpen ? (
                        <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      ) : (
                        <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                    </button>
                  </div>
                )}

                {/* Logo - Fully responsive */}
                <Link
                  to={isAuthenticated && !showPublicNav ? "/dashboard" : "/"}
                  className={cn(
                    "flex items-center hover:opacity-80 transition-all duration-500 ease-in-out transform flex-shrink-0",
                    sidebarActive
                      ? "space-x-2 sm:space-x-4 lg:space-x-8"
                      : "space-x-1 sm:space-x-2"
                  )}
                >
                  <img
                    src="/Simorgh-Service-Logo.webp"
                    alt="Simorgh Service Logo"
                    className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 2xl:h-28 2xl:w-28 object-contain"
                  />
                  {/* Responsive text - show different versions based on screen size and context */}
                  <div className="flex flex-col justify-center min-w-0">
                    {/* Mobile version - very compact (only show SIMORGH on very small screens) */}
                    <div className="block sm:hidden">
                      <span className="text-xs xs:text-sm font-black font-serif tracking-wider uppercase bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 bg-clip-text text-transparent drop-shadow-lg transform hover:scale-105 transition-transform duration-300 relative leading-tight">
                        SIMORGH
                        <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] opacity-80"></span>
                      </span>
                      <span className="text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent leading-tight hidden xs:block">
                        SERVICE
                      </span>
                    </div>

                    {/* Desktop/Tablet and up - Full text */}
                    {showPublicNav ? (
                      <div className="hidden sm:flex sm:flex-col mt-2">
                        <span className="text-base xs:text-lg sm:text-xl font-black font-serif tracking-[0.2em] uppercase bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 bg-clip-text text-transparent drop-shadow-lg transform hover:scale-105 transition-transform duration-300 relative">
                          SIMORGH SERVICE
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] opacity-80"></span>
                        </span>
                        <span className="text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent hidden xs:block">
                          SOLUTION FOR YOUR COMPANY
                        </span>
                      </div>
                    ) : (
                      /* Dashboard logo showing full service name */
                      <div className="hidden sm:flex sm:flex-col mt-2">
                        <span
                          className={cn(
                            "text-base sm:text-lg lg:text-xl font-black font-serif tracking-[0.2em] uppercase bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 bg-clip-text text-transparent drop-shadow-lg transform hover:scale-105 transition-transform duration-300 relative",
                            sidebarActive ? "-ml-3 lg:-ml-6" : ""
                          )}
                        >
                          SIMORGH SERVICE
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] opacity-80"></span>
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {/* Public Navigation (Desktop) - Only show for public pages */}
              {showPublicNav && (
                <div className="hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-4">
                  {publicNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.href && !item.external;

                    const linkContent = (
                      <>
                        <Icon className="h-4 w-4 mr-2" />
                        <span
                          className={cn(
                            "truncate",
                            isActive
                              ? "text-white"
                              : "bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 bg-clip-text text-transparent hover:text-white"
                          )}
                        >
                          {item.name}
                        </span>
                      </>
                    );

                    const className = cn(
                      "inline-flex items-center px-3 xl:px-4 py-2 xl:py-2.5 text-sm xl:text-base font-medium rounded-lg xl:rounded-xl transition-all duration-200 relative z-10",
                      isActive
                        ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] shadow-lg border border-[#4EC6E5]/30"
                        : "bg-white/50 hover:bg-gradient-to-r hover:from-[#4EC6E5] hover:to-[#2BA8CD] border-transparent hover:border-[#4EC6E5]/30 hover:shadow-lg"
                    );

                    return (
                      <div key={item.name} className="flex items-center">
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={className}
                          >
                            {linkContent}
                          </a>
                        ) : (
                          <Link to={item.href} className={className}>
                            {linkContent}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Right Section */}
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
                {/* Authenticated User Section */}
                {isAuthenticated ? (
                  <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                      <button className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-[#F0FBFE] rounded-lg transition-all duration-200">
                        <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        {notifications.length > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {notifications.length > 9
                              ? "9+"
                              : notifications.length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* User Menu - Desktop */}
                    <div className="hidden lg:flex items-center space-x-3">
                      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-white" />
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

                    {/* Mobile User Menu - Dropdown */}
                    <div className="relative lg:hidden">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="inline-flex items-center p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-[#F0FBFE] rounded-lg transition-all duration-200"
                      >
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-full flex items-center justify-center">
                          <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                      </button>

                      {/* Mobile User Dropdown */}
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                          <div className="px-4 py-2 border-b border-slate-200">
                            <p className="text-sm font-medium text-slate-900">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-slate-600 capitalize">
                              {user?.role}
                            </p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center"
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Non-authenticated User Section */
                  <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#4EC6E5] hover:text-[#2BA8CD] hover:bg-[#F0FBFE] rounded-lg transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] rounded-lg shadow-lg shadow-[#4EC6E5]/25 transition-all duration-200"
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

      {/* Mobile Menu Overlay - Public Navigation */}
      {isMobileMenuOpen && showPublicNav && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-64 sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
              <img
                src="/Simorgh-Service-Logo.webp"
                alt="Simorgh Service Logo"
                className="h-10 w-10 object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="px-4 py-6 space-y-2">
              {publicNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] text-white shadow-lg"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile auth buttons in menu */}
            {!isAuthenticated && (
              <div className="border-t border-slate-200 px-4 py-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-[#4EC6E5] hover:text-[#2BA8CD] hover:bg-[#F0FBFE] rounded-lg border border-[#4EC6E5] transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] rounded-lg shadow-lg shadow-[#4EC6E5]/25 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default TopNavbar;
