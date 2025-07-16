import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import { ModernPageLoader } from "./components/ui/Loading";

// Lazy load pages for better performance
// Auth pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));

// Dashboard pages
const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"));

// Customer pages
const BookService = React.lazy(() => import("./pages/customer/BookService"));
const EnhancedBookService = React.lazy(() =>
  import("./pages/customer/EnhancedBookService")
);
const CustomerBookings = React.lazy(() =>
  import("./pages/customer/CustomerBookings")
);
const Payment = React.lazy(() => import("./pages/customer/Payment"));
const CustomerProfile = React.lazy(() => import("./pages/customer/Profile"));

// Cleaner pages
const CleanerJobs = React.lazy(() => import("./pages/cleaner/Jobs"));
const CleanerProfile = React.lazy(() => import("./pages/cleaner/Profile"));
const CleanerEarnings = React.lazy(() => import("./pages/cleaner/Earnings"));
const CleanerAvailability = React.lazy(() =>
  import("./pages/cleaner/Availability")
);

// Admin pages
const AdminUsers = React.lazy(() => import("./pages/admin/Users"));
const AdminServices = React.lazy(() => import("./pages/admin/Services"));
const AdminBookings = React.lazy(() => import("./pages/admin/Bookings"));
const AdminAnalytics = React.lazy(() => import("./pages/admin/Analytics"));

// Home page - Keep this eagerly loaded as it's the landing page
import Home from "./pages/Home";
const AIMatchingDemo = React.lazy(() => import("./pages/AIMatchingDemo"));
const LoadingDemo = React.lazy(() => import("./pages/LoadingDemo"));
const ImageGalleryDemo = React.lazy(() => import("./pages/ImageGalleryDemo"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Layout>
              <Suspense
                fallback={<ModernPageLoader message="Loading page..." />}
              >
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/ai-demo" element={<AIMatchingDemo />} />
                  <Route path="/loading-demo" element={<LoadingDemo />} />
                  <Route
                    path="/image-gallery-demo"
                    element={<ImageGalleryDemo />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Customer routes */}
                  <Route
                    path="/book"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <BookService />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/book-ai"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <EnhancedBookService />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/customer/bookings"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerBookings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/customer/profile"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerProfile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/payment/:bookingId"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <Payment />
                      </ProtectedRoute>
                    }
                  />

                  {/* Cleaner routes */}
                  <Route
                    path="/cleaner/jobs"
                    element={
                      <ProtectedRoute requiredRole="cleaner">
                        <CleanerJobs />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/cleaner/profile"
                    element={
                      <ProtectedRoute requiredRole="cleaner">
                        <CleanerProfile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/cleaner/earnings"
                    element={
                      <ProtectedRoute requiredRole="cleaner">
                        <CleanerEarnings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/cleaner/availability"
                    element={
                      <ProtectedRoute requiredRole="cleaner">
                        <CleanerAvailability />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/services"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminServices />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/bookings"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminBookings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminAnalytics />
                      </ProtectedRoute>
                    }
                  />

                  {/* Legacy routes for backward compatibility */}
                  <Route
                    path="/bookings"
                    element={<Navigate to="/customer/bookings" replace />}
                  />

                  <Route
                    path="/profile"
                    element={<Navigate to="/customer/profile" replace />}
                  />

                  {/* Catch all route */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
