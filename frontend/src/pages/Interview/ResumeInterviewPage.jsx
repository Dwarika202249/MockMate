import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { motion, AnimatePresence } from "framer-motion";
import AvatarStage from "../../components/resume/AvatarStage";
import ChatPanel from "../../components/resume/ChatPanel";
import OnboardingModal from "../../components/resume/OnboardingModal";
import AnswerEvaluator from "../../utils/AnswerEvaluator";
import Loader from "../../components/common/Loader";
import DeleteModal from "../../components/common/DeleteModal";

const DUMMY_QUESTIONS = [
  { id: 1, text: "Tell me about yourself.", keywords: ["yourself", "background", "experience"] },
  { id: 2, text: "Walk me through a recent React project you built.", keywords: ["react", "project", "component", "state"] },
  { id: 3, text: "How do you manage state in large React apps?", keywords: ["redux", "context", "state management", "hooks"] },
  { id: 4, text: "Explain event loop in JavaScript.", keywords: ["event loop", "callback", "async", "microtask"] },
  { id: 5, text: "How would you optimize performance for a slow page?", keywords: ["performance", "optimize", "lazy", "memoize"] },
];

const ResumeInterviewPage = ({ questions = DUMMY_QUESTIONS }) => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [running, setRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [listeningLive, setListeningLive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const silenceTimerRef = useRef(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const speakAI = (text, callback) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => callback && callback();
    synth.speak(utter);
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) console.warn("SpeechRecognition not supported.");
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (running && questions.length) askQuestion(currentIndex);
    // eslint-disable-next-line
  }, [running]);

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

  const pushAIMessage = (text) =>
    setMessages((m) => [...m, { id: `ai-${Date.now()}`, sender: "ai", text }]);
  const pushUserMessage = (text) =>
    setMessages((m) => [...m, { id: `user-${Date.now()}`, sender: "user", text }]);

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
    const q = questions[index];
    if (!q) return;
    pushAIMessage(q.text);
    speakAI(q.text, () => startListening());
  };

  const handleUserFinishAnswer = () => {
    stopListening();
    const finalText = transcript || "";
    finalizeLiveUserBubble(finalText);

    setIsProcessing(true);
    const currentQ = questions[currentIndex];
    const evaluation = AnswerEvaluator.evaluate(finalText, currentQ.keywords || []);

    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { transcript: finalText, evaluation },
    }));

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `ai-feedback-${Date.now()}`,
          sender: "ai",
          text: `Quick feedback: ${evaluation.label}. ${evaluation.summary}`,
        },
      ]);
    }, 600);

    setIsProcessing(false);

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
        askQuestion(nextIndex);
      } else {
        handleEndInterview("Interview completed.");
      }
    }, 2000);
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
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  End
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
            onStart={handleStartInterview}
          />
        )}
      </AnimatePresence>

      {showEndModal && (
        <DeleteModal
          show={showEndModal}
          onClose={() => setShowEndModal(false)}
          onConfirm={() => handleEndInterview("Interview ended by user.")}
        />
      )}
    </div>
  );
};

export default ResumeInterviewPage;
