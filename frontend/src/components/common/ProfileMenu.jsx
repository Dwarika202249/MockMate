import { useState, useRef, useEffect } from "react";
import { FaUserCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";

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
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#501a89] text-white font-bold uppercase focus:outline-none"
      >
        {userData?.photoURL ? (
          <img
            src={userData.photoURL}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          avatarLetter || "U"
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#7e2ed4] text-white flex items-center justify-center font-bold text-lg uppercase">
                {userData?.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  avatarLetter || "U"
                )}
              </div>
              <div>
                <p className="font-semibold">{userData?.name || "User"}</p>
                <p className="text-sm text-gray-500">{userData?.email}</p>
              </div>
            </div>
          </div>
          <div className="py-2">
            <Link
              to="/dashboard"
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FaUser /> Profile
            </Link>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              onClick={() => alert("Manage account clicked")}
            >
              <FaUserCog /> Manage Account
            </button>

            <Link
              to="/dashboard/settings"
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <IoSettingsOutline /> Settings
            </Link>

            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
              onClick={onSignOut}
            >
              <FaSignOutAlt /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
