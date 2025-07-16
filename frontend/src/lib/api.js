import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),
  refreshToken: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logout: () => api.post("/auth/logout"),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  getCleanerProfile: () => api.get("/users/profile"), // Same endpoint, cleaner profile included
  updateCleanerProfile: (data) => api.put("/users/cleaner-profile", data),
  updateAvailability: (availability) =>
    api.put("/users/availability", availability),
  changePassword: (data) => api.put("/users/change-password", data),
  getUserBookings: (params) => api.get("/users/bookings", { params }),
  getUserReviews: (params) => api.get("/users/reviews", { params }),
};

// Services API calls
export const servicesAPI = {
  getAll: (params) => api.get("/services", { params }),
  getCategories: () => api.get("/services/categories"),
  getById: (id) => api.get(`/services/${id}`),
  getByCategory: (category, params) =>
    api.get(`/services/category/${category}`, { params }),
  getPricing: (id, params) => api.get(`/services/${id}/pricing`, { params }),
};

// Bookings API calls
export const bookingsAPI = {
  create: (bookingData) => api.post("/bookings", bookingData),
  getCustomerBookings: (params) => api.get("/users/bookings", { params }),
  getCleanerBookings: (params) => api.get("/users/bookings", { params }),
  getAllBookings: (params) => api.get("/bookings", { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  assignCleaner: (id, cleanerId) =>
    api.post(`/bookings/${id}/assign`, { cleanerId }),
  getRecommendations: (id) => api.get(`/bookings/${id}/recommendations`),
  // AI-Enhanced ZIP Code Matching
  getZipBasedRecommendations: (searchData) =>
    api.post("/bookings/recommendations-by-zip", searchData),
  acceptBooking: (id) =>
    api.put(`/bookings/${id}/status`, { status: "confirmed" }),
  rejectBooking: (id) =>
    api.put(`/bookings/${id}/status`, { status: "cancelled" }),
  addReview: (id, review) => api.post(`/bookings/${id}/review`, review),
};

// Payment API calls
export const paymentsAPI = {
  createPaymentIntent: (bookingId) =>
    api.post("/payments/create-payment-intent", { bookingId }),
  confirmPayment: (paymentIntentId) =>
    api.post("/payments/confirm", { paymentIntentId }),
  getPaymentHistory: (params) => api.get("/payments/history", { params }),
  processRefund: (bookingId, amount, reason) =>
    api.post(`/payments/refund/${bookingId}`, { amount, reason }),

  // Subscription endpoints
  createSubscription: (data) => api.post("/payments/subscription", data),
  cancelSubscription: (data) => api.put("/payments/subscription/cancel", data),
  getUserSubscription: () => api.get("/payments/subscription"),

  // Stripe Connect endpoints
  createCleanerConnectAccount: () => api.post("/payments/connect-account"),
  getConnectAccountStatus: () => api.get("/payments/connect-account/status"),
  transferPayment: (bookingId) => api.post(`/payments/transfer/${bookingId}`),
};

// Admin API calls
export const adminAPI = {
  // Dashboard and analytics
  getDashboardStats: () => api.get("/admin/dashboard"),
  getAnalytics: () => api.get("/admin/analytics/revenue"),
  getSystemStats: () => api.get("/admin/dashboard"),

  // User management
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUserStatus: (userId, data) =>
    api.put(`/admin/users/${userId}/status`, data),

  // Booking management
  getBookings: (params) => api.get("/admin/bookings", { params }),
  assignCleaner: (bookingId, cleanerId) =>
    api.post(`/admin/bookings/${bookingId}/assign`, { cleanerId }),

  // Cleaner management
  updateCleanerBackgroundCheck: (cleanerId, status) =>
    api.put(`/admin/cleaners/${cleanerId}/background-check`, { status }),

  // Payment management
  getPayments: (params) => api.get("/admin/payments", { params }),
  processRefund: (bookingId, amount, reason) =>
    api.post(`/admin/payments/refund/${bookingId}`, { amount, reason }),

  // Service management
  getServices: (params) => api.get("/services", { params }),
  createService: (serviceData) => api.post("/services", serviceData),
  updateService: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Review management
  getReviews: (params) => api.get("/admin/reviews", { params }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};

export default api;
