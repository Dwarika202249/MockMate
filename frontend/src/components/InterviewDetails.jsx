import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const InterviewDetails = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/interview/${interviewId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setInterview(response.data.interview);
        setFeedback(response.data.feedback);
        setLoading(false);
      } catch (error) {
        setError('Error fetching interview details');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [interviewId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      {interview && (
        <>
          <h2 className="text-2xl font-bold mb-4">{interview.type} Interview</h2>
          <p>{interview.details}</p>
          <p className="text-sm text-gray-600">Date: {new Date(interview.createdAt).toLocaleDateString()}</p>

          <h3 className="text-xl font-semibold mt-4">Questions & Answers</h3>
          <ul className="list-disc pl-5">
            {interview.questions.map((question, index) => (
              <li key={index} className="mb-2">
                <p><strong>Q{index + 1}:</strong> {question}</p>
                <p><strong>A:</strong> {feedback.answers[index]}</p>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mt-4">Feedback</h3>
          <p className="mt-2 whitespace-pre-line">{feedback.feedback}</p>
        </>
      )}
    </div>
  );
};

export default InterviewDetails;
