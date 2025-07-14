import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Button = forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white border border-transparent focus:ring-blue-500",
      secondary:
        "bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 focus:ring-blue-500",
      outline:
        "bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-500",
      danger:
        "bg-red-600 hover:bg-red-700 text-white border border-transparent focus:ring-red-500",
      success:
        "bg-green-600 hover:bg-green-700 text-white border border-transparent focus:ring-green-500",
      ghost:
        "bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent focus:ring-gray-500",
      warning:
        "bg-yellow-600 hover:bg-yellow-700 text-white border border-transparent focus:ring-yellow-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const buttonClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      {
        "cursor-not-allowed opacity-50": disabled || loading,
      },
      className
    );

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
