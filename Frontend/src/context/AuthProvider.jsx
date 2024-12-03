import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let token = localStorage.getItem("jwt");
        const parsedToken = token ? JSON.parse(token) : undefined;
        if (parsedToken) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/my-profile`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                token: parsedToken,
              },
            }
          );
          console.log(data);
          setProfile(data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/blog/all-blogs`
        );

        setBlogs(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlogs();
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        blogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
