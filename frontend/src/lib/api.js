import axios from "axios";
import { parseApiError, logError, withRetry } from "../utils/errorHandling";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000, // Increased timeout
  withCredentials: true, // Enable credentials for CORS
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage first, then sessionStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for logging
    config.metadata = { startTime: new Date() };

    // Log request details in development
    if (import.meta.env.MODE === "development") {
      console.log(
        `🚀 Making ${config.method?.toUpperCase()} request to:`,
        config.url
      );
      console.log("Full URL:", `${config.baseURL}${config.url}`);
      if (token) {
        console.log("Using auth token:", token.substring(0, 20) + "...");
      }
    }

    return config;
  },
  (error) => {
    logError(parseApiError(error), { phase: "request" });
    return Promise.reject(parseApiError(error));
  }
);

// Response interceptor to handle auth errors and logging
api.interceptors.response.use(
  (response) => {
    // Log successful requests in development
    if (import.meta.env.MODE === "development") {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${
          response.config.url
        } (${duration}ms)`,
        response.data
      );
    }
    return response;
  },
  (error) => {
    const parsedError = parseApiError(error);

    // Log error with context
    const context = {
      method: error.config?.method,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config
        ? `${error.config.baseURL}${error.config.url}`
        : "unknown",
      duration: error.config?.metadata
        ? new Date() - error.config.metadata.startTime
        : null,
    };

    console.error("API Error:", {
      ...parsedError,
      context,
      originalError: error,
    });

    logError(parsedError, context);

    // Handle authentication errors
    if (parsedError.statusCode === 401) {
      // Clear auth data from both storage types
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("refreshToken");

      // Only redirect to login if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(parsedError);
  }
);

// Enhanced API wrapper with retry logic
const createApiMethod = (method) => {
  return (url, data = null, config = {}) => {
    const apiCall = () => {
      switch (method) {
        case "get":
          return api.get(url, config);
        case "post":
          return api.post(url, data, config);
        case "put":
          return api.put(url, data, config);
        case "patch":
          return api.patch(url, data, config);
        case "delete":
          return api.delete(url, config);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    };

    // Apply retry logic for GET requests and safe operations
    if (method === "get" || config.retry !== false) {
      return withRetry(apiCall, config.maxRetries || 2);
    }

    return apiCall();
  };
};

// Create enhanced API methods
const enhancedApi = {
  get: createApiMethod("get"),
  post: createApiMethod("post"),
  put: createApiMethod("put"),
  patch: createApiMethod("patch"),
  delete: createApiMethod("delete"),
  // Original axios instance for special cases
  raw: api,
};

// Auth API calls
export const authAPI = {
  register: (userData) => enhancedApi.post("/auth/register", userData),
  login: (credentials) => enhancedApi.post("/auth/login", credentials),
  forgotPassword: (email) =>
    enhancedApi.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    enhancedApi.post("/auth/reset-password", { token, password }),
  refreshToken: (refreshToken) =>
    enhancedApi.post("/auth/refresh", { refreshToken }),
  logout: () => enhancedApi.post("/auth/logout"),
};

// User API calls
export const userAPI = {
  getProfile: () => enhancedApi.get("/users/profile"),
  updateProfile: (data) => enhancedApi.put("/users/profile", data),
  getCleanerProfile: () => enhancedApi.get("/users/profile"), // Same endpoint, cleaner profile included
  updateCleanerProfile: (data) =>
    enhancedApi.put("/users/cleaner-profile", data),
  updateAvailability: (availability) =>
    enhancedApi.put("/users/availability", availability),
  changePassword: (data) => enhancedApi.put("/users/change-password", data),
  getUserBookings: (params) => enhancedApi.get("/users/bookings", { params }),
  getUserReviews: (params) => enhancedApi.get("/users/reviews", { params }),
};

// Services API calls
export const servicesAPI = {
  getAll: (params) => enhancedApi.get("/services", { params }),
  getCategories: () => enhancedApi.get("/services/categories"),
  getById: (id) => enhancedApi.get(`/services/${id}`),
  getByCategory: (category, params) =>
    enhancedApi.get(`/services/category/${category}`, { params }),
  getPricing: (id, params) =>
    enhancedApi.get(`/services/${id}/pricing`, { params }),
};

// Bookings API calls
export const bookingsAPI = {
  create: (bookingData) => enhancedApi.post("/bookings", bookingData),
  getCustomerBookings: (params) =>
    enhancedApi.get("/users/bookings", { params }),
  getCleanerBookings: (params) =>
    enhancedApi.get("/users/bookings", { params }),
  getAllBookings: (params) => enhancedApi.get("/bookings", { params }),
  getById: (id) => enhancedApi.get(`/bookings/${id}`),
  updateStatus: (id, status) =>
    enhancedApi.put(`/bookings/${id}/status`, { status }),
  assignCleaner: (id, cleanerId) =>
    enhancedApi.post(`/bookings/${id}/assign`, { cleanerId }),
  getRecommendations: (id) =>
    enhancedApi.get(`/bookings/${id}/recommendations`),
  // AI-Enhanced ZIP Code Matching
  getZipBasedRecommendations: (searchData) =>
    enhancedApi.post("/bookings/recommendations-by-zip", searchData),
  acceptBooking: (id) =>
    enhancedApi.put(`/bookings/${id}/status`, { status: "confirmed" }),
  rejectBooking: (id) =>
    enhancedApi.put(`/bookings/${id}/status`, { status: "cancelled" }),
  addReview: (id, review) => enhancedApi.post(`/bookings/${id}/review`, review),
};

// Payment API calls
export const paymentsAPI = {
  createPaymentIntent: (bookingId) =>
    enhancedApi.post("/payments/create-payment-intent", { bookingId }),
  confirmPayment: (paymentIntentId) =>
    enhancedApi.post("/payments/confirm", { paymentIntentId }),
  getPaymentHistory: (params) =>
    enhancedApi.get("/payments/history", { params }),
  processRefund: (bookingId, amount, reason) =>
    enhancedApi.post(`/payments/refund/${bookingId}`, { amount, reason }),

  // Legacy subscription endpoints (kept for backward compatibility)
  createSubscription: (data) =>
    enhancedApi.post("/payments/subscription", data),
  cancelSubscription: (data) =>
    enhancedApi.put("/payments/subscription/cancel", data),
  getUserSubscription: () => enhancedApi.get("/payments/subscription"),

  // Stripe Connect endpoints
  createCleanerConnectAccount: () =>
    enhancedApi.post("/payments/connect-account"),
  getConnectAccountStatus: () =>
    enhancedApi.get("/payments/connect-account/status"),
  transferPayment: (bookingId) =>
    enhancedApi.post(`/payments/transfer/${bookingId}`),
};

// Admin API calls
export const adminAPI = {
  // Dashboard and analytics
  getDashboardStats: () => enhancedApi.get("/admin/dashboard"),
  getAnalytics: () => enhancedApi.get("/admin/analytics/revenue"),
  getSystemStats: () => enhancedApi.get("/admin/dashboard"),

  // User management
  getUsers: (params) => enhancedApi.get("/admin/users", { params }),
  updateUserStatus: (userId, data) =>
    enhancedApi.put(`/admin/users/${userId}/status`, data),

  // Booking management
  getBookings: (params) => enhancedApi.get("/admin/bookings", { params }),
  assignCleaner: (bookingId, cleanerId) =>
    enhancedApi.post(`/admin/bookings/${bookingId}/assign`, { cleanerId }),

  // Cleaner management
  updateCleanerBackgroundCheck: (cleanerId, status) =>
    enhancedApi.put(`/admin/cleaners/${cleanerId}/background-check`, {
      status,
    }),

  // Payment management
  getPayments: (params) => enhancedApi.get("/admin/payments", { params }),
  processRefund: (bookingId, amount, reason) =>
    enhancedApi.post(`/admin/payments/refund/${bookingId}`, { amount, reason }),

  // Service management
  getServices: (params) => enhancedApi.get("/services", { params }),
  createService: (serviceData) => enhancedApi.post("/services", serviceData),
  updateService: (id, serviceData) =>
    enhancedApi.put(`/services/${id}`, serviceData),
  deleteService: (id) => enhancedApi.delete(`/services/${id}`),

  // Review management
  getReviews: (params) => enhancedApi.get("/admin/reviews", { params }),
  deleteReview: (id) => enhancedApi.delete(`/admin/reviews/${id}`),

  // Freelancer management
  getPendingFreelancers: (params) =>
    enhancedApi.get("/admin/freelancers/pending", { params }),
  getFreelancerDetails: (id) => enhancedApi.get(`/admin/freelancers/${id}`),
  approveFreelancer: (id, notes) =>
    enhancedApi.put(`/admin/cleaners/${id}/background-check`, {
      status: "approved",
      notes,
    }),
  rejectFreelancer: (id, notes) =>
    enhancedApi.put(`/admin/cleaners/${id}/background-check`, {
      status: "rejected",
      notes,
    }),

  // Membership management
  getUsersWithMembership: (params) =>
    enhancedApi.get("/admin/users-with-membership", { params }),
  cancelUserMembership: (userId) =>
    enhancedApi.put(`/admin/memberships/${userId}/cancel`),
  grantUserMembership: (userId, membershipData) =>
    enhancedApi.post(`/admin/memberships/${userId}/grant`, membershipData),
  getMembershipAnalytics: () => enhancedApi.get("/admin/membership-analytics"),
};

// Membership API endpoints
export const membershipAPI = {
  // Public endpoints
  getPlans: () => enhancedApi.get("/memberships/plans"),

  // Customer endpoints
  subscribe: (data) => enhancedApi.post("/memberships/subscribe", data),
  getCurrentMembership: () => enhancedApi.get("/memberships/current"),
  cancelMembership: (data) => enhancedApi.put("/memberships/cancel", data),
  reactivateMembership: () => enhancedApi.put("/memberships/reactivate"),
  updatePaymentMethod: (data) =>
    enhancedApi.put("/memberships/payment-method", data),
  calculatePricing: (data) =>
    enhancedApi.post("/memberships/calculate-pricing", data),

  // Admin endpoints
  getAnalytics: () => enhancedApi.get("/memberships/analytics"),
  getAllMemberships: (params) =>
    enhancedApi.get("/memberships/all", { params }),
};

// Tickets API endpoints
export const ticketsAPI = {
  // Customer endpoints
  create: (data) => enhancedApi.post("/tickets", data),
  getAll: (params) => enhancedApi.get("/tickets", { params }),
  getById: (id) => enhancedApi.get(`/tickets/${id}`),
  addMessage: (id, data) => enhancedApi.post(`/tickets/${id}/messages`, data),

  // Admin endpoints
  update: (id, data) => enhancedApi.put(`/tickets/${id}`, data),
  getStats: () => enhancedApi.get("/tickets/stats"),
};

// Convenience functions for ticket operations
export const createTicket = (data) => ticketsAPI.create(data);
export const getTickets = (params) => ticketsAPI.getAll({ params });
export const getTicketById = (id) => ticketsAPI.getById(id);
export const addTicketMessage = (id, data) => ticketsAPI.addMessage(id, data);
export const updateTicket = (id, data) => ticketsAPI.update(id, data);
export const getTicketStats = () => ticketsAPI.getStats();

// Get user bookings function (if it doesn't exist)
export const getUserBookings = (params) => userAPI.getUserBookings(params);

export default enhancedApi;
