import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkCredits } from '../../redux/slices/creditsSlice';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiClipboardList, HiAdjustments, HiSparkles } from 'react-icons/hi';
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

  const difficultyOptions = [
    { value: 'basic', label: 'Basic', color: 'from-green-500 to-emerald-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'from-yellow-500 to-orange-500' },
    { value: 'advanced', label: 'Advanced', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 backdrop-blur-md border border-purple-500/30 mb-4">
          <HiLightningBolt className="w-8 h-8 text-purple-300" />
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
          Quick Interview
        </h2>
        <p className="text-gray-400 mt-2">Customize your practice session</p>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-300 rounded-xl flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-red-400">!</span>
          </div>
          <span>{message}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Interview Type */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
            <HiClipboardList className="w-4 h-4 text-purple-400" />
            Interview Type
          </label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3.5 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all"
            placeholder="e.g., Technical, Behavioral, System Design..."
            required
          />
        </div>

        {/* Details */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
            <HiSparkles className="w-4 h-4 text-purple-400" />
            Details & Context
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full px-4 py-3.5 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all resize-none"
            rows="3"
            placeholder="Describe your target role, tech stack, or specific topics you want to practice..."
            required
          />
        </div>

        {/* Number of Questions */}
        <div>
          <label className="flex items-center justify-between text-gray-300 text-sm font-medium mb-3">
            <span className="flex items-center gap-2">
              <HiAdjustments className="w-4 h-4 text-purple-400" />
              Number of Questions
            </span>
            <span className="text-purple-400 font-bold text-lg">{numQuestions}</span>
          </label>
          <div className="relative">
            <input
              type="range"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              min={3}
              max={10}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-indigo-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>3 min</span>
              <span>10 max</span>
            </div>
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-3">
            <HiLightningBolt className="w-4 h-4 text-purple-400" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                  difficulty === option.value
                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg scale-105`
                    : 'bg-white/5 border border-purple-500/30 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Credits Info */}
        <div className="p-4 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Credits Required</p>
              <p className="text-gray-500 text-xs mt-0.5">{numQuestions} questions × 1 credit</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {REQUIRED_CREDITS}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-500/20 flex items-center justify-between">
            <span className="text-gray-400 text-sm">Your Balance</span>
            <span className={`font-semibold ${balance >= REQUIRED_CREDITS ? 'text-green-400' : 'text-red-400'}`}>
              {balance} credits
            </span>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || balance < REQUIRED_CREDITS}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            loading || balance < REQUIRED_CREDITS
              ? 'bg-gray-700/50 cursor-not-allowed text-gray-500'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              Preparing Interview...
            </>
          ) : balance < REQUIRED_CREDITS ? (
            <>
              <span>💳</span>
              Insufficient Credits
            </>
          ) : (
            <>
              <HiLightningBolt className="w-5 h-5" />
              Start Interview
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a0b2e]/80 backdrop-blur-sm rounded-2xl">
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
