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
import ProfileMenu from "./ProfileMenu";

const menuItems = [
  { label: "Dashboard", icon: <RiDashboardFill />, route: "/dashboard" },
  { label: "Take Interview", icon: <FaVideo />, route: "/dashboard/resume" },
  { label: "Progress Tracking", icon: <MdTrendingUp />, route: "/dashboard/overview" },
  { label: "Interview History", icon: <FaHistory />, route: "/dashboard/interview-history" },
  { label: "FAQs", icon: <FiHelpCircle />, route: "/dashboard/faqs" },
  { label: "Settings", icon: <IoSettingsOutline />, route: "/dashboard/settings" },
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
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#0e031a] text-white p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="bg-purple-700 rounded-xl p-2">
            <span className="text-white font-bold text-lg">🦊</span>
          </div>
          <span className="text-2xl font-bold text-white ml-3">MockMate</span>
        </Link>

        {/* Menu */}
        <nav className="space-y-4 mt-10">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.route}
              className={`flex items-center gap-3 text-sm px-4 py-2 rounded-md transition ${
                isActive(item.route)
                  ? "bg-purple-600"
                  : "hover:bg-purple-600"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout} type="submit" className="absolute bottom-4 left-6 flex items-center gap-3 text-sm hover:bg-red-600 px-4 py-2 rounded-md cursor-pointer transition">
          <MdLogout />
          <span>Log Out</span>
        </button>
      </div>

      {/* Hamburger / Close Button */}
      <button
        className={`md:hidden fixed top-8 z-50 p-2 rounded-md transition-all duration-300 ${
          isOpen ? "left-[13.5rem]" : "left-4"
        } bg-purple-600 text-white`}
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Main Content */}
      <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ease-in-out ${
        isOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <div className="p-6">
          <div className="flex justify-end"><ProfileMenu onSignOut={handleLogout} /></div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

