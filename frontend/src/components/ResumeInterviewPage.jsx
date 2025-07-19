// import { useState } from "react";
// import ResumeUpload from "./ResumeUpload";
// import ResumeReview from "./ResumeReview";
// import axios from "axios";

// const ResumeInterviewPage = () => {
//   const [step, setStep] = useState(1);
//   const [parsedResume, setParsedResume] = useState(null);
//   const [finalInterviewData, setFinalInterviewData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [geminiError, setGeminiError] = useState("");

//   const handleResumeParsed = (data) => {
//     setParsedResume(data);
//     setStep(2);
//   };

//   const handleGenerateInterview = async ({ resume, additionalPrompt }) => {
//     setLoading(true);
//     setGeminiError("");

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/api/interview/start`, 
//         {
//           resume,
//           prompt: additionalPrompt,
//         },{
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       }
//       );

//       setFinalInterviewData(response.data);
//       setStep(3);
//     } catch (error) {
//       console.error("Gemini Error:", error);
//       setGeminiError("Failed to generate interview. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       {step === 1 && <ResumeUpload onParsedResume={handleResumeParsed} />}

//       {step === 2 && (
//         <ResumeReview
//           resumeData={parsedResume}
//           onConfirm={handleGenerateInterview}
//         />
//       )}

//       {loading && (
//         <p className="text-center mt-4 text-blue-500 font-medium">
//           Generating your personalized interview... ⏳
//         </p>
//       )}

//       {step === 3 && finalInterviewData && (
//         <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
//           <h2 className="text-2xl font-bold mb-4 text-indigo-700">
//             Interview Ready 🎯
//           </h2>
//           <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
//             {JSON.stringify(finalInterviewData, null, 2)}
//           </pre>
//           {/* TODO: Replace with <Interview /> component later */}
//         </div>
//       )}

//       {geminiError && (
//         <p className="text-center text-red-500 font-semibold mt-4">{geminiError}</p>
//       )}
//     </div>
//   );
// };

// export default ResumeInterviewPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🧭 Add this!
import ResumeUpload from "./ResumeUpload";
import ResumeReview from "./ResumeReview";
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
