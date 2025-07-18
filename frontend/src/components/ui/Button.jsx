import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Button = forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      loadingVariant = "spinner", // "spinner" | "dots" | "pulse"
      loadingText,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      // Primary - Turquoise Blue (main CTA)
      primary:
        "bg-cyan-400 hover:bg-cyan-500 text-white border border-transparent focus:ring-cyan-500 shadow-md hover:shadow-lg",

      // Navy - Deep Navy Blue (secondary CTA)
      navy: "text-white border border-transparent focus:ring-blue-500 shadow-md hover:shadow-lg",

      // Secondary - White with primary border
      secondary:
        "bg-white hover:bg-cyan-50 text-cyan-700 border border-cyan-500 focus:ring-cyan-500 shadow-sm hover:shadow-md",

      // Outline - Transparent with border
      outline:
        "bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-500 hover:border-gray-400",

      // Outline Primary - Transparent with cyan border
      "outline-primary":
        "bg-transparent hover:bg-cyan-50 text-cyan-600 border-2 border-cyan-500 focus:ring-cyan-500 hover:bg-cyan-500 hover:text-white",

      // Outline Navy - Transparent with navy border
      "outline-navy":
        "bg-transparent hover:text-white border-2 focus:ring-blue-500 hover:shadow-md",

      // Ghost - Minimal styling
      ghost:
        "bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent focus:ring-gray-500",

      // Success
      success:
        "bg-green-600 hover:bg-green-700 text-white border border-transparent focus:ring-green-500 shadow-md hover:shadow-lg",

      // Danger
      danger:
        "bg-red-600 hover:bg-red-700 text-white border border-transparent focus:ring-red-500 shadow-md hover:shadow-lg",

      // Warning
      warning:
        "bg-orange-500 hover:bg-orange-600 text-white border border-transparent focus:ring-orange-500 shadow-md hover:shadow-lg",

      // Link style
      link: "bg-transparent text-cyan-600 hover:text-cyan-700 underline hover:no-underline border border-transparent focus:ring-cyan-500 p-0",
    };

    const sizes = {
      xs: "px-2.5 py-1.5 text-xs font-medium",
      sm: "px-3 py-2 text-sm font-medium",
      md: "px-4 py-2.5 text-sm font-semibold",
      lg: "px-6 py-3 text-base font-semibold",
      xl: "px-8 py-4 text-lg font-semibold",
      "2xl": "px-10 py-5 text-xl font-bold",
    };

    const baseClasses =
      "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium";

    // Special handling for navy variant with CSS custom properties
    const getNavyStyles = () => {
      if (variant === "navy") {
        return {
          backgroundColor: "#1F2A44",
          borderColor: "#1F2A44",
        };
      }
      if (variant === "outline-navy") {
        return {
          color: "#1F2A44",
          borderColor: "#1F2A44",
          "--hover-bg": "#1F2A44",
        };
      }
      return {};
    };

    const buttonClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      {
        "cursor-not-allowed opacity-60": disabled || loading,
        "transform hover:scale-105 active:scale-95":
          !disabled &&
          !loading &&
          (variant === "primary" || variant === "navy"),
        "transform hover:-translate-y-0.5 active:translate-y-0":
          !disabled &&
          !loading &&
          (variant === "outline" ||
            variant === "outline-primary" ||
            variant === "outline-navy"),
      },
      className
    );

    const renderLoadingState = () => {
      switch (loadingVariant) {
        case "pulse":
          return (
            <div className="flex items-center">
              <div className="animate-pulse w-3 h-3 bg-current rounded-full mr-2"></div>
              {loadingText || children}
            </div>
          );
        case "dots":
          return (
            <div className="flex items-center">
              <div className="flex space-x-1 mr-2">
                <div
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              {loadingText || children}
            </div>
          );
        case "spinner":
        default:
          return (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {loadingText || children}
            </div>
          );
      }
    };

    return (
      <button
        className={buttonClasses}
        style={getNavyStyles()}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? renderLoadingState() : children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Button Group Component for related actions
export const ButtonGroup = ({
  children,
  className,
  orientation = "horizontal",
  ...props
}) => {
  const orientationClasses = {
    horizontal: "flex flex-row",
    vertical: "flex flex-col",
  };

  return (
    <div
      className={cn(
        orientationClasses[orientation],
        orientation === "horizontal" ? "space-x-2" : "space-y-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Icon Button Component for actions with icons only
export const IconButton = forwardRef(
  ({ children, size = "md", className, ...props }, ref) => {
    const iconSizes = {
      xs: "w-6 h-6 p-1",
      sm: "w-8 h-8 p-1.5",
      md: "w-10 h-10 p-2",
      lg: "w-12 h-12 p-2.5",
      xl: "w-14 h-14 p-3",
    };

    return (
      <Button
        ref={ref}
        className={cn("rounded-full", iconSizes[size], className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";

// Floating Action Button Component
export const FloatingActionButton = forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="primary"
        size="lg"
        className={cn(
          "fixed bottom-6 right-6 rounded-full shadow-2xl hover:shadow-3xl z-50 w-14 h-14 p-0",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";

// Loading Button Component with built-in loading state
export const LoadingButton = forwardRef(
  ({ loading, children, loadingText, ...props }, ref) => {
    return (
      <Button ref={ref} loading={loading} loadingText={loadingText} {...props}>
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default Button;
