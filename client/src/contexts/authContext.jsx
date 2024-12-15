import API from "../api/axios.config";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  useEffect(() => {
    API.get("/login-status").then((res) => setIsLoggedIn(res?.data));
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return context;
};

export { AuthContextProvider, useAuthContext };
