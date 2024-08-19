import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Feedback from "../components/Feedback";
import CancelModal from "../components/CancelModal";


const InterviewPage = () => {
  const { interviewId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/interview/${interviewId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching interview data:", error);
      }
    };

    fetchInterview();
  }, [interviewId]);

  useEffect(() => {
    // Update the answer for the current question whenever the transcript changes
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: transcript,
    }));
  }, [transcript, currentQuestionIndex]);

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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetTranscript(); // Reset the transcript for the next question
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

      setFeedback(response.data.feedback);
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
      // Redirect or show a message after cancellation
      window.location.href = "/"; // Redirect to home or another page
    } catch (error) {
      console.error("Error canceling interview:", error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  if (isSubmitting) {
    return <Loader />;
  }

  if (!questions.length) {
    return (
      <div>
        <h2>Something wrong with questions fetching. Kindly try again!!</h2>
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
      <Navbar />
      <h2 className="m-6 text-4xl text-indigo-900 font-bold mb-4">Interview</h2>
      <div className="relative">
        {/* Fixed cancel button */}
        <button
          onClick={() => setShowCancelModal(true)}
          className="absolute top-4 right-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Cancel Interview
        </button>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl text-indigo-800 font-semibold mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <p className="mb-4">{questions[currentQuestionIndex]}</p>
          <textarea
            value={answers[currentQuestionIndex] || ""}
            onChange={handleAnswerChange}
            rows="4"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your answer here..."
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={listening ? handleStopRecording : handleStartRecording}
              className={`py-2 px-4 rounded ${
                listening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-indigo-500 hover:bg-indigo-600"
              } text-white`}
            >
              {listening ? "Stop Recording" : "Start Recording"}
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
                disabled={
                  !answers[currentQuestionIndex] ||
                  answers[currentQuestionIndex].trim() === ""
                }
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitAnswers}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                disabled={
                  isSubmitting ||
                  !answers[currentQuestionIndex] ||
                  answers[currentQuestionIndex].trim() === ""
                }
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
      <CancelModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelInterview}
      />
    </div>
  );
};

export default InterviewPage;
