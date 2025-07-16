import React, { Suspense } from "react";
import { LoadingCard, ModernPageLoader } from "../ui/Loading";
import LazyComponents from "../ui/LazyComponents";

/**
 * Route-level lazy loading wrapper
 */
export const LazyRoute = ({
  component: LazyComponent,
  fallback = "minimal",
  message = "Loading page...",
  ...props
}) => {
  return (
    <Suspense
      fallback={
        fallback === "overlay" ? (
          <ModernPageLoader message={message} />
        ) : fallback === "card" ? (
          <LoadingCard variant="detailed" />
        ) : (
          <ModernPageLoader message={message} />
        )
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Image lazy loading component
 */
export const LazyImage = ({
  src,
  alt,
  className = "",
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setError(true);
    onError();
  };

  return (
    <div ref={imgRef} className={`relative ${className}`} {...props}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          {placeholder || (
            <svg
              className="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <svg
              className="w-8 h-8 text-gray-400 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-gray-500">Failed to load</p>
          </div>
        </div>
      )}

      {inView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${
            loaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
