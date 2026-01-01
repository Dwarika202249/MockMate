import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import { HiMenu, HiX } from "react-icons/hi";
import { RiDashboardFill } from "react-icons/ri";
import { IoHome } from "react-icons/io5";
import { FaCircleInfo } from "react-icons/fa6";
import { RiLoginBoxFill } from "react-icons/ri";
import { FaTags  } from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";
import CreditsBadge from "./CreditsBadge";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => setLoggedIn(isAuthenticated());
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsOpen(false);
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (isOpen && !event.target.closest(".sidebar")) {
      setIsOpen(false);
    }
  };

  const scrollToPricing = (e) => {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing");

    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home first, then scroll (if coming from another route)
      navigate("/", {
        state: { scrollTo: "pricing" },
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-white rounded-full shadow-lg px-6 py-3 z-50 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-purple-700 rounded-xl p-2">
            <span className="text-white font-bold text-lg">🦊</span>
          </div>
          <span className="text-xl font-bold text-indigo-900">MockMate</span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-indigo-900">
          <Link to="/" className="hover:text-purple-700">
            Home
          </Link>
          <Link
            to="/"
            onClick={(e) => {
              scrollToPricing(e);
            }}
            className="hover:text-purple-700"
          >
            Pricing
          </Link>
          <Link to="/about" className="hover:text-purple-700">
            About
          </Link>
          {loggedIn && (
            <Link to="/dashboard" className="hover:text-purple-700">
              Dashboard
            </Link>
          )}
        </div>
          

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-3 px-5">
          {/* Credits Badge - Show only when logged in */}
          {loggedIn && <CreditsBadge />}
          
          {/* Profile Avatar */}
          {loggedIn && (
            <div className="mr-3"><ProfileMenu onSignOut={handleLogout} /></div>
          )}
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-purple-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-800 text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-purple-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-800 text-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex px-5">
          {/* Profile Avatar */}

          {loggedIn && (
            <div className="mr-3"><ProfileMenu onSignOut={handleLogout} /></div>
          )}
          <button onClick={toggleSidebar} className="text-purple-800">
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-[#0e031a] text-white w-64 z-50 sidebar transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4">
          <button onClick={toggleSidebar} className="self-end mb-8">
            <HiX size={30} />
          </button>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center mb-4 text-2xl font-bold"
          >
            <IoHome className="mr-2" /> Home
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="flex items-center mb-4 text-2xl font-bold"
          >
            <FaCircleInfo className="mr-2" /> About
          </Link>
          <Link
            to="/"
            onClick={(e) => {
              setIsOpen(false);
              scrollToPricing(e);
            }}
            className="flex items-center mb-4 text-2xl font-bold"
          >
            <FaTags className="mr-2" /> Pricing
          </Link>

          {loggedIn ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center mb-4 text-2xl font-bold"
              >
                <RiDashboardFill className="mr-2" /> Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center mb-4 text-2xl font-bold"
            >
              <RiLoginBoxFill className="mr-2" /> Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
