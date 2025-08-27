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
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const userData =
          localStorage.getItem("user") || sessionStorage.getItem("user");

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
      console.log(
        "API URL:",
        import.meta.env.VITE_API_URL || "http://localhost:5000/api"
      );
      console.log("Credentials being sent:", {
        email: credentials.email,
        hasPassword: !!credentials.password,
        rememberMe: credentials.rememberMe,
      });

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
      if (
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("Network Error")
      ) {
        errorMessage =
          "Network connection failed. Please check your internet connection and try again.";
      } else if (
        error.code === "ECONNREFUSED" ||
        error.message?.includes("ECONNREFUSED")
      ) {
        errorMessage =
          "Unable to connect to server. Please ensure the backend server is running.";
      } else if (parsedError.statusCode === 400) {
        errorMessage =
          parsedError.message ||
          "Invalid login credentials. Please check your email and password.";
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
      console.log(
        "Attempting registration with API URL:",
        import.meta.env.VITE_API_URL || "http://localhost:5000/api"
      );
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
      if (
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("Network Error")
      ) {
        errorMessage =
          "Network connection failed. Please check your internet connection and try again.";
      } else if (
        error.code === "ECONNREFUSED" ||
        error.message?.includes("ECONNREFUSED")
      ) {
        errorMessage =
          "Unable to connect to server. Please ensure the backend server is running.";
      }

      return {
        success: false,
        error: errorMessage,
        type: parsedError.type,
        field: parsedError.field,
      };
    }
  };

  const logout = async (fromAllDevices = false) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Call logout API if we have a token
      if (token) {
        try {
          const endpoint = fromAllDevices
            ? "/api/auth/logout-all"
            : "/api/auth/logout";

          // Get base URL and ensure it doesn't have /api at the end
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000/api";
          const baseUrl = apiUrl.endsWith("/api")
            ? apiUrl.slice(0, -4)
            : apiUrl;

          const response = await fetch(`${baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          // Even if API call fails, we continue with client-side cleanup
          if (response.ok) {
            console.log("✅ Server-side logout successful");
          } else {
            console.warn(
              "⚠️ Server-side logout failed, continuing with client-side cleanup"
            );
          }
        } catch (apiError) {
          console.warn("⚠️ Logout API call failed:", apiError.message);
          // Continue with client-side cleanup even if API fails
        }
      }

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

      // Clear storage even if error occurs
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("refreshToken");
      } catch (storageError) {
        console.error("Error clearing storage:", storageError);
      }

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

  const getToken = () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.warn("No token found in storage");
        return null;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < currentTime) {
          console.warn("Token has expired, logging out");
          logout();
          return null;
        }

        return token;
      } catch (parseError) {
        console.error("Error parsing token:", parseError);
        logout();
        return null;
      }
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
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
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
