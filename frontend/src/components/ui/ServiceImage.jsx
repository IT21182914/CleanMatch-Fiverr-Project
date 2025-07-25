import React from "react";
import LazyImage from "./LazyImage";

const ServiceImage = ({
  serviceName,
  src,
  className = "",
  showBadges = true,
  service = {},
  ...props
}) => {
  return (
    <div className="relative">
      <LazyImage
        src={src}
        alt={serviceName}
        className={`transition-all duration-300 group-hover:scale-110 ${className}`}
        aspectRatio="w-full h-48"
        fallbackSrc="/services/1/House & Apartment Cleaning.png"
        enableFadeTransition={true}
        {...props}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Service badges overlay */}
      {showBadges && (
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {service.popular && (
            <div className="flex items-center bg-amber-500/90 backdrop-blur-sm rounded-full px-2 py-1">
              <svg
                className="h-3 w-3 text-white mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-white">Popular</span>
            </div>
          )}
          {service.premium && (
            <div className="flex items-center bg-amber-500/90 backdrop-blur-sm rounded-full px-2 py-1">
              <svg
                className="h-3 w-3 text-white mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-white">Premium</span>
            </div>
          )}
          {service.emergency && (
            <div className="flex items-center bg-red-500/90 backdrop-blur-sm rounded-full px-2 py-1">
              <svg
                className="h-3 w-3 text-white mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-xs font-semibold text-white">
                24/7 Emergency
              </span>
            </div>
          )}
        </div>
      )}

      {/* Navigation arrow */}
      <div className="absolute top-3 right-3">
        <svg
          className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 drop-shadow-lg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
};

export default ServiceImage;
