import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiLogOut,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

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
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/update-profile`,
        {
          name,
          email,
          ...(password && { password }),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 1000);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <FiUser className="text-purple-600 flex-shrink-0" size={28} />
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
            Settings
          </h1>
        </div>
        <p className="text-sm sm:text-lg text-gray-600 mt-2">
          Manage your account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2">
          {/* Profile Settings Card */}
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                <FiUser className="text-purple-600" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Profile
              </h2>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  <FiUser size={16} className="text-purple-600 flex-shrink-0" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  <FiMail size={16} className="text-purple-600 flex-shrink-0" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  <FiLock size={16} className="text-purple-600 flex-shrink-0" />
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all text-sm sm:text-base"
                  placeholder="Leave blank to keep current"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              {password && (
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <FiLock size={16} className="text-purple-600 flex-shrink-0" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all text-sm sm:text-base"
                    placeholder="Re-enter your password"
                  />
                </div>
              )}

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <FiSave size={18} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Account Status Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-4 sm:p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <FiCheck size={20} className="text-green-600 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-green-800">
                Account Active
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-green-700">
              Your account is in good standing.
            </p>
          </div>

          {/* Security Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md p-4 sm:p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <FiAlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-blue-800 mb-2">
                  Security Tips
                </h3>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                  <li>• Use strong password</li>
                  <li>• Don't share credentials</li>
                  <li>• Enable 2FA</li>
                  <li>• Review sessions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-md p-4 sm:p-6 border border-red-200">
            <h3 className="text-base sm:text-lg font-bold text-red-800 mb-3 sm:mb-4">
              Danger Zone
            </h3>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
            >
              <FiLogOut size={18} />
              Logout
            </button>
            <p className="text-xs text-red-600 mt-2 text-center">
              All sessions will end
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
