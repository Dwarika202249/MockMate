import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const StartInterview = ({ onClose }) => {
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('basic');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/interview/start`, {
        type,
        details,
        numQuestions,
        difficulty,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const { interviewId } = response.data;

      // Navigate to the InterviewPage with the interviewId
      navigate(`/interview/${interviewId}`);
      onClose(); // Close the modal after navigating
    } catch (error) {
      setMessage('Error creating interview. Please try again.');
      console.error('Error starting the interview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-center text-3xl font-bold mb-6 text-indigo-900">Start an Interview</h2>
      {message && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold text-indigo-700">Interview Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder='Technical, Behaviour, etc..'
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-indigo-700">Details:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            placeholder='Provide specific details like job role is Frontend engineer, and so on..'
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-indigo-700">Number of Questions:</label>
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-indigo-700">Difficulty Level:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
          disabled={loading}
        >
          {loading ? 'Starting...' : 'Start Interview'}
        </button>
      </form>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Loader /> 
        </div>
      )}
    </div>
  );
};

export default StartInterview;
