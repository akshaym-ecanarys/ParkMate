import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { phone, name, role, userId }
  const [token, setToken] = useState(null);     // JWT from Cognito
  const [loading, setLoading] = useState(true); // hydrating from localStorage

  // Hydrate session on first load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("pm_token");
      const storedUser  = localStorage.getItem("pm_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (_) {
      // corrupted storage — start fresh
    } finally {
      setLoading(false);
    }
  }, []);

  // Called after Lambda returns JWT + user profile
  function login(jwt, userProfile) {
    setToken(jwt);
    setUser(userProfile);
    localStorage.setItem("pm_token", jwt);
    localStorage.setItem("pm_user", JSON.stringify(userProfile));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("pm_token");
    localStorage.removeItem("pm_user");
  }

  const isOwner    = user?.role === "owner";
  const isCustomer = user?.role === "customer";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isOwner, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
