import { createContext, useState, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  isAuthenticated as checkAuth,
  getCurrentUser as getUser,
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checkAuth()) {
      const userData = getUser();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await loginService(username, password);
    setUser(result.user);
    return result;
  };

  const register = async (userData) => {
    const result = await registerService(userData);
    return result;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
