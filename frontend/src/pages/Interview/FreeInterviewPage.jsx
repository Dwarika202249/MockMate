import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FiMic, FiMicOff, FiPlay, FiPause, FiX, FiClock, FiCheckCircle, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import Feedback from "../../components/feedback/Feedback";
import CancelModal from "../../components/common/DeleteModal";
import PauseModal from "../../components/common/PauseModal";
import VideoRecorder from "../../components/interview/VideoRecorder";
import { useWebSocket } from "../../hooks/useWebSocket";

const FreeInterviewPage = () => {
  const { interviewId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [interviewMeta, setInterviewMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [isPendingQuestions, setIsPendingQuestions] = useState(false);
  const MAX_POLL_ATTEMPTS = 12; // ~1 minute if interval is 5s

  // Refs to track latest values for auto-save without re-creating interval
  const stateRef = useRef({ currentQuestionIndex: 0, elapsedTime: 0, answers: {} });

  const navigate = useNavigate();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // WebSocket helpers (used for real-time QUESTIONS_READY notification)
  const { socket, isConnected, emit, subscribe } = useWebSocket();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/interview/${interviewId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const interviewData = response.data.interview || response.data;

        const fetchedQuestions = interviewData.questions || [];
        // console.log('📊 Fetched interview data:', { 
        //   id: interviewData._id,
        //   hasQuestions: !!fetchedQuestions.length,
        //   questionCount: fetchedQuestions.length,
        //   firstQuestionType: fetchedQuestions[0] ? typeof fetchedQuestions[0] : 'N/A',
        //   status: interviewData.status
        // });
        
        setQuestions(fetchedQuestions);
        
        // Restore paused state if exists
        if (interviewData.pausedState) {
          setCurrentQuestionIndex(interviewData.pausedState.currentQuestionIndex || 0);
          setElapsedTime(interviewData.pausedState.elapsedTime || 0);
          setAnswers(interviewData.pausedState.answers || {});
        }
        
        // Start timer after state restoration
        setIsTimerActive(true);
        
        setInterviewMeta({
          type: interviewData.type || interviewData?.preferences?.interviewStyle || 'free',
          details: interviewData.details || '',
          difficulty: interviewData?.preferences?.difficulty || 'basic',
        });

        // If questions are not yet generated, enable pending state to start polling
        if (!fetchedQuestions.length) {
          setIsPendingQuestions(true);
          
          // Emit WebSocket event to initialize interview and consume credits
          if (isConnected && emit) {
            emit('INITIALIZE_INTERVIEW', {
              interviewId: interviewId,
              userId: interviewData.user?._id || interviewData.user
            });
          }
        } else {
          setIsPendingQuestions(false);
        }
      } catch (error) {
        console.error("Error fetching interview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();

    // (Polling handled in separate effect)
    return () => {};
  }, [interviewId]); // Removed emit dependency to prevent re-triggering

  // Polling effect: triggers when questions are pending
  useEffect(() => {
    if (!isPendingQuestions) return;

    setPollingAttempts(0);
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      setPollingAttempts(attempts);

      try {
        const r = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/interview/${interviewId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const updated = r.data.interview || r.data;
        if (updated.questions && updated.questions.length > 0) {
          setQuestions(updated.questions);
          setIsPendingQuestions(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling fetch failed:', err.message || err);
      }

      if (attempts >= MAX_POLL_ATTEMPTS) {
        setIsPendingQuestions(false);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPendingQuestions, interviewId]);

  // Emit INITIALIZE_INTERVIEW when WebSocket connects and questions are pending
  useEffect(() => {
    if (!isConnected || !emit || !isPendingQuestions || !interviewId) return;
    
    // Fetch user ID and emit
    const fetchUserAndEmit = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/interview/${interviewId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const interviewData = response.data.interview || response.data;
        
        emit('INITIALIZE_INTERVIEW', {
          interviewId: interviewId,
          userId: interviewData.user?._id || interviewData.user
        });
      } catch (err) {
        console.error('Failed to emit INITIALIZE_INTERVIEW:', err);
      }
    };
    
    fetchUserAndEmit();
  }, [isConnected, emit, isPendingQuestions, interviewId]);

  // Socket subscription: if questions are pending, subscribe to QUESTIONS_READY
  // (useWebSocket is declared above to avoid duplicate declarations)

  useEffect(() => {
    if (!isPendingQuestions) return;

    let unsub = null;
    try {
      unsub = subscribe('QUESTIONS_READY', (payload) => {
        // Payload may include interviewId or _id; if not present, accept the payload globally
        if (!payload) return;
        const hasQuestions = payload.questions && payload.questions.length > 0;
        const idMatch = payload.interviewId === interviewId || payload._id === interviewId || payload.id === interviewId;
        if (hasQuestions && (!payload.interviewId && !payload._id && !payload.id)) {
          setQuestions(payload.questions);
          setIsPendingQuestions(false);
        } else if (hasQuestions && idMatch) {
          setQuestions(payload.questions);
          setIsPendingQuestions(false);
        }
      });
    } catch (err) {
      console.error('Socket subscribe failed:', err);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [isPendingQuestions, interviewId, subscribe]);

  useEffect(() => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: transcript,
    }));
  }, [transcript, currentQuestionIndex]);

  // Keep stateRef updated with latest values
  useEffect(() => {
    stateRef.current = { currentQuestionIndex, elapsedTime, answers };
  }, [currentQuestionIndex, elapsedTime, answers]);

  // Overall session timer - tracks total time spent on interview page
  useEffect(() => {
    if (!isTimerActive) return;
    
    const timer = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  // Auto-save timer state to DB every 5 seconds (so refresh preserves timer)
  useEffect(() => {
    if (!isTimerActive) return;
    
    const autoSaveInterval = setInterval(async () => {
      const { currentQuestionIndex, elapsedTime, answers } = stateRef.current;
      try {
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/api/interview/${interviewId}/pause`,
          {
            pausedState: {
              currentQuestionIndex,
              elapsedTime,
              answers
            }
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
      } catch (error) {
        console.error("Auto-save failed:", error.message);
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(autoSaveInterval);
  }, [isTimerActive, interviewId]); // Only depends on isTimerActive and interviewId

  const handleAnswerChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: event.target.value,
    });
  };

  const handleStartRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      resetTranscript();
    }
  };

  const handleSubmitAnswers = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/interview/submit`,
        {
          interviewId,
          answers,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Redirect to feedback page with interviewId so user sees full feedback
      navigate(`/feedback/${interviewId}`);
    } catch (error) {
      console.error("Error submitting answers:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelInterview = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/interview/${interviewId}/cancel`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      window.location.href = "/";
    } catch (error) {
      console.error("Error canceling interview:", error);
    }
  };

  const handlePauseInterview = async () => {
    try {
      // Stop timer before pausing
      setIsTimerActive(false);
      
      // Save current state to DB
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/interview/${interviewId}/pause`,
        {
          pausedState: {
            currentQuestionIndex,
            elapsedTime,
            answers
          }
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error pausing interview:", error);
    }
  };

  const handleVideoSave = (videoBlob) => {
    // Handle video save logic
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  if (isSubmitting) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }

  if (!questions.length && !loading) {
    if (isPendingQuestions && pollingAttempts < MAX_POLL_ATTEMPTS) {
      return (
        <div className="m-6 text-center">
          <div className="mb-4">
            <Loader />
          </div>
          <h2 className="text-2xl text-indigo-800 font-semibold">Preparing your questions...</h2>
          <p className="text-gray-600 mt-2">We are generating tailored questions for your session. This usually takes less than a minute.</p>
          <p className="text-sm text-gray-400 mt-2">Attempts: {pollingAttempts}/{MAX_POLL_ATTEMPTS}</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate('/')}
              className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // If polling exhausted or not pending, show friendly message
    return (
      <div className="m-6">
        <h2 className="text-xl text-red-600">No questions available yet. Please try again later.</h2>
        <p className="text-gray-600 mt-2">If this keeps occurring, try refreshing or check your internet / server status.</p>
      </div>
    );
  }

  if (feedback) {
    return (
      <div>
        <Feedback feedback={feedback} />
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-20 md:pt-24 pb-4 md:pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">
                AI Interview Session
              </h1>
              <p className="text-sm md:text-base text-purple-200">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2 md:gap-3"
            >
              <button
                onClick={() => setShowPauseModal(true)}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 text-sm md:text-base bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-all backdrop-blur-sm"
              >
                <FiPause className="w-4 h-4" />
                <span className="hidden sm:inline">Pause</span>
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 text-sm md:text-base bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-all backdrop-blur-sm"
              >
                <FiX className="w-4 h-4" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Mobile Timer & Progress - Show only on mobile */}
          <div className="grid grid-cols-2 gap-3 mb-4 lg:hidden">
            {/* Timer Card Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-semibold text-sm">Time</h3>
              </div>
              <div className="text-3xl font-bold text-white text-center">
                {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
              </div>
            </motion.div>

            {/* Progress Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <FiCheckCircle className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-semibold text-sm">Progress</h3>
              </div>
              <div className="text-3xl font-bold text-white text-center">
                {Math.round(progress)}%
              </div>
            </motion.div>
          </div>

          {/* Video Recorder - Fixed top-right on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-24 right-4 z-40 w-28 sm:w-36 lg:hidden"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 shadow-2xl max-h-24 overflow-hidden">
              <VideoRecorder onSave={handleVideoSave} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Left Side - Question & Answer */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              
              {/* Question Card */}
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/20 shadow-2xl"
              >
                <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base md:text-lg shrink-0">
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs md:text-sm text-purple-300 mb-2">
                      {currentQuestion?.type || 'Technical'} • {currentQuestion?.difficulty || 'Medium'}
                    </h3>
                    <p className="text-lg md:text-2xl text-white font-medium leading-relaxed break-words">
                      {currentQuestion?.text}
                    </p>
                  </div>
                </div>

                {/* Answer Input */}
                <div className="relative">
                  <textarea
                    value={answers[currentQuestionIndex] || ""}
                    onChange={handleAnswerChange}
                    placeholder="Type your answer here or use the microphone..."
                    className="w-full h-32 md:h-40 bg-white/5 border border-white/20 rounded-lg md:rounded-xl p-3 md:p-4 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-xs md:text-sm text-gray-400">
                    {answers[currentQuestionIndex]?.length || 0} characters
                  </div>
                </div>
              </motion.div>

              {/* Recording Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <button
                      onClick={listening ? handleStopRecording : handleStartRecording}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        listening
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-110'
                      }`}
                    >
                      {listening ? (
                        <FiMicOff className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      ) : (
                        <FiMic className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm md:text-base text-white font-semibold truncate">
                        {listening ? 'Recording...' : 'Voice Input'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-400">
                        {listening ? 'Tap to stop' : 'Tap to record'}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2 md:gap-3 justify-end">
                    {currentQuestionIndex > 0 && (
                      <button
                        onClick={() => {
                          setCurrentQuestionIndex(currentQuestionIndex - 1);
                          resetTranscript();
                        }}
                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 text-sm md:text-base bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
                      >
                        <FiArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                    )}
                    
                    {currentQuestionIndex < questions.length - 1 ? (
                      <button
                        onClick={handleNextQuestion}
                        disabled={!answers[currentQuestionIndex]}
                        className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        <span>Next</span>
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitAnswers}
                        disabled={isSubmitting || !answers[currentQuestionIndex]}
                        className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Submit</span>
                        <span className="sm:hidden">Done</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Stats & Video (Desktop only) */}
            <div className="hidden lg:block space-y-6">
              
              {/* Timer Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiClock className="w-6 h-6 text-purple-400" />
                  <h3 className="text-white font-semibold">Session Time</h3>
                </div>
                <div className="text-5xl font-bold text-white text-center py-4">
                  {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
                </div>
                <div className="text-center text-purple-300 text-sm">
                  Total elapsed time
                </div>
              </motion.div>

              {/* Progress Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-white font-semibold mb-4">Progress</h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                      className="text-purple-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-purple-300 text-sm">
                    {currentQuestionIndex + 1} of {questions.length} answered
                  </p>
                </div>
              </motion.div>

              {/* Video Recorder Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-white font-semibold mb-4">Video Recording</h3>
                <VideoRecorder onSave={handleVideoSave} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CancelModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelInterview}
      />
      <PauseModal
        show={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        onConfirm={handlePauseInterview}
      />
    </div>
  );
};

export default FreeInterviewPage;
