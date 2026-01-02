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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
        <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] mx-auto"></div>
          <p className="mt-4 text-gray-200 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] p-4 sm:p-6 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <FiUser className="text-white drop-shadow-lg" size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 truncate drop-shadow-lg">
              Settings
            </h1>
            <p className="text-sm sm:text-lg text-gray-300 mt-1">
              Manage your account
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2">
          {/* Profile Settings Card */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 sm:p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 mb-6">
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-purple-500/40">
                  <FiUser className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Profile
                </h2>
              </div>

              <form onSubmit={handleSaveChanges} className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    <FiUser size={16} className="text-purple-400 flex-shrink-0 drop-shadow-[0_0_4px_rgba(168,85,247,0.4)]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 backdrop-blur-md border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base text-white placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    <FiMail size={16} className="text-indigo-400 flex-shrink-0 drop-shadow-[0_0_4px_rgba(99,102,241,0.4)]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 backdrop-blur-md border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    <FiLock size={16} className="text-pink-400 flex-shrink-0 drop-shadow-[0_0_4px_rgba(236,72,153,0.4)]" />
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 backdrop-blur-md border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base text-white placeholder-gray-400"
                    placeholder="Leave blank to keep current"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                {/* Confirm Password Field */}
                {password && (
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                      <FiLock size={16} className="text-pink-400 flex-shrink-0 drop-shadow-[0_0_4px_rgba(236,72,153,0.4)]" />
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 backdrop-blur-md border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base text-white placeholder-gray-400"
                      placeholder="Re-enter your password"
                    />
                  </div>
                )}

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base border border-purple-500/30"
                >
                  <FiSave size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Account Status Card */}
          <div className="relative bg-green-500/10 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border border-green-500/30 hover:border-green-500/50 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <FiCheck size={20} className="text-green-400 flex-shrink-0 drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                <h3 className="text-base sm:text-lg font-bold text-green-300">
                  Account Active
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">
                Your account is in good standing.
              </p>
            </div>
          </div>

          {/* Security Info Card */}
          <div className="relative bg-blue-500/10 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-3">
                <FiAlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-1 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-blue-300 mb-2">
                    Security Tips
                  </h3>
                  <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                    <li>• Use strong password</li>
                    <li>• Don't share credentials</li>
                    <li>• Enable 2FA</li>
                    <li>• Review sessions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="relative bg-red-500/10 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-base sm:text-lg font-bold text-red-300 mb-3 sm:mb-4">
                Danger Zone
              </h3>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] text-white py-2 sm:py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-sm sm:text-base border border-red-500/30"
              >
                <FiLogOut size={18} />
                Logout
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                All sessions will end
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Settings;
