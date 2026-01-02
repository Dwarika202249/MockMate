import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

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
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-white/10 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 px-6 py-3 z-50 flex justify-between items-center transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-500/30">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5 rounded-full pointer-events-none" />
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10 group">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-lg">🦊</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MockMate
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium relative z-10">
          <Link 
            to="/" 
            className={`relative group px-3 py-2 transition-colors duration-300 ${
              location.pathname === '/' 
                ? 'text-white' 
                : 'text-gray-100 hover:text-white'
            }`}
          >
            <span className="relative z-10">Home</span>
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg transition-opacity duration-300 ${
              location.pathname === '/' 
                ? 'opacity-20 animate-pulse' 
                : 'opacity-0 group-hover:opacity-10'
            }`} />
          </Link>
          <Link
            to="/pricing"
            className={`relative group px-3 py-2 transition-colors duration-300 ${
              location.pathname === '/pricing' 
                ? 'text-white' 
                : 'text-gray-100 hover:text-white'
            }`}
          >
            <span className="relative z-10">Pricing</span>
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg transition-opacity duration-300 ${
              location.pathname === '/pricing' 
                ? 'opacity-20 animate-pulse' 
                : 'opacity-0 group-hover:opacity-10'
            }`} />
          </Link>
          <Link 
            to="/about" 
            className={`relative group px-3 py-2 transition-colors duration-300 ${
              location.pathname === '/about' 
                ? 'text-white' 
                : 'text-gray-100 hover:text-white'
            }`}
          >
            <span className="relative z-10">About</span>
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg transition-opacity duration-300 ${
              location.pathname === '/about' 
                ? 'opacity-20 animate-pulse' 
                : 'opacity-0 group-hover:opacity-10'
            }`} />
          </Link>
          {loggedIn && (
            <Link 
              to="/dashboard" 
              className={`relative group px-3 py-2 transition-colors duration-300 ${
                location.pathname === '/dashboard' 
                  ? 'text-white' 
                  : 'text-gray-100 hover:text-white'
              }`}
            >
              <span className="relative z-10">Dashboard</span>
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg transition-opacity duration-300 ${
                location.pathname === '/dashboard' 
                  ? 'opacity-20 animate-pulse' 
                  : 'opacity-0 group-hover:opacity-10'
              }`} />
            </Link>
          )}
        </div>
          

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-3 px-5 relative z-10">
          {/* Credits Badge - Show only when logged in */}
          {loggedIn && <CreditsBadge />}
          
          {/* Profile Avatar */}
          {loggedIn && (
            <div className="mr-3"><ProfileMenu onSignOut={handleLogout} /></div>
          )}
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="relative bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-full font-semibold hover:from-red-600 hover:to-red-700 text-sm shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 text-sm shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex px-5 relative z-10">
          {/* Profile Avatar */}

          {loggedIn && (
            <div className="mr-3"><ProfileMenu onSignOut={handleLogout} /></div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="text-gray-100 hover:text-white transition-colors duration-300 hover:scale-110 transform"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-gradient-to-b from-gray-900 via-purple-900/30 to-gray-900 text-white w-72 z-50 sidebar border-l border-purple-500/20 shadow-2xl backdrop-blur-xl transform transition-all duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />
        
        <div className="flex flex-col p-6 relative z-10">
          <button 
            onClick={toggleSidebar} 
            className="self-end mb-8 text-gray-300 hover:text-white transition-colors duration-300 hover:rotate-90 transform"
          >
            <HiX size={32} />
          </button>
          
          {/* Navigation Links with Glassmorphic Cards */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center mb-4 text-xl font-bold backdrop-blur-md rounded-xl p-4 border transition-all duration-300 group ${
              location.pathname === '/'
                ? 'bg-white/15 border-purple-500/50 animate-pulse'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30'
            }`}
          >
            <IoHome className="mr-3 text-purple-400 group-hover:scale-110 transition-transform duration-300" size={24} />
            <span className={`transition-colors duration-300 ${
              location.pathname === '/' ? 'text-purple-400' : 'group-hover:text-purple-400'
            }`}>Home</span>
          </Link>
          
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className={`flex items-center mb-4 text-xl font-bold backdrop-blur-md rounded-xl p-4 border transition-all duration-300 group ${
              location.pathname === '/about'
                ? 'bg-white/15 border-indigo-500/50 animate-pulse'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30'
            }`}
          >
            <FaCircleInfo className="mr-3 text-indigo-400 group-hover:scale-110 transition-transform duration-300" size={24} />
            <span className={`transition-colors duration-300 ${
              location.pathname === '/about' ? 'text-indigo-400' : 'group-hover:text-indigo-400'
            }`}>About</span>
          </Link>
          
          <Link
            to="/pricing"
            onClick={() => setIsOpen(false)}
            className={`flex items-center mb-4 text-xl font-bold backdrop-blur-md rounded-xl p-4 border transition-all duration-300 group ${
              location.pathname === '/pricing'
                ? 'bg-white/15 border-pink-500/50 animate-pulse'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30'
            }`}
          >
            <FaTags className="mr-3 text-pink-400 group-hover:scale-110 transition-transform duration-300" size={24} />
            <span className={`transition-colors duration-300 ${
              location.pathname === '/pricing' ? 'text-pink-400' : 'group-hover:text-pink-400'
            }`}>Pricing</span>
          </Link>

          {loggedIn ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`flex items-center mb-6 text-xl font-bold backdrop-blur-md rounded-xl p-4 border transition-all duration-300 group ${
                  location.pathname === '/dashboard'
                    ? 'bg-white/15 border-cyan-500/50 animate-pulse'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30'
                }`}
              >
                <RiDashboardFill className="mr-3 text-cyan-400 group-hover:scale-110 transition-transform duration-300" size={24} />
                <span className={`transition-colors duration-300 ${
                  location.pathname === '/dashboard' ? 'text-cyan-400' : 'group-hover:text-cyan-400'
                }`}>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 mt-4"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 mt-4"
            >
              <RiLoginBoxFill className="mr-3" size={24} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
