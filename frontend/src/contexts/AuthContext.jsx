import { createContext, useState, useEffect } from "react";
import { authAPI } from "../lib/api";
import { parseApiError, logError } from "../utils/errorHandling";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const userData = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log("🚀 Starting login process...");
      console.log("API URL:", import.meta.env.VITE_API_URL || "http://localhost:5000/api");
      console.log("Credentials being sent:", { email: credentials.email, hasPassword: !!credentials.password, rememberMe: credentials.rememberMe });
      
      const response = await authAPI.login(credentials);
      console.log("✅ Login response received:", response.data);
      
      const { token, refreshToken, user: userData } = response.data;

      // Store in localStorage or sessionStorage based on rememberMe
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(userData));
      
      if (refreshToken) {
        storage.setItem("refreshToken", refreshToken);
      }

      setUser(userData);
      setIsAuthenticated(true);

      console.log("✅ Login successful, user authenticated");
      return { success: true, user: userData };
    } catch (error) {
      console.error("❌ Login error details:", error);
      const parsedError = parseApiError(error);

      // Log error with context
      logError(parsedError, {
        action: "login",
        email: credentials.email,
        apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
      });

      // Provide more specific error messages
      let errorMessage = parsedError.message;
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = "Network connection failed. Please check your internet connection and try again.";
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        errorMessage = "Unable to connect to server. Please ensure the backend server is running.";
      } else if (parsedError.statusCode === 400) {
        errorMessage = parsedError.message || "Invalid login credentials. Please check your email and password.";
      }

      console.error("❌ Final error message:", errorMessage);
      return {
        success: false,
        error: errorMessage,
        type: parsedError.type,
        field: parsedError.field,
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log("Attempting registration with API URL:", import.meta.env.VITE_API_URL || "http://localhost:5000/api");
      const response = await authAPI.register(userData);
      const { token, refreshToken, user: newUser } = response.data;

      // Store in localStorage by default for registration (user likely wants to stay logged in)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Registration error details:", error);
      const parsedError = parseApiError(error);

      // Log error with context
      logError(parsedError, {
        action: "register",
        email: userData.email,
        role: userData.role,
        apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
      });

      // Provide more specific error messages
      let errorMessage = parsedError.message;
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = "Network connection failed. Please check your internet connection and try again.";
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        errorMessage = "Unable to connect to server. Please ensure the backend server is running.";
      }

      return {
        success: false,
        error: errorMessage,
        type: parsedError.type,
        field: parsedError.field,
      };
    }
  };

  const logout = () => {
    try {
      // Clear from both storage types
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("refreshToken");
      
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error("Error during logout:", error);
      // Force logout even if error occurs
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: "Failed to logout completely" };
    }
  };

  const updateUser = (updatedUser) => {
    try {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      console.error("Error updating user data:", error);
      return { success: false, error: "Failed to update user data" };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
