import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Loader from "./Loader";

const InterviewDetails = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/interview/${interviewId}/details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setInterview(response.data.interview);
        setFeedback(response.data.feedback);
        setLoading(false);
      } catch (error) {
        setError("Error fetching interview details");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [interviewId]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="m-10">
        {interview && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-indigo-700">
              {interview.type} Interview
            </h2>
            <p className="text-gray-700 mb-2 capitalize">{interview.details}</p>
            <p className="text-sm text-gray-500 mb-6">
              Date: {new Date(interview.createdAt).toLocaleDateString()}
            </p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Questions & Answers
              </h3>
              <ul className="mt-4 space-y-4">
                {interview.questions.map((question, index) => (
                  <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-900 font-medium">
                      Q{index + 1}: {question}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Answer:</strong> {feedback.answers[index]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Feedback</h3>
              <p className="mt-4 text-gray-600 whitespace-pre-line">
                {feedback.feedback}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InterviewDetails;
