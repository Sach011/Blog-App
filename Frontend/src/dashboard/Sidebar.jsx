import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CiMenuBurger } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";

function Sidebar({ setComponent }) {
  const { profile, setIsAuthenticated } = useAuth();
  console.log(profile?.user);
  const navigateTo = useNavigate();

  const [show, setShow] = useState(false);

  const handelComponents = (value) => {
    setComponent(value);
  };

  const gotoHome = () => {
    navigateTo("/");
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("jwt");
      const parsedToken = token ? JSON.parse(token) : undefined;
      if (parsedToken) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json", token: parsedToken },
          }
        );
        console.log(data);
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
      <div
        className="sm:hidden fixed top-4 left-4 z-50"
        onClick={() => setShow(!show)}
      >
        <CiMenuBurger className="text-2xl" />
      </div>
      <div
        className={`w-64 h-full shadow-lg fixed top-0 left-0 bg-gray-50 transition duration-300 transform sm:translate-x-0 ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="sm:hidden absolute top-4 right-4 text-xl cursor-pointer"
          onClick={() => setShow(!show)}
        >
          <FaArrowLeft className="text-2xl" />
        </div>

        <div className="text-center">
          <img
            className="w-24  h-24 rounded-full mx-auto mb-2"
            src={profile?.user?.photo?.url}
            alt=""
          />
          <p className="text-lg font-semibold">{profile?.user?.name}</p>
        </div>
        <ul className="space-y-6 mx-4">
          <button
            onClick={() => handelComponents("MyBlogs")}
            className="w-full px-4 py-2 bg-green-500 rounded-lg hover:bg-green-700 transition duration-300"
          >
            MY BLOGS
          </button>
          <button
            onClick={() => handelComponents("Create Blog")}
            className="w-full px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            CREATE BLOG
          </button>
          <button
            onClick={() => handelComponents("MyProfile")}
            className="w-full px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            MY PROFILE
          </button>
          <button
            onClick={gotoHome}
            className="w-full px-4 py-2 bg-red-500 rounded-lg hover:bg-red-700 transition duration-300"
          >
            HOME
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-700 transition duration-300"
          >
            LOGOUT
          </button>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
