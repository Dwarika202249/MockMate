import { useState, useRef, useEffect } from "react";
import { FaUserCog, FaSignOutAlt, FaUser, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const ProfileMenu = ({ onSignOut }) => {
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarLetter = userData?.name?.charAt(0)?.toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50 group"
      >
        <div className="relative">
          {userData?.photoURL ? (
            <img
              src={userData.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-sm text-white border-2 border-white/30">
              {avatarLetter || "U"}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600" />
        </div>
        <FaChevronDown 
          className={`text-white text-xs transition-transform duration-300 ${open ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden"
          >
            {/* Gradient Header */}
            <div className="p-5 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {userData?.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                      {avatarLetter || "U"}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-lg truncate">{userData?.name || "User"}</p>
                  <p className="text-sm text-gray-400 truncate">{userData?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="w-full px-5 py-3 text-left text-sm text-gray-200 hover:bg-white/10 flex items-center gap-3 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors duration-200">
                  <FaUser className="text-purple-400" />
                </div>
                <span className="font-medium">Profile</span>
              </Link>

              <button
                className="w-full px-5 py-3 text-left text-sm text-gray-200 hover:bg-white/10 flex items-center gap-3 transition-all duration-200 group"
                onClick={() => {
                  alert("Manage account clicked");
                  setOpen(false);
                }}
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-600/20 flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors duration-200">
                  <FaUserCog className="text-indigo-400" />
                </div>
                <span className="font-medium">Manage Account</span>
              </button>

              <Link
                to="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="w-full px-5 py-3 text-left text-sm text-gray-200 hover:bg-white/10 flex items-center gap-3 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-600/20 flex items-center justify-center group-hover:bg-cyan-600/30 transition-colors duration-200">
                  <IoSettingsOutline className="text-cyan-400 text-lg" />
                </div>
                <span className="font-medium">Settings</span>
              </Link>

              <div className="my-2 mx-3 border-t border-white/10" />

              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-red-500/10 flex items-center gap-3 transition-all duration-200 group"
                onClick={() => {
                  onSignOut();
                  setOpen(false);
                }}
              >
                <div className="w-9 h-9 rounded-lg bg-red-600/20 flex items-center justify-center group-hover:bg-red-600/30 transition-colors duration-200">
                  <FaSignOutAlt className="text-red-400" />
                </div>
                <span className="font-medium text-red-400">Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
