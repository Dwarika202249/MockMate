import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkCredits } from '../../redux/slices/creditsSlice';
import Loader from '../common/Loader';
import InsufficientCreditsModal from '../common/InsufficientCreditsModal';

const FreeInterview = ({ onClose }) => {
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('basic');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.credits);

  // Dynamic credit cost: 1 credit per question for free interview
  const REQUIRED_CREDITS = numQuestions;

  useEffect(() => {
    // Check credits when component mounts or numQuestions changes
    dispatch(checkCredits(REQUIRED_CREDITS));
  }, [dispatch, REQUIRED_CREDITS]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user has enough credits
    if (balance < REQUIRED_CREDITS) {
      setShowInsufficientCredits(true);
      return;
    }
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

      // Support both response shapes: { interviewId } and { interview }
      const interviewId = response.data.interviewId || response.data?.interview?._id;

      if (!interviewId) {
        setMessage('Failed to start interview. Invalid server response.');
        setLoading(false);
        return;
      }

      // Navigate to the preparation page first (allows questions to generate)
      navigate(`/interview/prepare/${interviewId}`);
      onClose(); // Close the modal after navigating
    } catch (error) {
      const serverMsg = error.response?.data?.message || 'Error creating interview. Please try again.';
      setMessage(serverMsg);
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
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            min={3}
            max={10}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <p className="text-xs text-gray-600 mt-1">Choose between 3 to 10 questions</p>
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
        
        {/* Credits Info */}
        <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-sm text-purple-800">
            <strong>Credits Required:</strong> {REQUIRED_CREDITS} AI credits ({numQuestions} questions × 1 credit)
            <br />
            <strong>Your Balance:</strong> {balance} credits
          </p>
        </div>
        
        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading || balance < REQUIRED_CREDITS}
        >
          {loading ? 'Starting...' : balance < REQUIRED_CREDITS ? 'Insufficient Credits' : 'Start Interview'}
        </button>
      </form>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Loader /> 
        </div>
      )}
      
      <InsufficientCreditsModal
        show={showInsufficientCredits}
        onClose={() => setShowInsufficientCredits(false)}
        required={REQUIRED_CREDITS}
        balance={balance}
        interviewType="free"
      />
    </div>
  );
};

export default FreeInterview;
