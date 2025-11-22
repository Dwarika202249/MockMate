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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      {/* Header Section */}
      <motion.div
        className="mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
            <FiUser className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
              Welcome, {userData?.name}! 👋
            </h1>
            <p className="text-xs sm:text-base text-gray-600 mt-1">
              Ready for your interview?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* User Details Card */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-xl shadow-md p-4 sm:p-8 border border-gray-100 hover:border-purple-200 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
              <FiUser className="text-purple-600" size={20} />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Account Info</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
              <FiMail className="text-purple-600 flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
                  {userData?.email}
                </p>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <FiCalendar className="text-green-600 flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Member Since
                </p>
                <p className="text-sm sm:text-lg font-semibold text-gray-800">
                  {dayjs(userData?.createdAt).format("DD MMM YYYY")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Joined {dayjs(userData?.createdAt).fromNow()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Card */}
        <motion.div
          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-4 sm:p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <FiBarChart2 size={24} className="flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold">Quick Start</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
              Start your interview or continue preparing.
            </p>

            <button
              onClick={handleOpenModal}
              className="w-full bg-white text-purple-600 py-2 sm:py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-105 group text-sm sm:text-base"
            >
              <FiPlus size={20} className="group-hover:rotate-90 transition-transform" />
              Start Interview
            </button>

            <div className="pt-3 sm:pt-4 border-t border-purple-400/30 space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p className="flex items-center gap-2">
                <span className="text-lg">✓</span> Get instant feedback
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">✓</span> Track progress
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">✓</span> Improve skills
              </p>
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
          className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 truncate">
                Progress
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Monitor performance
              </p>
            </div>
            <FiArrowRight className="text-purple-600 group-hover:translate-x-2 transition-transform flex-shrink-0" size={20} />
          </div>
          <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-0 group-hover:w-full transition-all duration-300"></div>
        </a>

        {/* Interview History Card */}
        <a
          href="/dashboard/interview-history"
          className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 truncate">
                History
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Review interviews
              </p>
            </div>
            <FiArrowRight className="text-blue-600 group-hover:translate-x-2 transition-transform flex-shrink-0" size={20} />
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-0 group-hover:w-full transition-all duration-300"></div>
        </a>

        {/* Resume Card */}
        <a
          href="/dashboard/resume"
          className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 truncate">
                Resume
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Take Resume Interview
              </p>
            </div>
            <FiArrowRight className="text-green-600 group-hover:translate-x-2 transition-transform flex-shrink-0" size={20} />
          </div>
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-0 group-hover:w-full transition-all duration-300"></div>
        </a>
      </motion.div>

      {/* Modal for FreeInterview */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 relative"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
              >
                <FiX size={24} className="text-gray-600" />
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
  );
};

export default Dashboard;
