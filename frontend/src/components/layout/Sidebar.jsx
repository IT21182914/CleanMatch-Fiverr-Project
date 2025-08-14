import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  LifebuoyIcon,
  SparklesIcon,
  UsersIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

const Sidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't render sidebar for non-authenticated users or on auth pages
  if (
    !isAuthenticated ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/"
  ) {
    return null;
  }

  const getNavigation = () => {
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
          name: "Support Tickets",
          href: "/customer/tickets",
          icon: LifebuoyIcon,
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
        { name: "Users", href: "/admin/users", icon: UsersIcon },
        {
          name: "Pending Freelancers",
          href: "/admin/freelancers/pending",
          icon: ClockIcon,
        },
        { name: "Bookings", href: "/admin/bookings", icon: CalendarIcon },
        { name: "Services", href: "/admin/services", icon: SparklesIcon },
        { name: "Reviews", href: "/admin/reviews", icon: StarIcon },
        { name: "Support Tickets", href: "/admin/tickets", icon: LifebuoyIcon },
        {
          name: "Memberships",
          href: "/admin/memberships",
          icon: CreditCardIcon,
        },
        { name: "Payments", href: "/admin/payments", icon: CurrencyDollarIcon },
        { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
      ];
    }

    return baseNav;
  };

  const navigation = getNavigation();

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case "customer":
        return "Customer";
      case "cleaner":
        return "Freelancer";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case "customer":
        return "from-blue-500 to-blue-600";
      case "cleaner":
        return "from-green-500 to-green-600";
      case "admin":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        {/* Sidebar component */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-3 pb-4">
          {/* Logo and Toggle */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <img
                  src="/Simorgh-Service-Logo.webp"
                  alt="Simorgh Service Logo"
                  className="h-20 w-20 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    SIMORGH
                  </span>
                  <span className="text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent">
                    SERVICE
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* User Info */}
          <div
            className={cn(
              "flex items-center px-3 py-2 rounded-lg bg-gradient-to-r shadow-sm",
              getRoleColor()
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
              <UserIcon className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <div className="ml-3 text-white">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs opacity-90">{getRoleDisplayName()}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.href ||
                      (item.href === "/dashboard" &&
                        location.pathname === "/dashboard");

                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-lg p-2 text-sm font-semibold leading-6 transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] shadow-md"
                              : "hover:bg-[#F0FBFE]",
                            item.highlight &&
                              !isActive &&
                              "ring-1 ring-[#4EC6E5]/20 bg-[#F0FBFE]/50"
                          )}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-[#2BA8CD]"
                            )}
                          />
                          {!isCollapsed && (
                            <span
                              className={cn(
                                "truncate",
                                isActive
                                  ? "text-white"
                                  : "bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 bg-clip-text text-transparent group-hover:text-[#2BA8CD]"
                              )}
                            >
                              {item.name}
                            </span>
                          )}
                          {!isCollapsed && item.highlight && !isActive && (
                            <div className="ml-auto flex-shrink-0">
                              <div className="w-2 h-2 bg-[#4EC6E5] rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col lg:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-3 pb-4">
          {/* Header with Close Button */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-lg flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  SIMORGH SERVICE
                </span>
                <span className="text-xs font-semibold bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] bg-clip-text text-transparent">
                  {getRoleDisplayName()} Panel
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div
            className={cn(
              "flex items-center px-3 py-2 rounded-lg bg-gradient-to-r shadow-sm",
              getRoleColor()
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="ml-3 text-white">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs opacity-90">{getRoleDisplayName()}</p>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.href ||
                      (item.href === "/dashboard" &&
                        location.pathname === "/dashboard");

                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-200 touch-manipulation min-h-[48px] items-center",
                            isActive
                              ? "bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] shadow-md"
                              : "hover:bg-[#F0FBFE]",
                            item.highlight &&
                              !isActive &&
                              "ring-1 ring-[#4EC6E5]/20 bg-[#F0FBFE]/50"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-[#2BA8CD]"
                            )}
                          />
                          <span
                            className={cn(
                              "truncate",
                              isActive
                                ? "text-white"
                                : "bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 bg-clip-text text-transparent group-hover:text-[#2BA8CD]"
                            )}
                          >
                            {item.name}
                          </span>
                          {item.highlight && !isActive && (
                            <div className="ml-auto flex-shrink-0">
                              <div className="w-2 h-2 bg-[#4EC6E5] rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
