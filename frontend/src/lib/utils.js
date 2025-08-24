import clsx from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatCurrency(amount) {
  // Convert string to number if needed and ensure we have a valid number
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

export function formatDate(date) {
  if (!date) return "Date not set";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

export function formatDateTime(date) {
  if (!date) return "Date not set";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const s = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
  return s;
}

export function formatDateTimeLocal(date) {
  if (!date) return "Date not set";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const s = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(dateObj);
  return s;
}

export function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function capitalizeFirst(str) {
  if (str === "pending_cleaner_response") {
    return "Awaiting Cleaner Response";
  }
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

export function getStatusColor(status) {
  const statusColors = {
    pending: "bg-cyan-100 text-cyan-800",
    pending_cleaner_response: "bg-orange-100 text-orange-800",
    confirmed: "bg-blue-100 text-blue-800",
    in_progress: "bg-indigo-100 text-indigo-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-gray-100 text-gray-800",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
}

export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // Backend requires: at least 8 chars, one lowercase, one uppercase, one number, one special char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
  return passwordRegex.test(password);
}

export function validateZipCode(zipCode) {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
