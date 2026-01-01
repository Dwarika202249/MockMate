import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import Feedback from "../../components/feedback/Feedback";
import CancelModal from "../../components/common/DeleteModal";
import PauseModal from "../../components/common/PauseModal";
import QuestionDisplay from "../../components/interview/QuestionDisplay";
import RecordingControls from "../../components/interview/RecordingControls";
import NavigationButtons from "../../components/shared/NavigationButtons";
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

  return (
    <div>
      <h2 className="m-6 mt-28 text-4xl text-indigo-900 font-bold mb-4">Interview</h2>
      <div className="relative flex flex-col md:flex-row">
        <div className="absolute top-4 md:-top-4 right-4 flex gap-2">
          <button
            onClick={() => setShowPauseModal(true)}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Pause Interview
          </button>
          <button
            onClick={() => setShowCancelModal(true)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Cancel Interview
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row flex-grow">
          <div className="flex-1 md:w-2/3">
            <div className="flex items-center justify-between">
              <QuestionDisplay
                currentQuestion={questions[currentQuestionIndex]}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                answer={answers[currentQuestionIndex] || ""}
                onAnswerChange={handleAnswerChange}
              />
              <div className="ml-4 text-right">
                <div className="text-sm text-gray-500">Total Time</div>
                <div className="text-2xl font-semibold text-indigo-700">
                  {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-row md:flex-row justify-between">
              <RecordingControls
                listening={listening}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
              />
              <NavigationButtons
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                onNext={handleNextQuestion}
                onSubmit={handleSubmitAnswers}
                isSubmitting={isSubmitting}
                currentAnswer={answers[currentQuestionIndex]}
              />
            </div>
          </div>
          <div className="md:w-1/3 md:pl-4 mt-4 md:mt-0">
            <VideoRecorder onSave={handleVideoSave} />
          </div>
        </div>
      </div>
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
