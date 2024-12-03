import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";

function Navbar() {
  const { blogs } = useAuth();
  const [show, setShow] = useState(false);

  const { profile, isAuthenticated, setIsAuthenticated } = useAuth();
  console.log(profile?.user);
  const navigateTo = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("jwt");
      const parsedToken = token ? JSON.parse(token) : undefined;
      if (parsedToken) {
        const { data } = await axios.get(
          "http://localhost:4001/api/user/logout",
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json", token: parsedToken },
          }
        );
        console.log(data);
        localStorage.removeItem("jwt");
        toast.success(data.message || "Logout successful");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
      toast.error;
    }
  };

  return (
    <>
      <nav className="shadow-lg px-3 py-6">
        <div className="flex items-center justify-between container mx-auto bg-blue-100">
          <div className="font-semibold text-xl">
            Cilli<span className="text-blue-500">Blog</span>
          </div>
          {/* {Desktop} */}
          <div className=" mx-6">
            <ul className=" md:flex space-x-6">
              <Link to="/" className="hover:text-blue-500">
                HOME
              </Link>
              <Link to="/blogs" className="hover:text-blue-500">
                BLOGS
              </Link>
              <Link to="/creators" className="hover:text-blue-500">
                CREATORS
              </Link>
              <Link to="/about" className="hover:text-blue-500">
                ABOUT
              </Link>
              <Link to="/contact" className="hover:text-blue-500">
                CONTACT
              </Link>
            </ul>
            <div className="md:hidden" onClick={() => setShow(!show)}>
              {show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
            </div>
          </div>
          <div className="space-x-2 hidden md:flex">
            {isAuthenticated && profile?.user?.role === "admin" ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-blue-600
             text-white font-semibold hover:bg-blue-800
              duration-300 px-4 py-4 rounded"
                >
                  DASHBOARD
                </Link>
              </>
            ) : (
              <></>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="bg-red-600
             text-white font-semibold hover:bg-red-800
              duration-300 px-4 py-4 rounded"
                >
                  LOGIN
                </Link>
              </>
            ) : (
              <>
                <div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600
             text-white font-semibold hover:bg-red-800
              duration-300 px-4 py-4 rounded"
                  >
                    LOGOUT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {/* {Mobile} */}
        {show && (
          <div className="bg-white">
            <ul className="flex flex-col h-screen items-center justify-center space-y-3 md:hidden text-xl">
              <Link
                to="/"
                onClick={() => setShow(!show)}
                smooth={true}
                duration={500}
                offset={-70}
                activeClass="active"
                className="hover:text-blue-500"
              >
                HOME
              </Link>
              <Link
                to="/blogs"
                onClick={() => setShow(!show)}
                smooth={true}
                duration={500}
                offset={-70}
                activeClass="active"
                className="hover:text-blue-500"
              >
                BLOGS
              </Link>
              <Link
                to="/creators"
                onClick={() => setShow(!show)}
                smooth={true}
                duration={500}
                offset={-70}
                activeClass="active"
                className="hover:text-blue-500"
              >
                CREATORS
              </Link>
              <Link
                to="/about"
                onClick={() => setShow(!show)}
                smooth={true}
                duration={500}
                offset={-70}
                activeClass="active"
                className="hover:text-blue-500"
              >
                ABOUT
              </Link>
              <Link
                to="/contact"
                onClick={() => setShow(!show)}
                smooth={true}
                duration={500}
                offset={-70}
                activeClass="active"
                className="hover:text-blue-500"
              >
                CONTACT
              </Link>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
