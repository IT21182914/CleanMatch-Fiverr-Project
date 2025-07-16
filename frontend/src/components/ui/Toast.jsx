import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
  CreditCardIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";

const Toast = ({
  type = "info",
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  persistent = false,
  action = null,
  variant = "default", // "default" | "modern" | "minimal" | "branded"
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoClose && !persistent) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose, persistent]);

  const icons = {
    success: CheckCircleIcon,
    error: ExclamationTriangleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    loading: ArrowPathIcon,
    booking: CalendarDaysIcon,
    payment: CreditCardIcon,
    service: SparklesIcon,
  };

  const colorSchemes = {
    default: {
      success:
        "bg-green-50 border-green-200 text-green-800 shadow-green-100/50",
      error: "bg-red-50 border-red-200 text-red-800 shadow-red-100/50",
      warning:
        "bg-yellow-50 border-yellow-200 text-yellow-800 shadow-yellow-100/50",
      info: "bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100/50",
      loading: "bg-gray-50 border-gray-200 text-gray-800 shadow-gray-100/50",
      booking:
        "bg-purple-50 border-purple-200 text-purple-800 shadow-purple-100/50",
      payment:
        "bg-green-50 border-green-200 text-green-800 shadow-green-100/50",
      service:
        "bg-yellow-50 border-yellow-200 text-yellow-800 shadow-yellow-100/50",
    },
    modern: {
      success: "bg-white border-l-4 border-l-green-500 text-gray-800 shadow-xl",
      error: "bg-white border-l-4 border-l-red-500 text-gray-800 shadow-xl",
      warning:
        "bg-white border-l-4 border-l-yellow-500 text-gray-800 shadow-xl",
      info: "bg-white border-l-4 border-l-blue-500 text-gray-800 shadow-xl",
      loading: "bg-white border-l-4 border-l-gray-400 text-gray-800 shadow-xl",
      booking:
        "bg-white border-l-4 border-l-purple-500 text-gray-800 shadow-xl",
      payment: "bg-white border-l-4 border-l-green-500 text-gray-800 shadow-xl",
      service:
        "bg-white border-l-4 border-l-yellow-500 text-gray-800 shadow-xl",
    },
    minimal: {
      success: "bg-white border border-gray-200 text-gray-800 shadow-lg",
      error: "bg-white border border-gray-200 text-gray-800 shadow-lg",
      warning: "bg-white border border-gray-200 text-gray-800 shadow-lg",
      info: "bg-white border border-gray-200 text-gray-800 shadow-lg",
      loading: "bg-white border border-gray-200 text-gray-800 shadow-lg",
      booking: "bg-white border border-gray-200 text-gray-800 shadow-lg",
      payment: "bg-white border border-gray-200 text-gray-800 shadow-lg",
      service: "bg-white border border-gray-200 text-gray-800 shadow-lg",
    },
    branded: {
      success:
        "bg-white border border-green-200 text-gray-800 shadow-lg ring-1 ring-green-500/20",
      error:
        "bg-white border border-red-200 text-gray-800 shadow-lg ring-1 ring-red-500/20",
      warning:
        "bg-white border border-yellow-200 text-gray-800 shadow-lg ring-1 ring-yellow-500/20",
      info: "bg-white border border-blue-200 text-gray-800 shadow-lg ring-1 ring-blue-500/20",
      loading:
        "bg-white border border-gray-200 text-gray-800 shadow-lg ring-1 ring-gray-400/20",
      booking:
        "bg-white border border-purple-200 text-gray-800 shadow-lg ring-1 ring-purple-500/20",
      payment:
        "bg-white border border-green-200 text-gray-800 shadow-lg ring-1 ring-green-500/20",
      service:
        "bg-yellow-50 border border-yellow-200 text-gray-800 shadow-lg ring-1 ring-yellow-500/20",
    },
  };

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
    loading: "text-gray-400 animate-spin",
    booking: "text-purple-500",
    payment: "text-green-500",
    service: "text-yellow-500",
  };

  const animations = {
    "top-right": {
      enter: "translate-x-0 opacity-100 scale-100",
      exit: "translate-x-full opacity-0 scale-95",
      initial: "translate-x-full opacity-0 scale-95",
    },
    "top-left": {
      enter: "translate-x-0 opacity-100 scale-100",
      exit: "-translate-x-full opacity-0 scale-95",
      initial: "-translate-x-full opacity-0 scale-95",
    },
    "bottom-right": {
      enter: "translate-x-0 opacity-100 scale-100",
      exit: "translate-x-full opacity-0 scale-95",
      initial: "translate-x-full opacity-0 scale-95",
    },
    "bottom-left": {
      enter: "translate-x-0 opacity-100 scale-100",
      exit: "-translate-x-full opacity-0 scale-95",
      initial: "-translate-x-full opacity-0 scale-95",
    },
    "top-center": {
      enter: "translate-y-0 opacity-100 scale-100",
      exit: "-translate-y-full opacity-0 scale-95",
      initial: "-translate-y-full opacity-0 scale-95",
    },
    "bottom-center": {
      enter: "translate-y-0 opacity-100 scale-100",
      exit: "translate-y-full opacity-0 scale-95",
      initial: "translate-y-full opacity-0 scale-95",
    },
  };

  const Icon = icons[type];
  const colors = colorSchemes[variant];
  const animation = animations[position];

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getAnimationClass = () => {
    if (isExiting) return animation.exit;
    if (isVisible) return animation.enter;
    return animation.initial;
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "max-w-xs sm:max-w-sm w-full rounded-lg shadow-lg transition-all duration-300 ease-out transform",
        colors[type],
        getAnimationClass(),
        variant === "modern" && "border-0",
        variant === "minimal" && "backdrop-blur-sm",
        "hover:shadow-xl"
      )}
      style={{
        padding: variant === "minimal" ? "16px" : "12px 16px",
      }}
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon
            className={cn(
              "h-5 w-5 sm:h-6 sm:w-6",
              iconColors[type],
              variant === "minimal" && "h-4 w-4 sm:h-5 sm:w-5"
            )}
          />
        </div>

        {/* Content */}
        <div className="ml-3 flex-1 min-w-0">
          {title && (
            <p
              className={cn(
                "font-semibold leading-tight",
                variant === "minimal" ? "text-sm" : "text-sm sm:text-base",
                variant === "branded" && type === "service" && "text-yellow-800"
              )}
            >
              {title}
            </p>
          )}

          <p
            className={cn(
              "leading-relaxed",
              title ? "mt-1" : "mt-0",
              variant === "minimal" ? "text-xs" : "text-sm",
              variant === "modern" && "text-gray-600",
              variant === "branded" && type === "service" && "text-yellow-700"
            )}
          >
            {message}
          </p>

          {/* Action button */}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "mt-3 text-sm font-medium underline hover:no-underline focus:outline-none transition-colors duration-200",
                type === "service"
                  ? "text-yellow-600 hover:text-yellow-700"
                  : type === "success"
                  ? "text-green-600 hover:text-green-700"
                  : type === "error"
                  ? "text-red-600 hover:text-red-700"
                  : type === "warning"
                  ? "text-yellow-600 hover:text-yellow-700"
                  : type === "booking"
                  ? "text-purple-600 hover:text-purple-700"
                  : type === "payment"
                  ? "text-green-600 hover:text-green-700"
                  : "text-blue-600 hover:text-blue-700"
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        {!(persistent && type === "loading") && (
          <div className="ml-4 flex-shrink-0">
            <button
              className={cn(
                "inline-flex rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                variant === "modern" || variant === "minimal"
                  ? "text-gray-400 hover:text-gray-600 focus:ring-gray-500"
                  : "hover:opacity-75",
                type === "service" &&
                  variant === "branded" &&
                  "focus:ring-yellow-500"
              )}
              onClick={handleClose}
              aria-label="Close notification"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Progress bar for auto-close */}
      {autoClose && !persistent && (
        <div className="mt-3 h-1 bg-black/10 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all ease-linear",
              type === "success"
                ? "bg-green-500"
                : type === "error"
                ? "bg-red-500"
                : type === "warning"
                ? "bg-yellow-500"
                : type === "service"
                ? "bg-yellow-500"
                : type === "booking"
                ? "bg-purple-500"
                : type === "payment"
                ? "bg-green-500"
                : "bg-blue-500"
            )}
            style={{
              width: "100%",
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Toast Container Component for managing multiple toasts
const ToastContainer = ({
  toasts = [],
  position = "top-right",
  className,
  maxToasts = 5,
}) => {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col space-y-2 pointer-events-none",
        positionClasses[position],
        className
      )}
    >
      {visibleToasts.map((toast, index) => (
        <div key={toast.id || index} className="pointer-events-auto">
          <Toast {...toast} position={position} />
        </div>
      ))}
    </div>
  );
};

// Predefined toast variants for common use cases
const SuccessToast = ({ title = "Success!", ...props }) => (
  <Toast type="success" title={title} variant="branded" {...props} />
);

const ErrorToast = ({ title = "Error", ...props }) => (
  <Toast type="error" title={title} variant="modern" {...props} />
);

const BookingToast = ({ title = "Booking Update", ...props }) => (
  <Toast type="booking" title={title} variant="branded" {...props} />
);

const ServiceToast = ({ title = "CleanMatch", ...props }) => (
  <Toast type="service" title={title} variant="branded" {...props} />
);

const PaymentToast = ({ title = "Payment", ...props }) => (
  <Toast type="payment" title={title} variant="modern" {...props} />
);

export default Toast;
export {
  ToastContainer,
  SuccessToast,
  ErrorToast,
  BookingToast,
  ServiceToast,
  PaymentToast,
};
