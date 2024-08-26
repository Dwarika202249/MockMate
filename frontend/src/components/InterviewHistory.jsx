import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import DeleteModal from "./DeleteModal";
import Loader from "./Loader";
import Pagination from "./Pagination";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 4; // Number of interviews to show per page

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/interview/history?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setInterviews(response.data.interviews);
        setTotalPages(Math.ceil(response.data.totalCount / ITEMS_PER_PAGE));
        setLoading(false);
      } catch (error) {
        setError("Error fetching interview history");
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
      setInterviews(interviews.filter((interview) => interview._id !== selectedInterview));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting interview:", error);
      setError("Error deleting interview");
      setShowModal(false);
    }
  };

  // Utility function to truncate text based on word limit
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-10 text-indigo-700">Interview History</h2>
      <div className="space-y-4 md:flex md:flex-wrap md:justify-between md:items-center md:w-full">
        {interviews.length ? (
          interviews.map((interview) => (
            <div
              key={interview._id}
              className="bg-white p-6 rounded-lg shadow-md relative md:w-[45%] md:h-[200px] overflow-hidden"
            >
              <h3 className="text-xl text-indigo-500 font-semibold mb-2">{interview.type}</h3>
              <p className="capitalize text-sm md:text-base">
                {truncateText(interview.details, 15)}
              </p>
              <p className="text-sm text-gray-600 mt-1 mb-2">
                Date: {new Date(interview.createdAt).toLocaleDateString()}
              </p>
              <Link
                to={`/history/${interview._id}/details`}
                className="text-blue-500 hover:underline absolute bottom-2"
              >
                View Details
              </Link>
              <AiFillDelete
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                onClick={() => handleDelete(interview._id)}
                size={24}
              />
            </div>
          ))
        ) : (
          <div className="mt-12 flex justify-center items-center">
            <h2 className="font-bold text-2xl">No Interview Details</h2>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <DeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={deleteInterview}
      />
    </div>
  );
};

export default InterviewHistory;
