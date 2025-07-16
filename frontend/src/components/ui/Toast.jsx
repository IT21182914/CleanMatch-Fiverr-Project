import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
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
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && !persistent) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
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
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    loading: "bg-gray-50 border-gray-200 text-gray-800",
  };

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
    loading: "text-gray-400 animate-spin",
  };

  const Icon = icons[type];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={cn(
        "max-w-xs sm:max-w-sm w-full border rounded-lg p-3 sm:p-4 shadow-lg transition-all duration-300",
        colors[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", iconColors[type])} />
        </div>
        <div className="ml-2 sm:ml-3 flex-1 min-w-0">
          {title && (
            <p className="text-xs sm:text-sm font-medium truncate">{title}</p>
          )}
          <p className="text-xs sm:text-sm mt-1 break-words">{message}</p>

          {/* Action button */}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-xs sm:text-sm font-medium underline hover:no-underline focus:outline-none"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close button - hide for persistent loading toasts */}
        {!(persistent && type === "loading") && (
          <div className="ml-2 sm:ml-4 flex-shrink-0">
            <button
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-75 p-1"
              onClick={handleClose}
              aria-label="Close notification"
            >
              <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
