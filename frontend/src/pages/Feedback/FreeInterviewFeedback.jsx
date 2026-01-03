import React, { useState } from "react";

const FreeInterviewFeedback = ({
  summary = {},
  performance,
  overallScore,
  createdAt,
  navigate,
  source = 'local'
}) => {
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const toggleAnswer = (index) => {
    setExpandedAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };


  return (
    <div className="relative z-10 max-w-4xl mx-auto px-6 py-6 md:px-10 md:py-8 mt-20">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 mb-2 drop-shadow-lg">
            Quick Interview Feedback
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-gray-300">
              <span className="px-3 py-1 bg-indigo-600/30 backdrop-blur-md text-indigo-300 rounded-full text-xs sm:text-sm font-semibold border border-indigo-500/40">
                Free Practice
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">Interview Date: {createdAt}</span>
            </div>

            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${
              source === 'ai' ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30' : 'bg-white/5 text-gray-200 border border-white/10'
            }`}>
              {source === 'ai' ? 'AI Feedback' : 'Quick Feedback'}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <div
        className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 shadow-[0_8px_32px_rgba(168,85,247,0.3)]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Performance</h2>
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
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Question Summary</h3>

        {/* Aggregated strengths & improvements (from summary or perQuestionFeedback) */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white/6 rounded-xl border border-green-400/10">
            <p className="text-sm font-semibold text-green-300 mb-2">Top Strengths</p>
            <div className="flex flex-wrap gap-2">
              {(summary.keyStrengths || []).slice(0, 6).map((s, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-green-600/10 text-green-300 rounded-full">{s}</span>
              ))}
              {!(summary.keyStrengths && summary.keyStrengths.length) && (
                <span className="text-xs text-gray-400">No strengths detected</span>
              )}
            </div>
          </div>

          <div className="p-3 bg-white/6 rounded-xl border border-blue-400/10">
            <p className="text-sm font-semibold text-blue-300 mb-2">Opportunities</p>
            <div className="flex flex-wrap gap-2">
              {(summary.areasToImprove || []).slice(0, 6).map((s, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-blue-600/10 text-blue-300 rounded-full">{s}</span>
              ))}
              {!(summary.areasToImprove && summary.areasToImprove.length) && (
                <span className="text-xs text-gray-400">No improvements suggested</span>
              )}
            </div>
          </div>
        </div>

        {summary.perQuestionFeedback && summary.perQuestionFeedback.length > 0 ? (
          <div className="space-y-4">
            {summary.perQuestionFeedback.map((feedback, idx) => (
              <div
                key={idx}
                className="border-l-4 border-purple-500 px-4 md:pl-6 py-4 bg-white/5 backdrop-blur-md rounded-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h4 className="font-semibold text-white text-base md:text-lg">Question {idx + 1}</h4>
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
                  aria-expanded={!!expandedAnswers[idx]}
                >
                  <span>{expandedAnswers[idx] ? "▼" : "▶"}</span>
                  <span>{expandedAnswers[idx] ? "Hide Answer" : "Show Answer"}</span>
                </button>

                {/* Answer Text (Collapsible) */}
                {expandedAnswers[idx] && (
                  <div className="mb-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
                    <p className="text-sm text-indigo-300 font-medium mb-1">Your Answer:</p>
                    <p className="text-sm md:text-base text-gray-300 whitespace-pre-wrap">{feedback.answer || "No answer provided"}</p>

                    {/* Render strengths and improvements as chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(feedback.strengths || []).map((s, i) => (
                        <span key={`s-${i}`} className="text-xs px-2 py-1 bg-green-600/10 text-green-300 rounded-full">{s}</span>
                      ))}
                      {(feedback.improvements || []).map((s, i) => (
                        <span key={`i-${i}`} className="text-xs px-2 py-1 bg-red-600/10 text-red-300 rounded-full">{s}</span>
                      ))}
                    </div>
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
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Want Detailed AI-Powered Feedback? 🚀</h3>
        <p className="text-sm sm:text-base text-purple-100 mb-3 sm:mb-4">Upgrade to resume-based interviews for in-depth analysis, personalized recommendations, and career-specific insights!</p>
        <button onClick={() => navigate("/dashboard")} className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white text-purple-600 text-sm sm:text-base font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition">
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
          className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-white/20 transition border border-white/20"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FreeInterviewFeedback;
