import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import DeleteModal from "./DeleteModal"; // Import the Modal component

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/interview/history",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setInterviews(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching interview history");
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = (interviewId) => {
    setSelectedInterview(interviewId);
    setShowModal(true);
  };

  const deleteInterview = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/interview/${selectedInterview}/delete`,
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Interview History</h2>
      <div className="space-y-4">
        {interviews.length ? (
          interviews.map((interview) => (
            <div key={interview._id} className="bg-white p-6 rounded-lg shadow-md relative">
              <h3 className="text-xl text-indigo-500 font-semibold mb-2">{interview.type}</h3>
              <p className="capitalize">{interview.details}</p>
              <p className="text-sm text-gray-600">
                Date: {new Date(interview.createdAt).toLocaleDateString()}
              </p>
              <Link to={`/history/${interview._id}/details`} className="text-blue-500 hover:underline">
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

      <DeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={deleteInterview}
      />
    </div>
  );
};

export default InterviewHistory;
