import React, { useState, useRef, useCallback } from "react";
import { useLazyImage } from "../../hooks/useLazyLoading";
import ImageSkeleton from "./ImageSkeleton";

const LazyImage = ({
  src,
  alt,
  className = "",
  skeletonClassName = "",
  fallbackSrc = "/services/1/House & Apartment Cleaning.png",
  aspectRatio = "aspect-[4/3]",
  onLoad,
  onError,
  enableFadeTransition = true,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);

  const { imgRef, isLoaded, shouldLoad, error, handleLoad, handleError } =
    useLazyImage(src, {
      threshold: 0.1,
      rootMargin: "100px", // Load images 100px before they come into view
    });

  const handleImageLoad = useCallback(
    (e) => {
      handleLoad();
      if (onLoad) onLoad(e);
    },
    [handleLoad, onLoad]
  );

  const handleImageError = useCallback(
    (e) => {
      handleError();
      setHasError(true);
      // Set fallback image
      if (e.target.src !== fallbackSrc) {
        e.target.src = fallbackSrc;
      }
      if (onError) onError(e);
    },
    [handleError, fallbackSrc, onError]
  );

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${aspectRatio}`}>
      {/* Skeleton Loader - shown while loading */}
      {!isLoaded && shouldLoad && (
        <ImageSkeleton
          className={`absolute inset-0 z-10 ${skeletonClassName}`}
          aspectRatio="w-full h-full"
        />
      )}

      {/* Actual Image */}
      {shouldLoad && (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${
            enableFadeTransition
              ? `transition-opacity duration-500 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`
              : ""
          } ${className}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy" // Native lazy loading as fallback
          decoding="async" // Improves perceived performance
          {...props}
        />
      )}

      {/* Error State - Show when image fails to load and fallback also fails */}
      {error && hasError && shouldLoad && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center z-20">
          <div className="text-center text-slate-500">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
