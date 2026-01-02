import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import InterviewService from "../../services/InterviewService";

const FeedbackPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);

        const response = await InterviewService.getInterview(interviewId);

        setInterview(response.interview || response);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching feedback:", err);
        setError(err.message || "Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchFeedback();
    } else {
      navigate("/dashboard");
    }
  }, [interviewId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 mt-20">
          <div className="bg-red-500/10 backdrop-blur-xl border-l-4 border-red-500 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              Error Loading Feedback
            </h2>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 mt-20">
          <div className="bg-yellow-500/10 backdrop-blur-xl border-l-4 border-yellow-500 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              No Interview Data
            </h2>
            <p className="text-yellow-300">Could not find interview data.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const summary = interview.summary || {};
  const answers = interview.answers || [];
  const resume = interview.resume || {};
  const interviewType = interview.type || 'resume'; // Default to 'resume' for backward compatibility
  const createdAt = interview.createdAt
    ? new Date(interview.createdAt).toLocaleDateString()
    : "N/A";

  // Calculate overall score
  const overallScore =
    answers.length > 0
      ? Math.round(
          answers.reduce((sum, ans) => sum + (ans.feedback?.score || 0), 0) /
            answers.length
        )
      : summary.averageScore || 0;

  // Determine performance level
  const getPerformanceLevel = (score) => {
    if (score >= 80)
      return {
        label: "Excellent",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    if (score >= 60)
      return { label: "Good", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (score >= 40)
      return {
        label: "Fair",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      };
    return {
      label: "Needs Improvement",
      color: "text-red-600",
      bgColor: "bg-red-50",
    };
  };

  const performance = getPerformanceLevel(overallScore);

  // Toggle answer visibility
  const toggleAnswer = (index) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // For Free Interview - Basic Feedback View
  if (interviewType === 'free') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] pb-12 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        <Navbar />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-6 md:px-10 md:py-8 mt-20">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 mb-2 drop-shadow-lg">
              Quick Interview Feedback
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-gray-300">
              <span className="px-3 py-1 bg-indigo-600/30 backdrop-blur-md text-indigo-300 rounded-full text-xs sm:text-sm font-semibold border border-indigo-500/40">
                Free Practice
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">Interview Date: {createdAt}</span>
            </div>
          </div>

          {/* Overall Score Card */}
          <div
            className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 shadow-[0_8px_32px_rgba(168,85,247,0.3)]"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Your Performance
                </h2>
                <p className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                  {performance.label}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 drop-shadow-lg">
                  {overallScore}
                </div>
                <p className="text-sm sm:text-base text-gray-300 mt-2">out of 100</p>
              </div>
            </div>
          </div>

          {/* Questions Summary */}
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 mb-6 md:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Question Summary
            </h3>

            {summary.perQuestionFeedback && summary.perQuestionFeedback.length > 0 ? (
              <div className="space-y-4">
                {summary.perQuestionFeedback.map((feedback, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-purple-500 px-4 md:pl-6 py-4 bg-white/5 backdrop-blur-md rounded-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h4 className="font-semibold text-white text-base md:text-lg">
                        Question {idx + 1}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit backdrop-blur-md border ${
                          feedback.label === "Excellent"
                            ? "bg-green-500/20 text-green-300 border-green-500/40"
                            : feedback.label === "Good"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            : feedback.label === "OK"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                            : "bg-red-500/20 text-red-300 border-red-500/40"
                        }`}
                      >
                        {feedback.label} ({feedback.score}/100)
                      </span>
                    </div>

                    {/* Question Text */}
                    <div className="mb-3 p-3 bg-white/5 rounded-xl border border-purple-500/20">
                      <p className="text-sm text-gray-400 font-medium mb-1">Question:</p>
                      <p className="text-sm md:text-base text-gray-200">{feedback.question}</p>
                    </div>

                    {/* Answer Toggle */}
                    <button
                      onClick={() => toggleAnswer(idx)}
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm mb-3 transition"
                    >
                      <span>{expandedAnswers[idx] ? '▼' : '▶'}</span>
                      <span>{expandedAnswers[idx] ? 'Hide Answer' : 'Show Answer'}</span>
                    </button>

                    {/* Answer Text (Collapsible) */}
                    {expandedAnswers[idx] && (
                      <div className="mb-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
                        <p className="text-sm text-indigo-300 font-medium mb-1">Your Answer:</p>
                        <p className="text-sm md:text-base text-gray-300 whitespace-pre-wrap">
                          {feedback.answer || 'No answer provided'}
                        </p>
                      </div>
                    )}

                    {/* Strengths */}
                    {feedback.strengths && feedback.strengths.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-green-400 mb-1">
                          ✓ What went well:
                        </p>
                        <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                          {feedback.strengths.map((strength, i) => (
                            <li key={i} className="ml-4">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {feedback.improvements && feedback.improvements.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-blue-400 mb-1">
                          → Could improve:
                        </p>
                        <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                          {feedback.improvements.map((improvement, i) => (
                            <li key={i} className="ml-4">• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No feedback available yet</p>
            )}
          </div>

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-r from-purple-600/80 to-indigo-600/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(168,85,247,0.3)] border border-purple-500/30 p-4 sm:p-6 md:p-8 mb-6 md:mb-8 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
              Want Detailed AI-Powered Feedback? 🚀
            </h3>
            <p className="text-sm sm:text-base text-purple-100 mb-3 sm:mb-4">
              Upgrade to resume-based interviews for in-depth analysis, personalized recommendations, and career-specific insights!
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white text-purple-600 text-sm sm:text-base font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition"
            >
              Start Resume-Based Interview
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard/interview-history")}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition border border-purple-500/30"
            >
              View Interview History
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md text-gray-200 text-sm sm:text-base font-semibold rounded-xl hover:bg-white/20 transition border border-white/20"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For Resume-Based Interview - Detailed Feedback View
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] pb-12 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:p-8 mt-20">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 mb-2 drop-shadow-lg">
            Detailed Interview Analysis
          </h1>
          <div className="flex flex-col text-sm md:text-base text-gray-300">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-purple-600/30 backdrop-blur-md text-purple-300 rounded-full text-xs sm:text-sm font-semibold border border-purple-500/40">
                Resume-Based
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">Interview Date: {createdAt}</span>
            </div>
            <span className="text-xs sm:text-sm mt-1">Position: {resume.jobRole || "N/A"}</span>
          </div>
        </div>

        {/* Overall Score Card */}
        <div
          className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 shadow-[0_8px_32px_rgba(168,85,247,0.3)]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Overall Performance
              </h2>
              <p className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                {performance.label}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 drop-shadow-lg">
                {overallScore}
              </div>
              <p className="text-sm sm:text-base text-gray-300 mt-2">out of 100</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Key Strengths */}
          <div className="bg-white/5 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border-t-4 border-t-green-500">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
              <span className="text-green-400 text-2xl sm:text-3xl mr-2 sm:mr-3">✓</span>
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {summary.keyStrengths && summary.keyStrengths.length > 0 ? (
                summary.keyStrengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-400 font-bold mr-3 mt-1">
                      •
                    </span>
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No strengths recorded</li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border-t-4 border-t-blue-500">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
              <span className="text-blue-400 text-2xl sm:text-3xl mr-2 sm:mr-3">→</span>
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {summary.areasToImprove && summary.areasToImprove.length > 0 ? (
                summary.areasToImprove.map((area, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-400 font-bold mr-3 mt-1">•</span>
                    <span className="text-gray-300">{area}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">
                  No areas for improvement recorded
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Recommended Resources */}
        {summary.recommendedResources &&
          summary.recommendedResources.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border-t-4 border-t-purple-500 mb-6 md:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <span className="text-purple-400 text-2xl sm:text-3xl mr-2 sm:mr-3">📚</span>
                Recommended Resources
              </h3>
              <ul className="space-y-3">
                {summary.recommendedResources.map((resource, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-purple-400 font-bold mr-3 mt-1">
                      →
                    </span>
                    <span className="text-gray-300">{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Detailed Answer Feedback */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 mb-6 md:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
            Answer-by-Answer Feedback
          </h3>

          {answers.length > 0 ? (
            <div className="space-y-6">
              {answers.map((answer, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-purple-500 pl-6 py-4 bg-white/5 backdrop-blur-md rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">
                      Question {idx + 1}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md border ${
                        answer.feedback?.label === "Excellent"
                          ? "bg-green-500/20 text-green-300 border-green-500/40"
                          : answer.feedback?.label === "Good"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          : answer.feedback?.label === "Fair"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                          : "bg-red-500/20 text-red-300 border-red-500/40"
                      }`}
                    >
                      {answer.feedback?.label || "N/A"} (
                      {answer.feedback?.score || 0}/100)
                    </span>
                  </div>

                  {answer.feedback?.strengths &&
                    answer.feedback.strengths.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-green-400 mb-2">
                          Strengths:
                        </p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {answer.feedback.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-400 mr-2">✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {answer.feedback?.improvements &&
                    answer.feedback.improvements.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-blue-400 mb-2">
                          Could Improve:
                        </p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {answer.feedback.improvements.map(
                            (improvement, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-blue-400 mr-2">→</span>
                                <span>{improvement}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {answer.feedback?.feedback && (
                    <p className="text-sm text-gray-300 italic border-t border-purple-500/30 pt-3 mt-3">
                      "{answer.feedback.feedback}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No answer feedback available</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard/interview-history")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all border border-purple-500/30"
          >
            View Interview History
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
