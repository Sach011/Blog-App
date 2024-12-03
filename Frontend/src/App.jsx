import React from "react";
import Navbar from "../src/components/Navbar";
import Home from "../src/components/Home";
import Footer from "../src/components/Footer";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Blogs from "../src/pages/Blogs";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import Creators from "../src/pages/Creators";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/Dashborad";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import UpdateBlog from "./dashboard/UpdateBlog";
import Detail from "./pages/Detail";
import Notfound from "./pages/Notfound";

function App() {
  const location = useLocation();
  console.log(location);
  const hideNavbarFooter = ["/login", "/register", "/dashboard"].includes(
    location.pathname
  );
  const { blogs, isAuthenticated } = useAuth();
  console.log(blogs);
  console.log(isAuthenticated);

  return (
    <div className="bg-blue-100">
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route
          exact
          path="/"
          element={
            isAuthenticated === true ? <Home /> : <Navigate to={"/login"} />
          }
        />
      </Routes>
      <Routes>
        <Route exact path="/blogs" element={<Blogs />} />
      </Routes>
      <Routes>
        <Route exact path="/about" element={<About />} />
      </Routes>
      <Routes>
        <Route exact path="/contact" element={<Contact />} />
      </Routes>
      <Routes>
        <Route exact path="/creators" element={<Creators />} />
      </Routes>
      <Routes>
        <Route exact path="/login" element={<Login />} />
      </Routes>
      <Routes>
        <Route exact path="/register" element={<Register />} />
      </Routes>
      <Routes>
        <Route exact path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* {Detail Page Route} */}
      <Routes>
        <Route exact path="/blogs/:id" element={<Detail />} />
      </Routes>

      {/* {Update Page Route} */}
      <Routes>
        <Route exact path="/blog/update/:id" element={<UpdateBlog />} />
      </Routes>

      {/* {Universal} */}

      {/* <Routes>
        <Route path="*" element={<Notfound />} />
      </Routes> */}

      <Toaster />

      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
