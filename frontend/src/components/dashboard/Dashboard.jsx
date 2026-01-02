import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import FreeInterview from "../interview/FreeInterview";
import Loader from "../common/Loader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  FiPlus,
  FiUser,
  FiMail,
  FiCalendar,
  FiX,
  FiArrowRight,
  FiBarChart2,
} from "react-icons/fi";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
        <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
          </div>
          <p className="mt-4 text-gray-200 font-medium">
            Loading your dashboard...
          </p>
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
      <motion.div
        className="mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            <FiUser className="text-white drop-shadow-lg" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 truncate drop-shadow-lg">
              Welcome, {userData?.name}! 👋
            </h1>
            <p className="text-xs sm:text-base text-gray-300 mt-1">
              Ready for your interview?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* User Details Card */}
        <motion.div
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-purple-500/40">
                <FiUser className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" size={20} />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">Account Info</h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-md rounded-xl border border-purple-500/40">
                <FiMail className="text-purple-400 flex-shrink-0 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-sm sm:text-lg font-semibold text-white truncate">
                    {userData?.email}
                  </p>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-xl border border-green-500/40">
                <FiCalendar className="text-green-400 flex-shrink-0 drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Member Since
                  </p>
                  <p className="text-sm sm:text-lg font-semibold text-white">
                    {dayjs(userData?.createdAt).format("DD MMM YYYY")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Joined {dayjs(userData?.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Card */}
        <motion.div
          className="relative bg-gradient-to-br from-purple-600/80 to-indigo-600/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(168,85,247,0.4)] p-4 sm:p-8 text-white border border-purple-400/30 hover:shadow-[0_8px_32px_rgba(168,85,247,0.6)] transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <FiBarChart2 size={24} className="flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              <h2 className="text-xl sm:text-2xl font-bold drop-shadow-lg">Quick Start</h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                Start your interview or continue preparing.
              </p>

              <button
                onClick={handleOpenModal}
                className="w-full bg-white/95 backdrop-blur-md text-purple-600 py-2 sm:py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 group text-sm sm:text-base border border-white/20"
              >
                <FiPlus size={20} className="group-hover:rotate-90 transition-transform" />
                Start Interview
              </button>

              <div className="pt-3 sm:pt-4 border-t border-white/20 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <p className="flex items-center gap-2 text-purple-100">
                  <span className="text-lg drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]">✓</span> Get instant feedback
                </p>
                <p className="flex items-center gap-2 text-purple-100">
                  <span className="text-lg drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]">✓</span> Track progress
                </p>
                <p className="flex items-center gap-2 text-purple-100">
                  <span className="text-lg drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]">✓</span> Improve skills
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Progress Card */}
        <a
          href="/dashboard/progress"
          className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] transition-all duration-300 group cursor-pointer"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold text-white mb-1 truncate">
                Progress
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 truncate">
                Monitor performance
              </p>
            </div>
            <FiArrowRight className="text-purple-400 group-hover:translate-x-2 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] transition-all flex-shrink-0" size={20} />
          </div>
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-0 group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
        </a>

        {/* Interview History Card */}
        <a
          href="/dashboard/interview-history"
          className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-[0_8px_32px_rgba(99,102,241,0.3)] transition-all duration-300 group cursor-pointer"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold text-white mb-1 truncate">
                History
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 truncate">
                Review interviews
              </p>
            </div>
            <FiArrowRight className="text-indigo-400 group-hover:translate-x-2 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all flex-shrink-0" size={20} />
          </div>
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full w-0 group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
        </a>

        {/* Resume Card */}
        <a
          href="/dashboard/resume"
          className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border border-green-500/30 hover:border-green-500/50 hover:shadow-[0_8px_32px_rgba(34,197,94,0.3)] transition-all duration-300 group cursor-pointer"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold text-white mb-1 truncate">
                Resume
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 truncate">
                Take Resume Interview
              </p>
            </div>
            <FiArrowRight className="text-green-400 group-hover:translate-x-2 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all flex-shrink-0" size={20} />
          </div>
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-0 group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </a>
      </motion.div>

      {/* Modal for FreeInterview */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-gradient-to-br from-gray-900/95 via-purple-900/90 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/30 relative"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10 border border-white/10 backdrop-blur-sm"
              >
                <FiX size={24} className="text-gray-300 hover:text-white" />
              </button>

              {/* Modal Content */}
              <div className="p-8">
                <FreeInterview onClose={handleCloseModal} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
