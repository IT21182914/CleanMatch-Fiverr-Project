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

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";

// Customer pages
import BookService from "./pages/customer/BookService";
import EnhancedBookService from "./pages/customer/EnhancedBookService";
import CustomerBookings from "./pages/customer/CustomerBookings";
import Payment from "./pages/customer/Payment";
import CustomerProfile from "./pages/customer/Profile";

// Cleaner pages
import CleanerJobs from "./pages/cleaner/Jobs";
import CleanerProfile from "./pages/cleaner/Profile";
import CleanerEarnings from "./pages/cleaner/Earnings";
import CleanerAvailability from "./pages/cleaner/Availability";

// Admin pages
import AdminUsers from "./pages/admin/Users";
import AdminServices from "./pages/admin/Services";
import AdminBookings from "./pages/admin/Bookings";
import AdminAnalytics from "./pages/admin/Analytics";

// Home page
import Home from "./pages/Home";
import AIMatchingDemo from "./pages/AIMatchingDemo";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/ai-demo" element={<AIMatchingDemo />} />
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
            </Layout>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
