import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeUpload from "../../components/resume/ResumeUpload";
import ResumeReview from "../../components/resume/ResumeReview";
import axios from "axios";

const ResumeInterviewPage = () => {
  const [step, setStep] = useState(1);
  const [parsedResume, setParsedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geminiError, setGeminiError] = useState("");
  const navigate = useNavigate(); // ⬅️ Hook for navigation

  const handleResumeParsed = (data) => {
    setParsedResume(data);
    setStep(2);
  };

  const handleGenerateInterview = async ({ resume, additionalPrompt }) => {
    setLoading(true);
    setGeminiError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/interview/start`,
        {
          resume,
          prompt: additionalPrompt,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const interviewId = response?.data?.interviewId;
      if (interviewId) {
        navigate(`/interview/${interviewId}`); // 🔥 Navigate to InterviewPage
      } else {
        throw new Error("Interview ID not found in response.");
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      setGeminiError("Failed to generate interview. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {step === 1 && <ResumeUpload onParsedResume={handleResumeParsed} />}

      {step === 2 && (
        <ResumeReview resumeData={parsedResume} onConfirm={handleGenerateInterview} />
      )}

      {loading && (
        <p className="text-center mt-4 text-blue-500 font-medium">
          Generating your personalized interview... ⏳
        </p>
      )}

      {geminiError && (
        <p className="text-center text-red-500 font-semibold mt-4">{geminiError}</p>
      )}
    </div>
  );
};

export default ResumeInterviewPage;
