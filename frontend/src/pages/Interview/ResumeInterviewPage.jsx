import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { motion, AnimatePresence } from "framer-motion";
import AvatarStage from "../../components/resume/AvatarStage";
import axios from "axios";
import toast from "react-hot-toast";
import ChatPanel from "../../components/resume/ChatPanel";
import OnboardingModal from "../../components/resume/OnboardingModal";
import PreparationScreen from "../../components/resume/PreparationScreen";
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
  // Refs to surface latest state values for socket handlers
  const userIntroductionProvidedRef = useRef(userIntroductionProvided);
  useEffect(() => { userIntroductionProvidedRef.current = userIntroductionProvided; }, [userIntroductionProvided]);
  const interviewStateRef = useRef(interviewState);
  useEffect(() => { interviewStateRef.current = interviewState; }, [interviewState]);

  // Timer and elapsed time tracking
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(null); // set from onboarding duration when available
  
  const silenceTimerRef = useRef(null);
  const messageCounterRef = useRef(0);  // Counter to ensure unique message IDs
  const currentIndexRef = useRef(0);  // Ref to track current question index (must be ref for reliable access)
  const isPausedRef = useRef(false); // prevents handling socket events when paused
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
      if (isPausedRef.current) return; // don't continue if paused
      callback && callback();
    };
    synth.speak(utter);
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
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
        
        // Restore pausedState if present (priority) otherwise use currentQuestionIndex
        if (interview.pausedState) {
          const ps = interview.pausedState;
          const restoredIndex = ps.currentQuestionIndex || interview.currentQuestionIndex || 0;
          setCurrentIndex(restoredIndex);
          currentIndexRef.current = restoredIndex;

          // Restore answers and elapsed time
          setAnswers(ps.answers || {});
          setElapsedTime(ps.elapsedTime || 0);

          // Restore messages from stored conversation (preferred) or pausedState.messages
          if (interview.conversation && interview.conversation.length > 0) {
            setMessages(interview.conversation.map((m) => ({ id: m.id, sender: m.sender, text: m.text, timestamp: m.timestamp })));
          } else if (ps.messages) {
            setMessages(ps.messages);
          }

          // Restore intro status
          setUserIntroductionProvided(ps.userIntroductionProvided || interview.userIntroductionProvided || false);
        } else {
          // Get the last question index for resumption
          const lastIndex = interview.currentQuestionIndex || 0;
          setCurrentIndex(lastIndex);
          currentIndexRef.current = lastIndex;

          // Load user introduction status for session persistence
          setUserIntroductionProvided(interview.userIntroductionProvided || false);
        }

        // Set durationMinutes from interview preferences if available
        if (interview.preferences?.duration) {
          setDurationMinutes(parseInt(interview.preferences.duration));
        }

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
        
        if (interview.status === 'in-progress' || interview.status === 'paused') {
          // If interview is paused or was in-progress, skip onboarding and show preparation screen
          setShowOnboarding(false);
          setShowPreparation(true);
          setInterviewState(INTERVIEW_STATES.PREPARING);
        } else if (interview.status === 'active') {
          setShowOnboarding(false);
          setShowPreparation(false);
          setRunning(true);
          setInterviewState(INTERVIEW_STATES.RUNNING);
          
          // For active interviews, will emit INITIALIZE_INTERVIEW via useEffect when socket connects
        } else {
          setShowOnboarding(true);
        }

        if (interview.questions?.length > 0) {
          setQuestions(interview.questions);
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
      
      // Close the onboarding modal
      setShowOnboarding(false);
      
        // Map duration (minutes) to question count: 15->3, 30->5, 45->7
      const minutes = parseInt(data.preferences?.duration) || 30;
      let numQuestions = 5;
      if (minutes <= 15) numQuestions = 3;
      else if (minutes <= 30) numQuestions = 5;
      else if (minutes <= 45) numQuestions = 7;
      else numQuestions = Math.max(5, Math.round((minutes / 30) * 5)); // fallback scaling

      // Persist duration and numQuestions to state and backend
      setDurationMinutes(minutes);

      const prefsToSave = {
        ...data.preferences,
        numQuestions,
        duration: String(minutes)
      };

      // Update interview preferences in the backend (include numQuestions)
      const updateRes = await InterviewService.updateInterviewPreferences(interviewId, {
        ...prefsToSave,
        status: 'in-progress'
      });

      setInterviewData({ ...data, preferences: prefsToSave });
      setInterviewState(INTERVIEW_STATES.PREPARING);
      setShowPreparation(true);  // CRITICAL: Show the preparation/countdown screen

      // Wait for WebSocket connection if not connected yet
      if (!isConnected) {
        // Give socket time to connect
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Request question generation through WebSocket
      emit('INITIALIZE_INTERVIEW', {
        interviewId,
        userId: socket?.id, // Include socket ID for backend reference
        currentQuestionIndex: currentIndexRef.current,
        preferences: prefsToSave,
        resumeContext: {
          ...data.resumeContext,
          name: data.name,
          jobRole: data.jobRole,
          experience: data.experience
        }
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      setError('Failed to start interview');
      setInterviewState(INTERVIEW_STATES.ERROR);
      setIsProcessing(false);
    }
  };

  const handlePreparationComplete = async () => {
    try {
      // Update interview status to active
      const updateRes = await InterviewService.updateInterviewPreferences(interviewId, {
        status: 'active'
      });

      // Set state transitions
      setInterviewState(INTERVIEW_STATES.RUNNING);
      setRunning(true);
      setShowPreparation(false);  // Hide preparation screen
      // Clear paused flag so events resume
      isPausedRef.current = false;
      // Resume timer
      setIsTimerActive(true);

      // CRITICAL: Check if user already provided introduction (session resume case)
      if (userIntroductionProvided) {
        askQuestion(currentIndexRef.current);
        return;
      }
      
      // Start with AI introduction only if this is a fresh interview
      const introMessage = generateAIIntroduction(interviewData);
      pushAIMessage(introMessage);
      
      speakAI(introMessage, () => {
        setAiSpeaking(false);
        
        // Now ask the user to introduce themselves
        const userIntroPrompt = "Thank you! Now, could you please tell me about yourself? Include your background, key skills, and why you're interested in this position.";
        pushAIMessage(userIntroPrompt);
        
        speakAI(userIntroPrompt, () => {
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
      return;
    }

    const unsubQuestions = subscribe('QUESTIONS_READY', (data) => {
      if (isPausedRef.current) return; // ignore while paused
      const incomingQuestions = data.questions || [];
      setQuestions(incomingQuestions);

      // Ensure currentIndex is valid
      if (typeof currentIndexRef.current === 'undefined' || currentIndexRef.current === null) {
        setCurrentIndex(0);
        currentIndexRef.current = 0;
      }

      // Do not auto-ask here; server will emit ASK_QUESTION deterministically. This avoids duplicate speaking.
      setIsProcessing(false);
    });

    const unsubFeedback = subscribe('ANSWER_EVALUATED', (data) => {
      if (isPausedRef.current) return; // ignore events while paused
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
        pushAIMessage(feedbackText).catch((e) => console.warn('Failed to save feedback message:', e?.message || e));
      }
    });

    const unsubNextQuestion = subscribe('NEXT_QUESTION', (data) => {
      if (isPausedRef.current) return; // ignore events while paused
      const { question } = data;
      
      if (question) {
        // Try to find the index of the incoming question; fallback to increment
        const foundIndex = questions.findIndex(q => q.id === question.id);
        const nextIndex = foundIndex >= 0 ? foundIndex : ((currentIndexRef.current || 0) + 1);
        setCurrentIndex(nextIndex);
        currentIndexRef.current = nextIndex; // Update ref immediately
        // NOTE: Do not speak here. Server will emit ASK_QUESTION for deterministic speaking.
      } else {
        console.warn('⚠️ No question in NEXT_QUESTION event data');
      }
    });

    const unsubAskQuestion = subscribe('ASK_QUESTION', (data) => {
      if (isPausedRef.current) return; // ignore while paused
      const { question } = data || {};
      if (!question) return; // ASK_QUESTION without question payload ignored

      // Find existing index or append and ask
      const idx = questions.findIndex(q => q.id === question.id);
      if (idx >= 0) {
        askQuestion(idx);
        return;
      }

      setQuestions(prev => {
        const next = [...prev, question];
        const askIdx = next.length - 1;
        // Ask after updating local list
        setTimeout(() => askQuestion(askIdx), 0);
        return next;
      });
    });

    const unsubInterviewCompleted = subscribe('INTERVIEW_COMPLETED', (data) => {
      if (isPausedRef.current) return; // ignore while paused
      const { summary, outroMessage } = data || {};
      
      setIsProcessing(false);
      setRunning(false);
      setIsTimerActive(false);
      
      // Show outro message if provided, or generate a default one
      const outro = outroMessage || "Thank you for taking the time to interview with me today. You've demonstrated great skills and insight. We'll review your responses carefully and get back to you soon. Good luck!";
      
      messageCounterRef.current += 1;
      const outroText = outro;
      pushAIMessage(outroText).catch((e) => console.warn('Failed to save outro message:', e?.message || e));
      
      // Speak the outro message
      speakAI(outro, () => {
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
      unsubQuestions();
      unsubFeedback();
      unsubNextQuestion();
      // cleanup ASK_QUESTION
      try { unsubAskQuestion && unsubAskQuestion(); } catch (e) { /* ignore */ }
      unsubInterviewCompleted();
      unsubError();
    };
  }, [socket, isConnected]);

  // WebSocket Reconnection Resilience: Re-initialize session if connection recovers
  useEffect(() => {
    if (isConnected && interviewData && interviewState === INTERVIEW_STATES.RUNNING) {
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
      // If we have a current question to ask, ask it
      if (currentIndexRef.current < questions.length) {
        const currentQuestion = questions[currentIndexRef.current];
        pushAIMessage(currentQuestion.text);
        speakAI(currentQuestion.text, () => {
          startListening();
        });
      } else {
        // Invalid question index for resume - ignoring
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

  // Basic timer effect: increment elapsedTime while active
  useEffect(() => {
    if (!isTimerActive) return;
    const t = setInterval(() => setElapsedTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isTimerActive]);

  // End interview when timer reaches configured duration
  useEffect(() => {
    if (!isTimerActive || !durationMinutes) return;

    const durationSeconds = Number(durationMinutes) * 60;
    if (elapsedTime >= durationSeconds) {
      // Prevent multiple triggers
      setIsTimerActive(false);
      // Finalize any live transcript and stop audio
      stopListening();
      finalizeLiveUserBubble(transcript || "");
      resetTranscript();

      setIsProcessing(true);
      try {
        emit && emit('END_INTERVIEW', { interviewId });
      } catch (err) {
        console.error('Failed to emit END_INTERVIEW:', err?.message || err);
        setIsProcessing(false);
      }
    }
  }, [elapsedTime, isTimerActive, durationMinutes, emit, interviewId, transcript]);


  const pushAIMessage = async (text) => {
    messageCounterRef.current += 1;
    const uniqueId = `ai-${Date.now()}-${Math.random()}-${messageCounterRef.current}`;
    const msg = { id: uniqueId, sender: "ai", text, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, msg]);
    try {
      // Persist message to server for session recovery
      await InterviewService.saveMessage(interviewId, { sender: 'ai', text: msg.text, timestamp: msg.timestamp });
    } catch (err) {
      console.warn('Failed to save AI message:', err?.response?.data || err?.message || err);
    }
  };

  const pushUserMessage = async (text) => {
    messageCounterRef.current += 1;
    const uniqueId = `user-${Date.now()}-${Math.random()}-${messageCounterRef.current}`;
    const msg = { id: uniqueId, sender: "user", text, timestamp: new Date().toISOString() };
    // Finalized user messages should be saved to DB
    setMessages((m) => [...m, msg]);
    try {
      await InterviewService.saveMessage(interviewId, { sender: 'user', text: msg.text, timestamp: msg.timestamp });
    } catch (err) {
      console.error('Failed to save user message:', err?.response?.data || err?.message || err);
      toast.error('Failed to persist your answer. It will be saved locally until connection is restored.');
    }
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
    const q = questions?.[index];
    if (!q) {
      console.warn('❌ Question not found at index:', index, ' — attempting to recover');
      // Try to request next question from server to recover (avoids client crash)
      try {
        emit && emit('REQUEST_NEXT_QUESTION', { interviewId });
      } catch (e) {
        console.error('Failed to emit REQUEST_NEXT_QUESTION:', e?.message || e);
      }
      return;
    }

    setCurrentIndex(index); // Update state for UI
    currentIndexRef.current = index; // Update ref for reliable access in event handlers
    pushAIMessage(q.text);
    speakAI(q.text, () => {
      startListening();
    });
  };

  const handleUserFinishAnswer = () => {
    stopListening();
    resetTranscript(); // CRITICAL: Reset transcript after capturing
    const finalText = transcript || "";
    finalizeLiveUserBubble(finalText);

    if (finalText.trim()) {
      // Check if this is the user's self-introduction (first answer)
      if (!userIntroductionProvided) {
        // Store user introduction
        setUserIntroductionProvided(true);
        
        // Show acknowledgment
        const acknowledgment = "Thank you! That's helpful context. Now let's begin with the first question.";
        pushAIMessage(acknowledgment);
        
        speakAI(acknowledgment, async () => {
          // CRITICAL: Save intro status to backend to survive refresh
          try {
            await InterviewService.updateInterviewPreferences(interviewId, {
              userIntroductionProvided: true
            });
          } catch (error) {
            console.error('❌ Failed to save introduction status:', error);
          }
          
          // Now ask the first actual question
          if (questions.length > 0) {
            askQuestion(0);
          } else {
            console.warn('⚠️ No questions available');
            emit('REQUEST_NEXT_QUESTION', { interviewId });
          }
        });
      } else {
        // This is a regular question answer
        const answerId = `answer-${Date.now()}-${Math.random()}`;
        const currentAnswer = {
          id: answerId,
          text: finalText.trim(),
          question: questions[currentIndexRef.current],
          timestamp: new Date().toISOString()
        };

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

  // Pause interview: save state, stop speech/listening, notify server, and redirect to dashboard
  const handlePauseInterview = async () => {
    try {
      // Stop any ongoing speech and listening
      stopListening();
      if (window.speechSynthesis && window.speechSynthesis.cancel) {
        window.speechSynthesis.cancel();
      }

      // Stop timer and finalize any live transcript bubble
      setIsTimerActive(false);
      finalizeLiveUserBubble(transcript || "");
      resetTranscript();

      setIsProcessing(false);

      // Mark paused so socket events are ignored
      isPausedRef.current = true;

      // Build paused state payload
      const pausedState = {
        currentQuestionIndex: currentIndexRef.current,
        answers: answers || {},
        messages: messages || [],
        userIntroductionProvided: userIntroductionProvided || false,
        pausedAt: new Date().toISOString()
      };

      // Persist to backend (pause endpoint)
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/interview/${interviewId}/pause`,
        { pausedState },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Update interview status to paused (best-effort)
      try {
        await InterviewService.updateInterviewPreferences(interviewId, { status: 'paused' });
      } catch (e) {
        console.warn('Failed to update interview status to paused:', e?.message || e);
      }

      // Notify server via websocket to halt processing for this interview
      try {
        emit && emit('PAUSE_INTERVIEW', { interviewId, pausedState });
      } catch (e) {
        console.warn('Failed to emit PAUSE_INTERVIEW:', e?.message || e);
      }

      // Notify user and redirect to dashboard
      setMessages((m) => [...m, { id: `system-pause-${Date.now()}`, sender: 'system', text: 'Interview paused. Redirecting to dashboard...' }]);
      setShowEndModal(false);
      setRunning(false);

      navigate('/dashboard');
    } catch (error) {
      console.error('Error pausing interview:', error);
      toast.error('Failed to pause interview. Please try again.');
      isPausedRef.current = false;
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-6">Browser does not support Speech Recognition.</div>;
  }

  // Show preparation screen if in preparing state
  if (showPreparation) {
    return <PreparationScreen onReady={handlePreparationComplete} interviewData={interviewData} durationMinutes={durationMinutes} />;
  }

  // Compute remaining seconds for timer-driven UI
  const remainingSeconds = durationMinutes ? Math.max(0, Number(durationMinutes) * 60 - elapsedTime) : null;
  const endingSoon = isTimerActive && remainingSeconds !== null && remainingSeconds <= 10 && remainingSeconds > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left side: Interview */}
        <div className="col-span-12 md:col-span-8 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(168,85,247,0.06)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">Live Interview</h3>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-300">
                  <div className="text-xs text-gray-400">Q {currentIndex + 1} / {questions.length}</div>
                  <div className="text-xs text-gray-400">AI: {aiSpeaking ? 'Speaking' : 'Idle'}</div>
                </div>
                <button
                  onClick={() => setShowEndModal(true)}
                  className="py-2 px-3 rounded-xl bg-white/5 border border-purple-500/20 text-white hover:bg-white/10 transition"
                >
                  Pause
                </button>
              </div>
            </div>

            {/* Quick stats */}
            {endingSoon && (
              <div className="mt-4">
                <div className="bg-red-600 text-white px-3 py-2 rounded-md animate-pulse text-sm font-semibold flex items-center justify-center">
                  ⚠️ Ending soon: {formatTime(remainingSeconds)}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="p-3 bg-white/5 border border-purple-500/10 rounded-lg text-center">
                <div className="text-sm text-gray-300">Answered</div>
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">{Object.keys(answers).length}</div>
              </div>
              <div className="p-3 bg-white/5 border border-purple-500/10 rounded-lg text-center">
                <div className="text-sm text-gray-300">Progress</div>
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">{isFinite(questions.length) && questions.length>0 ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0}%</div>
              </div>
              <div className="p-3 bg-white/5 border border-purple-500/10 rounded-lg text-center">
                <div className="text-sm text-gray-300">Listening</div>
                <div className={`text-lg font-bold ${listeningLive ? 'text-green-400' : 'text-gray-400'}`}>{listeningLive ? 'Yes' : 'No'}</div>
              </div>
              <div className="p-3 bg-white/5 border border-purple-500/10 rounded-lg text-center">
                <div className="text-sm text-gray-300">Time Left</div>
                <div className={`text-lg font-bold ${endingSoon ? 'text-red-300' : 'text-white'}`}>
                  {durationMinutes ? (
                    (() => {
                      const total = Number(durationMinutes) * 60;
                      const remaining = Math.max(0, total - elapsedTime);
                      return formatTime(remaining);
                    })()
                  ) : (
                    <span className="text-gray-400">--:--</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">{isTimerActive ? `Elapsed ${formatTime(elapsedTime)}` : `${durationMinutes || '-'} min scheduled`}</div>
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
          onConfirm={handlePauseInterview}
        />
      )}
    </div>
  );
};

export default ResumeInterviewPage;
