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
import Loader from "../common/Loader";
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
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-700",
        dot: "bg-green-500",
      },
      "in-progress": {
        bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
        border: "border-blue-200",
        text: "text-blue-700",
        dot: "bg-blue-500",
      },
      active: {
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
        border: "border-amber-200",
        text: "text-amber-700",
        dot: "bg-amber-500",
      },
      created: {
        bg: "bg-gradient-to-r from-gray-50 to-slate-50",
        border: "border-gray-200",
        text: "text-gray-700",
        dot: "bg-gray-500",
      },
    };

    const config = statusConfig[status] || statusConfig.created;

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text}`}
      >
        <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
  };

  const getScoreBadge = (score) => {
    if (!score) return null;

    let bgColor = "bg-gradient-to-br from-red-50 to-rose-50";
    let borderColor = "border-red-200";
    let textColor = "text-red-700";

    if (score >= 80) {
      bgColor = "bg-gradient-to-br from-green-50 to-emerald-50";
      borderColor = "border-green-200";
      textColor = "text-green-700";
    } else if (score >= 70) {
      bgColor = "bg-gradient-to-br from-amber-50 to-yellow-50";
      borderColor = "border-amber-200";
      textColor = "text-amber-700";
    }

    return (
      <div
        className={`px-4 py-2 rounded-lg border ${bgColor} ${borderColor} text-center`}
      >
        <div className={`text-2xl font-bold ${textColor}`}>{score}</div>
        <div className={`text-xs font-semibold ${textColor}`}>Score</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
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
          <FiList className="text-purple-600 flex-shrink-0" size={24} />
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
            Interview History
          </h1>
        </div>
        <p className="text-sm sm:text-lg text-gray-600 mt-2">
          Track your performance
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Empty State */}
      {interviews.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
            <FiBriefcase size={40} className="text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Interviews Yet
          </h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Start your first interview to see your progress and performance
            metrics here.
          </p>
          <button
            onClick={() => navigate("/resume")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
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
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200"
            >
              {/* Card Header with Gradient */}
              <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600"></div>

              <div className="p-4 sm:p-6">
                {/* Top Section: Role and Status */}
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 capitalize flex items-center gap-2 mb-2 truncate">
                      <FiBriefcase size={18} className="text-purple-600 flex-shrink-0" />
                      <span className="truncate">{interview.resume?.jobRole || "Interview"}</span>
                    </h3>
                    {getStatusBadge(interview.status)}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-3 sm:my-4"></div>

                {/* Interview Details */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 text-sm">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <FiCalendar size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 text-xs sm:text-sm">
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
                      <FiClock size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {Math.round(interview.duration / 60)} minutes
                      </span>
                    </div>
                  )}

                  {/* Score Display */}
                  {interview.summary?.overallScore && (
                    <div className="mt-3 sm:mt-4">
                      {getScoreBadge(interview.summary.overallScore)}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-3 sm:my-4"></div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate(`/feedback/${interview._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:shadow-lg transition-all duration-300 group/btn"
                  >
                    <FiEye size={16} className="hidden sm:inline" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => handleDelete(interview._id)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 text-red-600 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-100 transition-all duration-300 border border-red-200"
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
  );
};

export default InterviewHistory;
