import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import {
  SparklesIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

const Layout = ({ children }) => {
  const location = useLocation();

  // Determine if this is the home page
  const isHomePage = location.pathname === "/";

  // Determine if this should have a full-width layout (like home page)
  const isFullWidth =
    isHomePage ||
    location.pathname.includes("/auth/") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content Area - Enhanced Responsive */}
      <main
        className={
          isFullWidth
            ? "w-full"
            : "w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto"
        }
      >
        <div
          className={`w-full overflow-x-hidden ${
            !isFullWidth ? "py-3 xs:py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12" : ""
          }`}
        >
          {children}
        </div>
      </main>

      {/* Modern Footer - Enhanced Responsive (Original Design) */}
      {(isHomePage || location.pathname.includes("/book")) && (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-12 xs:mt-16 sm:mt-20 relative overflow-hidden">
          {/* Background Elements - Responsive */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-[#4EC6E5]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-[#2BA8CD]/10 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="relative w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto py-8 xs:py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 sm:gap-10">
              {/* Company Info - Enhanced Responsive */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2 xs:space-x-3 mb-4 xs:mb-6">
                  <div className="relative">
                    <img
                      src="/Simorgh-Service-Logo.webp"
                      alt="Simorgh Service Logo"
                      className="logo-image h-8 xs:h-10 sm:h-12 w-auto object-contain filter brightness-0 invert hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                </div>
                <p className="text-slate-300 text-sm xs:text-base sm:text-lg mb-4 xs:mb-6 leading-relaxed">
                  Become your own boss, choose your own schedule, and work in
                  your preferred areas with our professional cleaning platform.
                </p>

                {/* Social Links - Enhanced Responsive */}
                <div className="grid grid-cols-4 xs:flex xs:flex-wrap gap-2 xs:gap-3 sm:gap-4">
                  {[
                    {
                      name: "Twitter",
                      href: "#",
                      icon: (
                        <svg
                          className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      ),
                    },
                    {
                      name: "Facebook",
                      href: "#",
                      icon: (
                        <svg
                          className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                    },
                    {
                      name: "Instagram",
                      href: "#",
                      icon: (
                        <svg
                          className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.957 1.404-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                        </svg>
                      ),
                    },
                    {
                      name: "LinkedIn",
                      href: "#",
                      icon: (
                        <svg
                          className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      ),
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-slate-400 hover:text-[#4EC6E5] hover:bg-[#4EC6E5]/10 hover:border-[#4EC6E5]/30 transition-all duration-300 hover:scale-110 flex items-center justify-center min-h-[40px] xs:min-h-[44px] touch-manipulation"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Services - Enhanced Responsive */}
              <div className="sm:col-span-1 lg:col-span-1">
                <h3 className="text-lg xs:text-xl font-bold text-white mb-4 xs:mb-6 relative">
                  <span className="relative z-10">Services</span>
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD]"></div>
                </h3>
                <ul className="space-y-3 xs:space-y-4">
                  {[
                    "House Cleaning",
                    "Deep Cleaning",
                    "Office Cleaning",
                    "Move-in/out Cleaning",
                    "Post-construction",
                    "Membership",
                  ].map((service) => (
                    <li key={service}>
                      <a
                        href="#"
                        className="text-slate-300 hover:text-[#4EC6E5] transition-all duration-200 flex items-center group text-sm xs:text-base min-h-[44px] py-1 touch-manipulation"
                      >
                        <div className="w-1.5 h-1.5 bg-[#4EC6E5] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <span className="truncate">{service}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company - Enhanced Responsive */}
              <div className="sm:col-span-1 lg:col-span-1">
                <h3 className="text-lg xs:text-xl font-bold text-white mb-4 xs:mb-6 relative">
                  <span className="relative z-10">Company</span>
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD]"></div>
                </h3>
                <ul className="space-y-3 xs:space-y-4">
                  {[
                    "About Us",
                    "How It Works",
                    "Careers",
                    "Become a Cleaner",
                    "Press",
                    "Blog",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-300 hover:text-[#4EC6E5] transition-all duration-200 flex items-center group text-sm xs:text-base min-h-[44px] py-1 touch-manipulation"
                      >
                        <div className="w-1.5 h-1.5 bg-[#4EC6E5] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <span className="truncate">{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support & Contact - Enhanced Responsive */}
              <div className="sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg xs:text-xl font-bold text-white mb-4 xs:mb-6 relative">
                  <span className="relative z-10">Support</span>
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD]"></div>
                </h3>
                <ul className="space-y-3 xs:space-y-4 mb-6 xs:mb-8">
                  {[
                    "Help Center",
                    "Contact Us",
                    "Safety",
                    "Trust & Safety",
                    "Terms of Service",
                    "Privacy Policy",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-300 hover:text-[#4EC6E5] transition-all duration-200 flex items-center group text-sm xs:text-base min-h-[44px] py-1 touch-manipulation"
                      >
                        <div className="w-1.5 h-1.5 bg-[#4EC6E5] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <span className="truncate">{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Contact Info - Enhanced Responsive */}
                <div className="p-3 xs:p-4 sm:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl xs:rounded-2xl">
                  <h4 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg">
                    Get in Touch
                  </h4>
                  <div className="space-y-3 xs:space-y-4">
                    <div className="flex items-center group">
                      <div className="p-1.5 xs:p-2 rounded-lg bg-[#4EC6E5]/20 mr-2 xs:mr-3 group-hover:bg-[#4EC6E5]/30 transition-colors duration-200 flex-shrink-0">
                        <EnvelopeIcon className="h-3 w-3 xs:h-4 xs:w-4 text-[#4EC6E5]" />
                      </div>
                      <span className="text-slate-300 text-xs xs:text-sm break-all">
                        support@simorghservice.com
                      </span>
                    </div>
                    <div className="flex items-center group">
                      <div className="p-1.5 xs:p-2 rounded-lg bg-[#4EC6E5]/20 mr-2 xs:mr-3 group-hover:bg-[#4EC6E5]/30 transition-colors duration-200 flex-shrink-0">
                        <PhoneIcon className="h-3 w-3 xs:h-4 xs:w-4 text-[#4EC6E5]" />
                      </div>
                      <span className="text-slate-300 text-xs xs:text-sm">
                        (555) 123-CLEAN
                      </span>
                    </div>
                    <div className="flex items-start group">
                      <div className="p-1.5 xs:p-2 rounded-lg bg-[#4EC6E5]/20 mr-2 xs:mr-3 mt-0.5 group-hover:bg-[#4EC6E5]/30 transition-colors duration-200 flex-shrink-0">
                        <MapPinIcon className="h-3 w-3 xs:h-4 xs:w-4 text-[#4EC6E5]" />
                      </div>
                      <div className="text-slate-300 text-xs xs:text-sm">
                        123 Main Street
                        <br />
                        San Francisco, CA 94102
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Enhanced Responsive */}
            <div className="mt-12 xs:mt-16 pt-6 xs:pt-8 border-t border-white/10">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4 xs:gap-6">
                <div className="text-slate-400 text-sm xs:text-base lg:text-lg mb-4 lg:mb-0 order-2 lg:order-1">
                  © 2025 SIMORGH SERVICE. All rights reserved.
                </div>

                {/* Trust Badges - Enhanced Responsive */}
                <div className="flex flex-col xs:flex-row flex-wrap items-center justify-center gap-3 xs:gap-4 lg:gap-6 order-1 lg:order-2 w-full lg:w-auto">
                  {[
                    {
                      icon: ShieldCheckIcon,
                      text: "SSL Secured",
                      color: "text-green-400",
                    },
                    {
                      icon: CheckBadgeIcon,
                      text: "Insured & Bonded",
                      color: "text-[#4EC6E5]",
                    },
                    {
                      icon: StarIcon,
                      text: "Background Checked",
                      color: "text-yellow-400",
                    },
                  ].map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center px-3 xs:px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg xs:rounded-xl hover:bg-white/10 transition-all duration-300 min-w-0 touch-manipulation min-h-[44px]"
                      >
                        <Icon
                          className={`h-4 w-4 xs:h-5 xs:w-5 mr-2 ${badge.color} flex-shrink-0`}
                        />
                        <span className="text-slate-300 text-xs xs:text-sm font-medium whitespace-nowrap">
                          {badge.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Trust Elements - Enhanced Responsive */}
              <div className="mt-6 xs:mt-8 pt-4 xs:pt-6 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-center">
                  <div className="flex items-center text-slate-400">
                    <div className="w-2 h-2 bg-[#4EC6E5] rounded-full mr-2 xs:mr-3 animate-pulse flex-shrink-0"></div>
                    <span className="text-xs xs:text-sm">Available 24/7</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 xs:mr-3 animate-pulse flex-shrink-0"></div>
                    <span className="text-xs xs:text-sm">
                      99.9% Customer Satisfaction
                    </span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 xs:mr-3 animate-pulse flex-shrink-0"></div>
                    <span className="text-xs xs:text-sm">
                      Eco-Friendly Products
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Custom Styles for Full Responsiveness */}
          <style jsx>{`
            /* Touch-friendly design */
            @media (max-width: 768px) {
              a,
              button {
                min-height: 44px;
                touch-action: manipulation;
              }
            }

            /* Ultra-small screens */
            @media (max-width: 319px) {
              .text-xs {
                font-size: 0.7rem;
              }
              .text-sm {
                font-size: 0.8rem;
              }
              .text-base {
                font-size: 0.85rem;
              }
              .text-lg {
                font-size: 0.9rem;
              }
              .text-xl {
                font-size: 1rem;
              }
            }

            /* Small device grid optimization */
            @media (min-width: 320px) and (max-width: 475px) {
              .grid-cols-4 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }

            /* Landscape orientation on mobile */
            @media screen and (max-height: 500px) and (orientation: landscape) {
              .py-8 {
                padding-top: 1rem;
                padding-bottom: 1rem;
              }
              .py-12 {
                padding-top: 1.5rem;
                padding-bottom: 1.5rem;
              }
              .py-16 {
                padding-top: 2rem;
                padding-bottom: 2rem;
              }
              .py-20 {
                padding-top: 2.5rem;
                padding-bottom: 2.5rem;
              }
            }

            /* Accessibility improvements */
            @media (prefers-reduced-motion: reduce) {
              * {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
              }
              .animate-pulse {
                animation: none;
              }
            }

            a:focus,
            button:focus {
              outline: 2px solid #4ec6e5;
              outline-offset: 2px;
            }

            /* High DPI displays */
            @media (-webkit-min-device-pixel-ratio: 2) {
              .blur-3xl {
                backdrop-filter: blur(48px);
              }
              .backdrop-blur-sm {
                backdrop-filter: blur(4px);
              }
            }

            /* iOS scroll fix */
            body {
              -webkit-overflow-scrolling: touch;
            }

            /* Viewport units fix for mobile browsers */
            .min-h-screen {
              min-height: 100vh;
              min-height: -webkit-fill-available;
            }

            /* Better word breaking */
            .break-all {
              word-break: break-all;
              overflow-wrap: break-word;
            }

            .truncate {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          `}</style>
        </footer>
      )}
    </div>
  );
};

export default Layout;
