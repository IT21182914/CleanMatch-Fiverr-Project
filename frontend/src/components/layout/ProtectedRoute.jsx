import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ModernPageLoader } from "../ui/Loading";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <ModernPageLoader message="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // More defensive role checking
  if (requiredRole) {
    const userRole =
      user && typeof user === "object" && user.role ? user.role : null;
    const roleToCheck = typeof requiredRole === "string" ? requiredRole : null;

    if (!userRole || !roleToCheck || userRole !== roleToCheck) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
