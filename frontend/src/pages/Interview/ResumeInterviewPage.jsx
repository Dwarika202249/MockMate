import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { motion, AnimatePresence } from "framer-motion";
import AvatarStage from "../../components/resume/AvatarStage";
import ChatPanel from "../../components/resume/ChatPanel";
import OnboardingModal from "../../components/resume/OnboardingModal";
import PreparationScreen from "../../components/resume/PreparationScreen";
import AnswerEvaluator from "../../utils/AnswerEvaluator";
import Loader from "../../components/common/Loader";
import { useWebSocket } from "../../hooks/useWebSocket";
import InterviewService from "../../services/InterviewService";
import PauseModal from "../../components/common/PauseModal";

// Interview Flow Constants
const INTERVIEW_STATES = {
  LOADING: 'loading',
  ONBOARDING: 'onboarding',
  PREPARING: 'preparing',
  RUNNING: 'running',
  ERROR: 'error'
};

const ResumeInterviewPage = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const { socket, isConnected, emit, subscribe } = useWebSocket();

  // Interview State Management
  const [interviewState, setInterviewState] = useState(INTERVIEW_STATES.LOADING);

  // Interview Flow States
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showPreparation, setShowPreparation] = useState(false);
  const [running, setRunning] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  
  // Interview Progress States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [listeningLive, setListeningLive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userIntroductionProvided, setUserIntroductionProvided] = useState(false); // Track user intro
  
  const silenceTimerRef = useRef(null);
  const messageCounterRef = useRef(0);  // Counter to ensure unique message IDs
  const currentIndexRef = useRef(0);  // Ref to track current question index (must be ref for reliable access)
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const generateAIIntroduction = (data) => {
    if (!data || !data.preferences) {
      return "Hi! I'm your AI interviewer. Let's begin the interview. Could you please introduce yourself?";
    }
    
    const { name, jobRole, preferences } = data;
    const personalityStyle = {
      friendly: "Hi",
      neutral: "Hello",
      challenging: "Good day"
    };
    
    const greeting = personalityStyle[preferences.interviewerPersonality] || "Hi";
    return `${greeting} ${name || "candidate"}! I'm your AI interviewer for the ${jobRole || "role"} position. I'll be conducting a ${preferences.duration || "30"}-minute ${preferences.interviewStyle || "standard"} interview.`;
  };

  const speakAI = (text, callback) => {
    setAiSpeaking(true);
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => {
      setAiSpeaking(false);
      callback && callback();
    };
    synth.speak(utter);
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("SpeechRecognition not supported.");
      // You might want to show a user-friendly error message here
    }
  }, [browserSupportsSpeechRecognition]);

  // Fetch interview data on mount
  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await InterviewService.getInterview(interviewId);
        // Handle both response formats: { interview } and direct interview object
        const interview = response.interview || response;
        
        console.log('📥 Interview data fetched:', {
          status: interview.status,
          currentQuestionIndex: interview.currentQuestionIndex,
          userIntroductionProvided: interview.userIntroductionProvided,
          hasQuestions: interview.questions?.length > 0
        });
        
        // Get the last question index for resumption
        const lastIndex = interview.currentQuestionIndex || 0;
        setCurrentIndex(lastIndex);
        currentIndexRef.current = lastIndex;

        // Load user introduction status for session persistence
        setUserIntroductionProvided(interview.userIntroductionProvided || false);

        // Check if interview is completed, cancelled, or deleted - redirect to feedback
        if (interview.status === 'completed' || interview.status === 'cancelled' || interview.status === 'deleted') {
          navigate(`/feedback/${interviewId}`);
          return;
        }
        
        // Extract resume data from populated resume field
        if (interview.resume) {
          setResumeData({
            name: interview.resume.name,
            email: interview.resume.email,
            jobRole: interview.resume.jobRole,
            summary: interview.resume.summary,
            skills: interview.resume.skills,
            experience: interview.resume.experience,
            education: interview.resume.education
          });
        }
        
        setInterviewData(interview.preferences || null);
        
        if (interview.status === 'in-progress') {
          console.log('🔄 Interview status: in-progress, showing preparation screen');
          setShowOnboarding(false);
          setShowPreparation(true);
        } else if (interview.status === 'active') {
          console.log('🎯 Interview status: active, resuming interview');
          setShowOnboarding(false);
          setShowPreparation(false);
          setRunning(true);
          setInterviewState(INTERVIEW_STATES.RUNNING);
          
          // For active interviews, will emit INITIALIZE_INTERVIEW via useEffect when socket connects
        } else {
          console.log('🚀 Interview status:', interview.status, '- showing onboarding');
          setShowOnboarding(true);
        }

        if (interview.questions?.length > 0) {
          setQuestions(interview.questions);
          console.log('✅ Questions loaded:', interview.questions.length);
        }
      } catch (error) {
        console.error('Error fetching interview:', error);
        setError('Failed to load interview data');
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };
    
    fetchInterviewData();
  }, [interviewId, navigate]);

  // Initialize WebSocket for active interviews on mount or when socket connects
  useEffect(() => {
    if (interviewState === INTERVIEW_STATES.RUNNING && isConnected && socket) {
      console.log('🔌 Emitting INITIALIZE_INTERVIEW for resumed active interview');
      emit('INITIALIZE_INTERVIEW', {
        interviewId,
        userId: socket.id,
        currentQuestionIndex: currentIndexRef.current,
        userIntroductionProvided: userIntroductionProvided
      });
    }
  }, [interviewState, isConnected, socket, interviewId]);

  const handleOnboardingComplete = async (data) => {
    try {
      setIsProcessing(true);
      console.log('handleOnboardingComplete called, isConnected:', isConnected);
      console.log('Onboarding data:', data);
      
      // Close the onboarding modal
      setShowOnboarding(false);
      
      // Update interview preferences in the backend
      const updateRes = await InterviewService.updateInterviewPreferences(interviewId, {
        ...data.preferences,
        status: 'in-progress'
      });
      console.log('Update preferences response:', updateRes);

      setInterviewData(data);
      setInterviewState(INTERVIEW_STATES.PREPARING);
      setShowPreparation(true);  // CRITICAL: Show the preparation/countdown screen

      // Wait for WebSocket connection if not connected yet
      if (!isConnected) {
        console.log('WebSocket not connected yet, waiting...');
        // Give socket time to connect
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Request question generation through WebSocket
      console.log('Emitting INITIALIZE_INTERVIEW with interviewId:', interviewId);
      emit('INITIALIZE_INTERVIEW', {
        interviewId,
        userId: socket?.id, // Include socket ID for backend reference
        currentQuestionIndex: currentIndexRef.current,
        preferences: data.preferences,
        resumeContext: {
          ...data.resumeContext,
          name: data.name,
          jobRole: data.jobRole,
          experience: data.experience
        }
      });
      console.log('INITIALIZE_INTERVIEW emitted');
    } catch (error) {
      console.error('Error starting interview:', error);
      setError('Failed to start interview');
      setInterviewState(INTERVIEW_STATES.ERROR);
      setIsProcessing(false);
    }
  };

  const handlePreparationComplete = async () => {
    try {
      console.log('🎬 handlePreparationComplete called');
      console.log('📊 Current state:', { interviewId, interviewData, questionsCount: questions.length });

      // Update interview status to active
      console.log('📝 Updating interview status to active...');
      const updateRes = await InterviewService.updateInterviewPreferences(interviewId, {
        status: 'active'
      });
      console.log('✅ Interview status updated:', updateRes);

      // Set state transitions
      setInterviewState(INTERVIEW_STATES.RUNNING);
      setRunning(true);
      setShowPreparation(false);  // Hide preparation screen
      console.log('✅ State transitions complete');
      
      // CRITICAL: Check if user already provided introduction (session resume case)
      if (userIntroductionProvided) {
        console.log('📝 User introduction already provided, resuming to question', currentIndexRef.current);
        askQuestion(currentIndexRef.current);
        return;
      }
      
      // Start with AI introduction only if this is a fresh interview
      const introMessage = generateAIIntroduction(interviewData);
      console.log('🎤 Generated intro message');
      pushAIMessage(introMessage);
      
      speakAI(introMessage, () => {
        console.log('🎤 Interviewer intro TTS finished');
        setAiSpeaking(false);
        
        // Now ask the user to introduce themselves
        const userIntroPrompt = "Thank you! Now, could you please tell me about yourself? Include your background, key skills, and why you're interested in this position.";
        console.log('🎤 Asking for user introduction');
        pushAIMessage(userIntroPrompt);
        
        speakAI(userIntroPrompt, () => {
          console.log('🎤 User intro prompt TTS finished, starting to listen');
          // Start listening for user's self-introduction
          startListening();
          setIsProcessing(false);
        });
      });
    } catch (error) {
      console.error('❌ Error in handlePreparationComplete:', error);
      setError('Failed to start interview: ' + (error.message || 'Unknown error'));
      setInterviewState(INTERVIEW_STATES.ERROR);
      setShowPreparation(false);
    }
  };

  // WebSocket event subscriptions
  useEffect(() => {
    if (!socket) {
      console.log('Socket not ready, skipping subscriptions');
      return;
    }

    console.log('Setting up WebSocket subscriptions');

    const unsubQuestions = subscribe('QUESTIONS_READY', (data) => {
      console.log('QUESTIONS_READY received:', data);
      setQuestions(data.questions);
      setIsProcessing(false);
    });

    const unsubFeedback = subscribe('ANSWER_EVALUATED', (data) => {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║          ANSWER_EVALUATED EVENT RECEIVED               ║');
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log('📊 ANSWER_EVALUATED received:', data);
      const { questionId, evaluation } = data;
      // Map evaluation back to the most recent answer for that question
      setAnswers(prev => {
        // find answer id for this question if any
        const answerEntryKey = Object.keys(prev).find(k => prev[k]?.question?.id === questionId) || null;
        if (answerEntryKey) {
          return {
            ...prev,
            [answerEntryKey]: { ...prev[answerEntryKey], evaluation }
          };
        }
        return prev;
      });

      // Push AI feedback into chat panel
      if (evaluation) {
        const feedbackText = evaluation.feedback || evaluation.label || 'Feedback received.';
        console.log('📝 Pushing feedback to chat:', feedbackText);
        setMessages((m) => [...m, { id: `ai-feedback-${Date.now()}`, sender: 'ai', text: feedbackText }]);
      }
    });

    const unsubNextQuestion = subscribe('NEXT_QUESTION', (data) => {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║             NEXT_QUESTION EVENT RECEIVED               ║');
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log('📋 NEXT_QUESTION received:', data);
      const { question } = data;
      
      // Use the question object from the event (backend is already sending it)
      // Don't rely on the questions array state due to closure issues
      if (question) {
        const nextIndex = (currentIndexRef.current || 0) + 1;
        setCurrentIndex(nextIndex);
        currentIndexRef.current = nextIndex; // Update ref immediately
        
        console.log('📋 Moving to next question at index:', nextIndex, 'Question ID:', question?.id);
        
        pushAIMessage(question.text);
        speakAI(question.text, () => {
          console.log('🎤 Question TTS finished, starting to listen');
          startListening();
        });
      } else {
        console.warn('⚠️ No question in NEXT_QUESTION event data');
      }
    });

    const unsubInterviewCompleted = subscribe('INTERVIEW_COMPLETED', (data) => {
      console.log('INTERVIEW_COMPLETED received:', data);
      const { summary, outroMessage } = data || {};
      
      setIsProcessing(false);
      setRunning(false);
      
      // Show outro message if provided, or generate a default one
      const outro = outroMessage || "Thank you for taking the time to interview with me today. You've demonstrated great skills and insight. We'll review your responses carefully and get back to you soon. Good luck!";
      
      messageCounterRef.current += 1;
      setMessages((m) => [...m, { 
        id: `ai-outro-${Date.now()}-${messageCounterRef.current}`, 
        sender: 'ai', 
        text: outro,
        isOutro: true 
      }]);
      
      // Speak the outro message
      speakAI(outro, () => {
        console.log('🎤 Outro TTS finished, navigating to feedback');
        // Navigate after outro is finished speaking
        setTimeout(() => {
          navigate(`/feedback/${interviewId || 'latest'}`);
        }, 1000);
      });
    });

    const unsubError = subscribe('ERROR', (data) => {
      console.error('WebSocket ERROR received:', data);
      setError(data.message);
      setIsProcessing(false);
    });

    return () => {
      console.log('Cleaning up WebSocket subscriptions');
      unsubQuestions();
      unsubFeedback();
      unsubNextQuestion();
      unsubInterviewCompleted();
      unsubError();
    };
  }, [socket, isConnected]);

  // WebSocket Reconnection Resilience: Re-initialize session if connection recovers
  useEffect(() => {
    if (isConnected && interviewData && interviewState === INTERVIEW_STATES.RUNNING) {
      console.log('🔌 WS reconnected. Re-initializing session...');
      // Re-emit INITIALIZE_INTERVIEW to re-join the room and get status check
      emit('INITIALIZE_INTERVIEW', {
        interviewId,
        userId: socket?.id,
        currentQuestionIndex: currentIndexRef.current,
        userIntroductionProvided: userIntroductionProvided
      });
    }
  }, [isConnected, interviewData, interviewState, emit, socket, interviewId, userIntroductionProvided]);

  // Handle resume of active interview (when page refreshes during active session)
  useEffect(() => {
    if (running && userIntroductionProvided && questions.length > 0 && messages.length === 0) {
      console.log('🎯 Resuming active interview with intro already provided');
      console.log('📋 Current question index:', currentIndexRef.current);
      console.log('📋 Total questions:', questions.length);
      
      // If we have a current question to ask, ask it
      if (currentIndexRef.current < questions.length) {
        const currentQuestion = questions[currentIndexRef.current];
        console.log('📝 Asking question at index:', currentIndexRef.current);
        pushAIMessage(currentQuestion.text);
        speakAI(currentQuestion.text, () => {
          console.log('🎤 Question TTS finished, starting to listen');
          startListening();
        });
      } else {
        console.warn('⚠️ Invalid question index for resume');
      }
    }
  }, [running, userIntroductionProvided, questions.length, messages.length]);

  // Removed: This useEffect was causing a race condition with the intro callback
  // askQuestion is now called explicitly from handlePreparationComplete callback
  // and from NEXT_QUESTION event handler
  // useEffect(() => {
  //   if (running && questions.length) askQuestion(currentIndex);
  //   // eslint-disable-next-line
  // }, [running]);

  useEffect(() => {
    if (!listening) return;
    updateLiveUserBubble(transcript);

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      finalizeLiveUserBubble(transcript || "");
      handleUserFinishAnswer();
    }, 5000);
    // eslint-disable-next-line
  }, [transcript]);

  const pushAIMessage = (text) => {
    messageCounterRef.current += 1;
    const uniqueId = `ai-${Date.now()}-${Math.random()}-${messageCounterRef.current}`;
    console.log('📌 Pushing AI message with ID:', uniqueId);
    setMessages((m) => [...m, { id: uniqueId, sender: "ai", text }]);
  };
  const pushUserMessage = (text) => {
    messageCounterRef.current += 1;
    const uniqueId = `user-${Date.now()}-${Math.random()}-${messageCounterRef.current}`;
    console.log('📌 Pushing user message with ID:', uniqueId);
    setMessages((m) => [...m, { id: uniqueId, sender: "user", text }]);
  };

  const updateLiveUserBubble = (text) => {
    setMessages((prev) => {
      const withoutLive = prev.filter((msg) => !msg._liveTemp);
      return [
        ...withoutLive,
        { id: "user-live", sender: "user", text: text || "...", _liveTemp: true },
      ];
    });
  };

  const finalizeLiveUserBubble = (finalText) => {
    setMessages((prev) => prev.filter((msg) => !msg._liveTemp));
    if (finalText && finalText.trim().length) pushUserMessage(finalText);
  };

  const startListening = () => {
    resetTranscript();
    setListeningLive(true);
    try {
      SpeechRecognition.startListening({ continuous: true });
    } catch (e) {
      console.warn(e);
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setListeningLive(false);
  };

  const handleStartInterview = () => {
    setShowOnboarding(false);
    setRunning(true);
  };

  const askQuestion = (index) => {
    console.log('❓ askQuestion called with index:', index);
    const q = questions[index];
    if (!q) {
      console.error('❌ Question not found at index:', index);
      return;
    }
    console.log('📋 Setting currentIndex to:', index);
    setCurrentIndex(index); // Update state for UI
    currentIndexRef.current = index; // Update ref for reliable access in event handlers
    pushAIMessage(q.text);
    speakAI(q.text, () => {
      console.log('🎤 Question TTS finished, starting to listen');
      startListening();
    });
  };

  const handleUserFinishAnswer = () => {
    console.log('🎬 handleUserFinishAnswer called');
    stopListening();
    resetTranscript(); // CRITICAL: Reset transcript after capturing
    const finalText = transcript || "";
    console.log('📝 Final answer text:', finalText);
    finalizeLiveUserBubble(finalText);

    if (finalText.trim()) {
      // Check if this is the user's self-introduction (first answer)
      if (!userIntroductionProvided) {
        console.log('📝 User self-introduction received:', finalText);
        // Store user introduction
        setUserIntroductionProvided(true);
        
        // Show acknowledgment
        const acknowledgment = "Thank you! That's helpful context. Now let's begin with the first question.";
        pushAIMessage(acknowledgment);
        
        speakAI(acknowledgment, async () => {
          console.log('🎤 Acknowledgment TTS finished, asking first question');
          
          // CRITICAL: Save intro status to backend to survive refresh
          try {
            await InterviewService.updateInterviewPreferences(interviewId, {
              userIntroductionProvided: true
            });
            console.log('✅ Introduction status saved to backend');
          } catch (error) {
            console.error('❌ Failed to save introduction status:', error);
          }
          
          // Now ask the first actual question
          if (questions.length > 0) {
            console.log('✅ Asking question 0 of', questions.length);
            askQuestion(0);
          } else {
            console.warn('⚠️ No questions available');
            emit('REQUEST_NEXT_QUESTION', { interviewId });
          }
        });
      } else {
        // This is a regular question answer
        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║             SUBMITTING REGULAR ANSWER                 ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log('🔴 Submitting regular answer for question at index:', currentIndexRef.current);
        const answerId = `answer-${Date.now()}-${Math.random()}`;
        const currentAnswer = {
          id: answerId,
          text: finalText.trim(),
          question: questions[currentIndexRef.current],
          timestamp: new Date().toISOString()
        };

        console.log('📤 About to emit SUBMIT_ANSWER with:', { questionId: questions[currentIndexRef.current]?.id, answerId, answerText: finalText.substring(0, 50) });

        // Send answer to server for evaluation; server will respond with ANSWER_EVALUATED and NEXT_QUESTION
        emit('SUBMIT_ANSWER', {
          interviewId,
          questionId: questions[currentIndexRef.current]?.id || null,
          answerId,
          answer: currentAnswer,
          context: {
            currentIndex: currentIndexRef.current,
            totalQuestions: questions.length
          }
        });

        console.log('✅ SUBMIT_ANSWER emitted to backend');

        setIsProcessing(true);

        // Update answers state (transcript stored; evaluation will arrive via websocket)
        setAnswers(prev => ({
          ...prev,
          [answerId]: currentAnswer
        }));
      }
    } else {
      console.warn('⚠️ Empty answer received, not processing');
    }

    // Clear listening state; actual progression will be controlled by NEXT_QUESTION event
    setIsProcessing(false);
  };

  const handleEndInterview = (msg) => {
    stopListening();
    setRunning(false);
    setMessages((m) => [...m, { id: `system-end-${Date.now()}`, sender: "system", text: msg }]);
    navigate(`/feedback/${interviewId || "latest"}`);
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-6">Browser does not support Speech Recognition.</div>;
  }

  // Show preparation screen if in preparing state
  if (showPreparation) {
    return <PreparationScreen onReady={handlePreparationComplete} interviewData={interviewData} />;
  }

  return (
    <div className="min-h-screen bg-[#0e031a] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left side: Interview */}
        <div className="col-span-12 md:col-span-8 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#824fb8] rounded-lg shadow p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Live Interview</h3>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-100">
                  Q {currentIndex + 1} / {questions.length}
                </div>
                <button
                  onClick={() => setShowEndModal(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Pause
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded mt-4">
              <div className="text-sm text-gray-600">
                <span className="text-green-600 font-bold">Answered:</span>{" "}
                {Object.keys(answers).length}
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-yellow-600 font-bold">Progress:</span>{" "}
                {Math.round((Object.keys(answers).length / questions.length) * 100)}%
              </div>
              <div className="text-sm text-gray-800">
                <span className="text-blue-600 font-bold">Listening:</span>{" "}
                {listeningLive ? "Yes" : "No"}
              </div>
            </div>

            {/* Avatars */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <AvatarStage type="user" speaking={false} running={running} />
              <AvatarStage type="ai" speaking={listeningLive} />
            </div>

            {isProcessing && (
              <div className="mt-6 flex justify-center">
                <Loader />
              </div>
            )}
          </motion.div>
        </div>

        {/* Right side: Chat */}
        <div className="col-span-12 md:col-span-4">
          <ChatPanel messages={messages} />
        </div>
      </div>

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal
            onClose={() => setShowOnboarding(false)}
            onStart={handleOnboardingComplete}
            resumeData={resumeData}
          />
        )}
      </AnimatePresence>

      {showEndModal && (
        <PauseModal
          show={showEndModal}
          onClose={() => setShowEndModal(false)}
          onConfirm={() => handleEndInterview("Interview ended by user.")}
        />
      )}
    </div>
  );
};

export default ResumeInterviewPage;
