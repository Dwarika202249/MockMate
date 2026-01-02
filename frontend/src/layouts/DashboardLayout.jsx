import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import { FaVideo } from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FiHelpCircle } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import ProfileMenu from "../components/common/ProfileMenu";
import CreditsBadge from "../components/common/CreditsBadge";

const menuItems = [
  { label: "Dashboard", icon: <RiDashboardFill />, route: "/dashboard" },
  {
    label: "Take Interview",
    icon: <FaVideo />,
    route: "/dashboard/resume",
    beta: true,
  },
  {
    label: "Progress Tracking",
    icon: <MdTrendingUp />,
    route: "/dashboard/progress",
  },
  {
    label: "Interview History",
    icon: <FaHistory />,
    route: "/dashboard/interview-history",
  },
  { label: "FAQs", icon: <FiHelpCircle />, route: "/dashboard/faqs" },
  {
    label: "Settings",
    icon: <IoSettingsOutline />,
    route: "/dashboard/settings",
  },
];

const DashboardLayout = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsOpen(false);
      else setIsOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (route) => location.pathname === route;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen relative bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[110px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gradient-to-b from-purple-950/40 via-indigo-950/30 to-purple-950/40 backdrop-blur-xl border-r border-purple-500/20 text-white p-6 transform transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(139,92,246,0.15)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 group">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-2 shadow-lg group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-lg drop-shadow-lg">🦊</span>
          </div>
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 ml-3 drop-shadow-lg">MockMate</span>
        </Link>

        {/* Menu */}
        <nav className="space-y-3 mt-10">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.route}
              className={`relative flex items-center justify-between text-sm px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                isActive(item.route)
                  ? "bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white"
                  : "border border-white/5 hover:border-purple-500/30 hover:bg-white/5 text-gray-300 hover:text-white hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              }`}
            >
              {/* Gradient background for active state */}
              {isActive(item.route) && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 animate-pulse" />
              )}
              
              <div className="relative z-10 flex items-center gap-3">
                <span className={`text-base transition-transform duration-300 ${
                  isActive(item.route) ? "scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "group-hover:scale-105"
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.beta && (
                <span className="relative z-10 ml-2 text-[10px] font-bold text-yellow-300 bg-yellow-600/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-yellow-500/40 shadow-sm">
                  BETA
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          type="submit"
          className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-3 text-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-sm"
        >
          <MdLogout className="text-base" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>

      {/* Hamburger / Close Button */}
      <button
        className={`md:hidden fixed top-6 z-50 p-3 rounded-xl transition-all duration-300 backdrop-blur-xl border shadow-lg ${
          isOpen
            ? "left-[14rem] bg-white/10 border-white/20 hover:bg-white/15"
            : "left-4 bg-purple-600/80 border-purple-500/50 hover:bg-purple-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        } text-white`}
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
      </button>

      {/* Main Content */}
      <div
        className={`relative z-10 flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "ml-0 md:ml-64" : "ml-0"
        }`}
      >
        <div className="p-4 sm:p-6">
          {/* Header Bar */}
          <div className="flex justify-end items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <CreditsBadge />
            <ProfileMenu onSignOut={handleLogout} />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
