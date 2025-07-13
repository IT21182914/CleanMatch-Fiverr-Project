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
  refreshToken: () => api.post("/auth/refresh-token"),
  logout: () => api.post("/auth/logout"),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  getCleanerProfile: () => api.get("/users/cleaner-profile"),
  updateCleanerProfile: (data) => api.put("/users/cleaner-profile", data),
  updateAvailability: (availability) =>
    api.put("/users/availability", availability),
};

// Services API calls
export const servicesAPI = {
  getAll: () => api.get("/services"),
  getCategories: () => api.get("/services/categories"),
  getById: (id) => api.get(`/services/${id}`),
};

// Bookings API calls
export const bookingsAPI = {
  create: (bookingData) => api.post("/bookings", bookingData),
  getCustomerBookings: () => api.get("/bookings/customer"),
  getCleanerBookings: () => api.get("/bookings/cleaner"),
  getAllBookings: () => api.get("/bookings"),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  acceptBooking: (id) => api.patch(`/bookings/${id}/accept`),
  rejectBooking: (id) => api.patch(`/bookings/${id}/reject`),
  addReview: (id, review) => api.post(`/bookings/${id}/review`, review),
};

// Payment API calls
export const paymentsAPI = {
  createPaymentIntent: (bookingId) =>
    api.post("/payments/create-payment-intent", { bookingId }),
  confirmPayment: (paymentIntentId) =>
    api.post("/payments/confirm", { paymentIntentId }),
  getPaymentHistory: () => api.get("/payments/history"),
  processRefund: (paymentId, amount) =>
    api.post("/payments/refund", { paymentId, amount }),
};

// Admin API calls
export const adminAPI = {
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUserStatus: (userId, status) =>
    api.patch(`/admin/users/${userId}/status`, { status }),
  getBookings: (params) => api.get("/admin/bookings", { params }),
  assignCleaner: (bookingId, cleanerId) =>
    api.patch(`/admin/bookings/${bookingId}/assign`, { cleanerId }),
  getAnalytics: () => api.get("/admin/analytics"),
  getSystemStats: () => api.get("/admin/stats"),
  manageService: (serviceData) => api.post("/admin/services", serviceData),
  updateService: (id, serviceData) =>
    api.put(`/admin/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
};

export default api;
