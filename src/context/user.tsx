import { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  name?: string;
  email?: string;
  theme?: string;
  isAuthenticated?: boolean;
}

const UserContext = createContext(null);

export function LoginProvider({ children }) {
  const [userData, setUserData] = useState({
    // user data with name and email
    name: "",
    email: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const handleTheme = (savedTheme) => {
    setTheme(savedTheme);
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      document.documentElement.classList.toggle(
        "light",
        savedTheme === "light"
      );
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <UserContext.Provider
      value={{
        userData,
        theme,
        isAuthenticated,
        handleUserData: setUserData,
        handleTheme,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/* eslint-disable*/
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("UserContext was used outside of the PostProvider");
  return context;
}
