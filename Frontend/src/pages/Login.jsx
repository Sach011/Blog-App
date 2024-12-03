import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();
  const navigatorTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // if (!email || !password || !role) {
    //   toast.error("Please fill in all fields");
    // }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password, role },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      localStorage.setItem("jwt", JSON.stringify(data.token));
      toast.success(data.message || "Registration successful");
      setProfile(data);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
      setRole("");
      navigatorTo("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Please fill in all fields",
        {
          duration: 3000,
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleLogin}>
          <div className="font-semibold text-xl items-center text-center">
            Cilli<span className="text-blue-500">Blog</span>
          </div>
          <h1 className="text-xl font-semibold mb-6">Login</h1>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            ></input>
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            ></input>
          </div>

          <p className="text-center mb-4">
            New User?{" "}
            <Link to="/register" className="text-blue-600">
              Register Now
            </Link>
          </p>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
