import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiMic, FiVideo, FiSmile, FiLoader } from 'react-icons/fi';
import { useWebSocket } from '../../hooks/useWebSocket';
import axios from 'axios';

const FreeInterviewPreparationPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [interviewData, setInterviewData] = useState(null);
  const [questionsReady, setQuestionsReady] = useState(false);
  const { socket, isConnected, emit, subscribe } = useWebSocket();

  const tips = [
    {
      icon: <FiSmile className="w-6 h-6" />,
      text: "Maintain a positive and professional attitude"
    },
    {
      icon: <FiMic className="w-6 h-6" />,
      text: "Speak clearly and at a moderate pace"
    },
    {
      icon: <FiVideo className="w-6 h-6" />,
      text: "Keep good eye contact with the camera"
    }
  ];

  // Fetch interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/interview/${interviewId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = response.data.interview || response.data;
        setInterviewData(data);

        // Check if questions already exist
        if (data.questions && data.questions.length > 0) {
          setQuestionsReady(true);
        }
      } catch (error) {
        console.error('Error fetching interview:', error);
      }
    };

    fetchInterview();
  }, [interviewId]);

  // Emit INITIALIZE_INTERVIEW when socket connects
  useEffect(() => {
    if (!isConnected || !emit || !interviewData || questionsReady) return;

    emit('INITIALIZE_INTERVIEW', {
      interviewId: interviewId,
      userId: interviewData.user?._id || interviewData.user
    });
  }, [isConnected, emit, interviewId, interviewData, questionsReady]);

  // Subscribe to QUESTIONS_READY event
  useEffect(() => {
    if (!subscribe) return;

    const unsubscribe = subscribe('QUESTIONS_READY', (payload) => {
      if (!payload) return;
      
      const idMatch = 
        payload.interviewId === interviewId || 
        payload._id === interviewId || 
        payload.id === interviewId;
      
      if (payload.questions && payload.questions.length > 0 && (idMatch || !payload.interviewId)) {
        setQuestionsReady(true);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe, interviewId]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !questionsReady) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 || questionsReady) {
      // Wait a bit more if questions not ready
      if (!questionsReady && countdown === 0) {
        // Keep waiting, show loading spinner
        return;
      }
      // Navigate to interview page when ready
      if (questionsReady) {
        setTimeout(() => {
          navigate(`/interview/${interviewId}`);
        }, 500);
      }
    }
  }, [countdown, questionsReady, interviewId, navigate]);

  if (!interviewData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f2e]">
        <FiLoader className="w-12 h-12 text-[#9589e6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f2e]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full mx-4 text-center"
      >
        <h2 className="text-3xl font-bold text-[#9589e6] mb-8">
          {questionsReady ? 'Interview Ready!' : 'Preparing Your Interview'}
        </h2>
        
        <div className="bg-[#2a1f3e] rounded-xl p-6 mb-8">
          <div className="flex justify-center mb-6">
            {questionsReady ? (
              <motion.div 
                className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            ) : countdown > 0 ? (
              <motion.div 
                className="w-24 h-24 rounded-full bg-[#9589e6] flex items-center justify-center text-3xl font-bold text-white"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                {countdown}
              </motion.div>
            ) : (
              <motion.div 
                className="w-24 h-24 rounded-full bg-[#9589e6] flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <FiLoader className="w-12 h-12 text-white" />
              </motion.div>
            )}
          </div>
          
          <p className="text-gray-300 text-lg mb-4">
            {questionsReady 
              ? 'Starting your interview...' 
              : countdown > 0 
                ? `Your interview will begin in ${countdown} seconds`
                : 'Generating questions for you...'
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#1a0f2e] p-4 rounded-lg flex items-center space-x-3"
              >
                <div className="text-[#9589e6]">
                  {tip.icon}
                </div>
                <p className="text-gray-300 text-sm">
                  {tip.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-gray-400 text-sm">
          <FiClock className="inline mr-2" />
          Questions: {interviewData.preferences?.numQuestions || 5} | 
          Difficulty: {interviewData.preferences?.difficulty || 'medium'}
        </div>
      </motion.div>
    </div>
  );
};

export default FreeInterviewPreparationPage;
