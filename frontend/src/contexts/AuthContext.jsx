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
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

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
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      const parsedError = parseApiError(error);

      // Log error with context
      logError(parsedError, {
        action: "login",
        email: credentials.email,
      });

      return {
        success: false,
        error: parsedError.message,
        type: parsedError.type,
        field: parsedError.field,
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      const parsedError = parseApiError(error);

      // Log error with context
      logError(parsedError, {
        action: "register",
        email: userData.email,
        role: userData.role,
      });

      return {
        success: false,
        error: parsedError.message,
        type: parsedError.type,
        field: parsedError.field,
      };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
