import { useCallback } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser } from "../services/authService";
import { getSocket, initSocket } from "../socket/socket";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore auth on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
      initSocket(storedToken);
    }

    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", authToken);

    setUser(userData);
    setAccessToken(authToken);
    initSocket(authToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
    setUser(null);
    setAccessToken(null);
    const socket = getSocket();
    socket?.disconnect();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
