import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (storedToken) userObj.token = storedToken;
      setUser(userObj);
    }
  }, []);

  // Call this on login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Save token separately for Axios
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  // Call this on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
