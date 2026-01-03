import React, { useState } from "react";

const ResumeInterviewFeedback = ({
  interview,
  interviewId,
  questions = [],
  summary = {},
  answers = [],
  resume = {},
  performance,
  overallScore,
  createdAt,
  navigate,
  source = 'ai'
}) => {
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const toggleAnswer = (index) => {
    setExpandedAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:p-8 mt-20">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 mb-2 drop-shadow-lg">
          Detailed Interview Analysis
        </h1>
        <div className="flex flex-col text-sm md:text-base text-gray-300">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-purple-600/30 backdrop-blur-md text-purple-300 rounded-full text-xs sm:text-sm font-semibold border border-purple-500/40">
                Resume-Based
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
          <span className="text-xs sm:text-sm mt-1">Position: {resume.jobRole || "N/A"}</span>
        </div>
      </div>

      {/* Overall Score Card */}
      <div
        className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 shadow-[0_8px_32px_rgba(168,85,247,0.3)]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Overall Performance</h2>
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
                  <span className="text-green-400 font-bold mr-3 mt-1">•</span>
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
              <li className="text-gray-400 italic">No areas for improvement recorded</li>
            )}
          </ul>
        </div>
      </div>

      {/* Recommended Resources */}
      {summary.recommendedResources && summary.recommendedResources.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 border-t-4 border-t-purple-500 mb-6 md:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
            <span className="text-purple-400 text-2xl sm:text-3xl mr-2 sm:mr-3">📚</span>
            Recommended Resources
          </h3>
          <ul className="space-y-3">
            {summary.recommendedResources.map((resource, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-purple-400 font-bold mr-3 mt-1">→</span>
                <span className="text-gray-300">{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Answer Feedback */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6 mb-6 md:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Answer-by-Answer Feedback</h3>

        {summary.perQuestionFeedback && summary.perQuestionFeedback.length > 0 ? (
          <div className="space-y-4">
            {summary.perQuestionFeedback.map((fb, idx) => (
              <div key={idx} className="border-l-4 border-purple-500 px-4 md:pl-6 py-4 bg-white/5 backdrop-blur-md rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h4 className="font-semibold text-white text-base md:text-lg">Question {idx + 1}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit backdrop-blur-md border ${
                    fb.label === "Excellent" ? "bg-green-500/20 text-green-300 border-green-500/40" : fb.label === "Good" ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : fb.label === "OK" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" : "bg-red-500/20 text-red-300 border-red-500/40"
                  }`}>
                    {fb.label} ({fb.score}/100)
                  </span>
                </div>

                <div className="mb-3 p-3 bg-white/5 rounded-xl border border-purple-500/20">
                  <p className="text-sm text-gray-400 font-medium mb-1">Question:</p>
                  <p className="text-sm md:text-base text-gray-200">{fb.question}</p>
                </div>

                <button onClick={() => toggleAnswer(idx)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm mb-3 transition" aria-expanded={!!expandedAnswers[idx]}>
                  <span>{expandedAnswers[idx] ? '▼' : '▶'}</span>
                  <span>{expandedAnswers[idx] ? 'Hide Answer' : 'Show Answer'}</span>
                </button>

                {expandedAnswers[idx] && (
                  <div className="mb-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
                    <p className="text-sm text-indigo-300 font-medium mb-1">Your Answer:</p>
                    <p className="text-sm md:text-base text-gray-300 whitespace-pre-wrap">{fb.answer || 'No answer provided'}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(fb.strengths || []).map((s, i) => (<span key={`s-${i}`} className="text-xs px-2 py-1 bg-green-600/10 text-green-300 rounded-full">{s}</span>))}
                      {(fb.improvements || []).map((s, i) => (<span key={`i-${i}`} className="text-xs px-2 py-1 bg-blue-600/10 text-blue-300 rounded-full">{s}</span>))}
                    </div>
                  </div>
                )}

                {fb.strengths && fb.strengths.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-green-400 mb-1">✓ What went well:</p>
                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1">{fb.strengths.map((s, i) => (<li key={i} className="ml-4">• {s}</li>))}</ul>
                  </div>
                )}

                {fb.improvements && fb.improvements.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-blue-400 mb-1">→ Could improve:</p>
                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1">{fb.improvements.map((s, i) => (<li key={i} className="ml-4">• {s}</li>))}</ul>
                  </div>
                )}

                {fb.feedback && (
                  <p className="text-sm text-gray-300 italic border-t border-purple-500/30 pt-3 mt-3">"{fb.feedback}"</p>
                )}
              </div>
            ))}
          </div>
        ) : answers.length > 0 ? (
          <div className="space-y-6">
            {answers.map((answer, idx) => (
              <div key={idx} className="border-l-4 border-purple-500 pl-6 py-4 bg-white/5 backdrop-blur-md rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Question {idx + 1}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md border mr-5 ${
                    answer.feedback?.label === "Excellent" ? "bg-green-500/20 text-green-300 border-green-500/40" : answer.feedback?.label === "Good" ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : answer.feedback?.label === "Fair" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" : "bg-red-500/20 text-red-300 border-red-500/40"
                  }`}>
                    {answer.feedback?.label || "Poor"} ({answer.feedback?.score || 0}/100)
                  </span>
                </div>

                <div className="mb-3 p-3 bg-white/5 rounded-xl border border-purple-500/20 mr-5">
                  <p className="text-sm text-gray-400 font-medium mb-1">Question:</p>
                  <p className="text-sm md:text-base text-gray-200">{questions[idx]?.text || 'Question text not available'}</p>
                </div>

                <button onClick={() => toggleAnswer(idx)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm mb-3 transition" aria-expanded={!!expandedAnswers[idx]}>
                  <span>{expandedAnswers[idx] ? '▼' : '▶'}</span>
                  <span>{expandedAnswers[idx] ? 'Hide Answer' : 'Show Answer'}</span>
                </button>

                {expandedAnswers[idx] && (
                  <div className="mb-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
                    <p className="text-sm text-indigo-300 font-medium mb-1">Your Answer:</p>
                    <p className="text-sm md:text-base text-gray-300 whitespace-pre-wrap">{answer.text || 'No answer provided'}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(answer.feedback?.strengths || []).map((s, i) => (<span key={`s-${i}`} className="text-xs px-2 py-1 bg-green-600/10 text-green-300 rounded-full">{s}</span>))}
                      {(answer.feedback?.improvements || []).map((s, i) => (<span key={`i-${i}`} className="text-xs px-2 py-1 bg-red-600/10 text-red-300 rounded-full">{s}</span>))}
                    </div>
                  </div>
                )}

                {answer.feedback?.feedback && (
                  <p className="text-sm text-gray-300 italic border-t border-purple-500/30 pt-3 mt-3">"{answer.feedback.feedback}"</p>
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
        <button onClick={() => navigate("/dashboard/interview-history")} className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all border border-purple-500/30">View Interview History</button>
        <button onClick={() => navigate("/dashboard")} className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">Back to Dashboard</button>
      </div>
    </div>
  );
};

export default ResumeInterviewFeedback;
