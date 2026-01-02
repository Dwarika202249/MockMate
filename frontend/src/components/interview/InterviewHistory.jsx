import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiEye,
  FiCalendar,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiList,
} from "react-icons/fi";
import DeleteModal from "../common/DeleteModal";
import Pagination from "../shared/Pagination";
import toast from "react-hot-toast";

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/interview/history?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setInterviews(response.data.interviews);
        setTotalPages(response.data.pagination.totalPages);
        setError(null);
      } catch (error) {
        console.error("Error fetching interview history:", error);
        setError("Failed to load interview history");
        toast.error("Failed to load interview history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage]);

  const handleDelete = (interviewId) => {
    setSelectedInterview(interviewId);
    setShowModal(true);
  };

  const deleteInterview = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/interview/${selectedInterview}/delete`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setInterviews(
        interviews.filter((interview) => interview._id !== selectedInterview)
      );
      setShowModal(false);
      toast.success("Interview deleted successfully");
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview");
      setShowModal(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: "bg-green-500/10 backdrop-blur-md",
        border: "border-green-500/30",
        text: "text-green-400",
        dot: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
      },
      "in-progress": {
        bg: "bg-blue-500/10 backdrop-blur-md",
        border: "border-blue-500/30",
        text: "text-blue-400",
        dot: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]",
      },
      active: {
        bg: "bg-amber-500/10 backdrop-blur-md",
        border: "border-amber-500/30",
        text: "text-amber-400",
        dot: "bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      },
      created: {
        bg: "bg-gray-500/10 backdrop-blur-md",
        border: "border-gray-500/30",
        text: "text-gray-400",
        dot: "bg-gray-500 shadow-[0_0_8px_rgba(107,114,128,0.6)]",
      },
    };

    const config = statusConfig[status] || statusConfig.created;

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text}`}
      >
        <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
  };

  const getScoreBadge = (score) => {
    if (!score) return null;

    let bgColor = "bg-red-500/10 backdrop-blur-md";
    let borderColor = "border-red-500/30";
    let textColor = "text-red-400";
    let glowColor = "shadow-[0_0_15px_rgba(239,68,68,0.3)]";

    if (score >= 80) {
      bgColor = "bg-green-500/10 backdrop-blur-md";
      borderColor = "border-green-500/30";
      textColor = "text-green-400";
      glowColor = "shadow-[0_0_15px_rgba(34,197,94,0.3)]";
    } else if (score >= 70) {
      bgColor = "bg-amber-500/10 backdrop-blur-md";
      borderColor = "border-amber-500/30";
      textColor = "text-amber-400";
      glowColor = "shadow-[0_0_15px_rgba(251,191,36,0.3)]";
    }

    return (
      <div
        className={`px-4 py-2 rounded-xl border ${bgColor} ${borderColor} ${glowColor} text-center`}
      >
        <div className={`text-2xl font-bold ${textColor} drop-shadow-lg`}>{score}</div>
        <div className={`text-xs font-semibold ${textColor}`}>Score</div>
      </div>
    );
  };

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
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
            </div>
            <p className="mt-4 text-gray-200 font-medium">
              Loading interview history...
            </p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header Section */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <FiList className="text-white drop-shadow-lg" size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 truncate drop-shadow-lg">
              Interview History
            </h1>
            <p className="text-sm sm:text-lg text-gray-300 mt-1">
              Track your performance
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 mb-6">
          <p className="text-red-300 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Empty State */}
      {interviews.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-md flex items-center justify-center mb-4 border border-purple-500/40">
            <FiBriefcase size={40} className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Interviews Yet
          </h3>
          <p className="text-gray-300 mb-6 text-center max-w-md">
            Start your first interview to see your progress and performance
            metrics here.
          </p>
          <button
            onClick={() => navigate("/dashboard/resume")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 border border-purple-500/30 backdrop-blur-md"
          >
            Start Interview
          </button>
        </div>
      )}

      {/* Interview Cards Grid */}
      {interviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {interviews.map((interview) => (
            <div
              key={interview._id}
              className="group relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] transition-all duration-300 overflow-hidden border border-purple-500/30 hover:border-purple-500/50"
            >
              {/* Card Header with Gradient */}
              <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 p-4 sm:p-6">
                {/* Top Section: Role and Status */}
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white capitalize flex items-center gap-2 mb-2 truncate">
                      <FiBriefcase size={18} className="text-purple-400 flex-shrink-0 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
                      <span className="truncate">
                        {interview.type === 'free' 
                          ? "Free Interview" 
                          : interview.resume?.jobRole 
                            ? `${interview.resume.jobRole}` 
                            : "Resume-based Interview"
                        }
                      </span>
                    </h3>
                    {getStatusBadge(interview.status)}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-purple-500/20 my-3 sm:my-4"></div>

                {/* Interview Details */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 text-sm">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <FiCalendar size={16} className="text-purple-400 flex-shrink-0 drop-shadow-[0_0_4px_rgba(168,85,247,0.4)]" />
                    <span className="text-gray-300 text-xs sm:text-sm">
                      {new Date(interview.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {/* Duration */}
                  {interview.duration && (
                    <div className="flex items-center gap-3">
                      <FiClock size={16} className="text-indigo-400 flex-shrink-0 drop-shadow-[0_0_4px_rgba(99,102,241,0.4)]" />
                      <span className="text-gray-300 text-xs sm:text-sm">
                        {Math.round(interview.duration / 60)} minutes
                      </span>
                    </div>
                  )}

                  {/* Score Display */}
                  {interview.status === 'completed' && (interview.summary?.overallScore || interview.summary?.averageScore) ? (
                    <div className="mt-3 sm:mt-4">
                      {getScoreBadge(interview.summary.overallScore || interview.summary.averageScore)}
                    </div>
                  ) : (
                    <div className="mt-3 sm:mt-4">
                      <div className="px-4 py-2 rounded-xl border bg-white/5 backdrop-blur-md border-purple-500/30 text-center">
                        <div className="text-xs font-semibold text-gray-400">Complete interview to see score</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-purple-500/20 my-3 sm:my-4"></div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  {interview.status !== 'completed' && interview.status !== 'cancelled' && interview.status !== 'deleted' ? (
                    <button
                      onClick={() => {
                        // Navigate based on interview type
                        const route = interview.type === 'free' 
                          ? `/interview/${interview._id}` 
                          : `/resume-interview/${interview._id}`;
                        navigate(route);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl font-semibold text-xs sm:text-sm hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all duration-300 group/btn border border-yellow-500/30"
                    >
                      <FiClock size={16} className="hidden sm:inline" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/feedback/${interview._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-xs sm:text-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 group/btn border border-purple-500/30"
                    >
                      <FiEye size={16} className="hidden sm:inline" />
                      <span>Details</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(interview._id)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/10 backdrop-blur-md text-red-400 rounded-xl font-semibold text-xs sm:text-sm hover:bg-red-500/20 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-300 border border-red-500/30"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && interviews.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={deleteInterview}
        title="Delete Interview"
        message="Are you sure you want to delete this interview? This action cannot be undone."
      />
        </>
      )}
      </div>
    </div>
  );
};

export default InterviewHistory;
