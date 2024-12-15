import API from "../api/axios.config";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./authContext";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      API.get("/profile").then((res) => setUserData(res?.data));
    }
  }, [isLoggedIn]);

  const logout = () => {
    API.get("/logout").then(() => {
      setUserData(null);
      setIsLoggedIn(false);
    });
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within UserContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
