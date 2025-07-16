import { Card, CardContent } from "./Card";

// Simple Golden Spinner
export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-amber-200 border-t-amber-500 ${sizes[size]} ${className}`}
    />
  );
};

// Golden Pulse Loader
export const PulseLoader = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizes[size]} bg-amber-500 rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.4s",
          }}
        />
      ))}
    </div>
  );
};

// Modern Dots Loader
// Golden Dots Loader
export const DotsLoader = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizes[size]} bg-amber-500 rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
};

// Wave Loader
export const WaveLoader = ({ size = "md", color = "blue", className = "" }) => {
  const sizes = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
  };

  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
  };

  return (
    <div className={`flex items-end space-x-0.5 ${sizes[size]} ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 ${colors[color]} rounded-t-sm wave-animation`}
          style={{
            height: "20%",
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1.2s",
          }}
        />
      ))}
    </div>
  );
};

// Skeleton loading components with modern animations
export const SkeletonLine = ({
  width = "full",
  height = "4",
  className = "",
}) => {
  const widths = {
    "1/4": "w-1/4",
    "1/3": "w-1/3",
    "1/2": "w-1/2",
    "2/3": "w-2/3",
    "3/4": "w-3/4",
    full: "w-full",
  };

  const heights = {
    3: "h-3",
    4: "h-4",
    5: "h-5",
    6: "h-6",
    8: "h-8",
  };

  return (
    <div
      className={`${widths[width]} ${heights[height]} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] ${className}`}
    />
  );
};

export const SkeletonCircle = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] ${className}`}
    />
  );
};

// Enhanced Loading Card with modern skeleton
export const LoadingCard = ({ variant = "default" }) => {
  if (variant === "profile") {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <SkeletonCircle size="lg" />
              <div className="flex-1 space-y-3">
                <SkeletonLine width="3/4" height="5" />
                <SkeletonLine width="1/2" height="4" />
              </div>
            </div>
            <div className="space-y-3">
              <SkeletonLine width="full" height="4" />
              <SkeletonLine width="5/6" height="4" />
              <SkeletonLine width="2/3" height="4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "booking") {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SkeletonCircle size="md" />
                <div className="space-y-2">
                  <SkeletonLine width="1/3" height="4" />
                  <SkeletonLine width="1/4" height="3" />
                </div>
              </div>
              <SkeletonLine width="1/4" height="6" />
            </div>
            <SkeletonLine width="full" height="4" />
            <div className="flex justify-between items-center">
              <SkeletonLine width="1/3" height="4" />
              <SkeletonLine width="1/4" height="4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default card
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <SkeletonCircle />
            <div className="flex-1 space-y-2">
              <SkeletonLine width="3/4" height="4" />
              <SkeletonLine width="1/2" height="3" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonLine width="full" height="3" />
            <SkeletonLine width="5/6" height="3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading Grid for multiple cards
export const LoadingGrid = ({
  count = 6,
  variant = "default",
  cols = { sm: 1, md: 2, lg: 3 },
}) => {
  const gridClasses = `grid grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} gap-4 sm:gap-6`;

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} variant={variant} />
      ))}
    </div>
  );
};

// Loading table rows with modern skeleton
export const LoadingTableRow = ({ columns = 4 }) => (
  <tr>
    {[...Array(columns)].map((_, index) => (
      <td key={index} className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <SkeletonLine width={index === 0 ? "3/4" : "1/2"} height="4" />
      </td>
    ))}
  </tr>
);

// Modern Loading list items
export const LoadingListItem = ({ variant = "default" }) => {
  if (variant === "user") {
    return (
      <li className="py-3 sm:py-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <SkeletonCircle size="md" />
          <div className="flex-1 space-y-2">
            <SkeletonLine width="1/3" height="4" />
            <SkeletonLine width="1/2" height="3" />
          </div>
          <SkeletonLine width="1/4" height="6" />
        </div>
      </li>
    );
  }

  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <SkeletonCircle />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="1/4" height="4" />
          <SkeletonLine width="1/2" height="3" />
        </div>
        <SkeletonLine width="1/6" height="6" />
      </div>
    </li>
  );
};

// Enhanced Full page loading with modern design
export const LoadingPage = ({
  message = "Loading...",
  submessage = "Please wait while we prepare your content.",
  variant = "spinner",
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="text-center max-w-md w-full">
      <div className="mb-6">
        {variant === "spinner" && <Spinner size="xl" className="mx-auto" />}
        {variant === "pulse" && (
          <PulseLoader size="lg" className="justify-center" />
        )}
        {variant === "dots" && (
          <DotsLoader size="lg" className="justify-center" />
        )}
        {variant === "wave" && (
          <WaveLoader size="lg" className="justify-center h-12" />
        )}
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
        {message}
      </h2>
      <p className="text-sm sm:text-base text-gray-500">{submessage}</p>
    </div>
  </div>
);

// Modern Loading overlay
export const LoadingOverlay = ({
  message = "Loading...",
  variant = "spinner",
  blur = true,
}) => (
  <div
    className={`fixed inset-0 bg-black/30 flex items-center justify-center z-50 ${
      blur ? "backdrop-blur-sm" : ""
    }`}
  >
    <div className="bg-white rounded-xl p-6 sm:p-8 max-w-sm w-full mx-4 shadow-2xl">
      <div className="text-center">
        <div className="mb-4">
          {variant === "spinner" && (
            <Spinner size="lg" variant="primary" className="mx-auto" />
          )}
          {variant === "pulse" && (
            <PulseLoader size="lg" className="justify-center" />
          )}
          {variant === "dots" && (
            <DotsLoader size="lg" className="justify-center" />
          )}
        </div>
        <p className="text-gray-900 font-medium text-sm sm:text-base">
          {message}
        </p>
      </div>
    </div>
  </div>
);

// Enhanced Button loading state
export const ButtonLoading = ({ variant = "spinner", size = "sm" }) => {
  if (variant === "dots") {
    return <DotsLoader size={size} className="-ml-1 mr-2" />;
  }

  if (variant === "pulse") {
    return <PulseLoader size={size} className="-ml-1 mr-2" />;
  }

  // Default golden spinner
  return (
    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-amber-200 border-t-amber-500 rounded-full"></div>
  );
};

// Loading Search Results
export const LoadingSearchResults = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="border rounded-lg p-4 space-y-3">
        <SkeletonLine width="3/4" height="5" />
        <SkeletonLine width="full" height="4" />
        <SkeletonLine width="2/3" height="4" />
        <div className="flex space-x-4 mt-3">
          <SkeletonLine width="1/4" height="6" />
          <SkeletonLine width="1/4" height="6" />
        </div>
      </div>
    ))}
  </div>
);

// Loading Stats Cards
export const LoadingStatsCard = () => (
  <Card>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <SkeletonCircle size="md" />
        </div>
        <div className="ml-3 sm:ml-5 w-0 flex-1">
          <SkeletonLine width="1/2" height="3" className="mb-2" />
          <SkeletonLine width="1/3" height="5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Modern Page Loader with Golden Yellow
export const ModernPageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          {/* Main spinner */}
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
          {/* Counter-rotating inner ring */}
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-amber-400 rounded-full animate-spin mx-auto"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
          {/* Pulsing center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">{message}</h3>

          {/* Bouncing dots */}
          <div className="flex justify-center space-x-1">
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-amber-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  Spinner,
  PulseLoader,
  DotsLoader,
  WaveLoader,
  SkeletonLine,
  SkeletonCircle,
  LoadingCard,
  LoadingGrid,
  LoadingTableRow,
  LoadingListItem,
  LoadingPage,
  LoadingOverlay,
  ButtonLoading,
  LoadingSearchResults,
  LoadingStatsCard,
  ModernPageLoader,
};
