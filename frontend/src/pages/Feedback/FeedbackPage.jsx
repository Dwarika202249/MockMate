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

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        console.log("📥 Fetching interview details for:", interviewId);

        const response = await InterviewService.getInterview(interviewId);
        console.log("✅ Interview data received:", response);

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 mt-24">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Error Loading Feedback
            </h2>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 mt-24">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">
              No Interview Data
            </h2>
            <p className="text-yellow-700">Could not find interview data.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
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
      : 0;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            Interview Feedback
          </h1>
          <div className="flex flex-col text-gray-600">
            <span>Interview Date: {createdAt}</span>
            <span>Position: {resume.jobRole || "N/A"}</span>
          </div>
        </div>

        {/* Overall Score Card */}
        <div
          className={`${performance.bgColor} border-2 border-transparent rounded-lg p-8 mb-8`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Overall Performance
              </h2>
              <p className={`text-lg ${performance.color} font-semibold`}>
                {performance.label}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-6xl font-bold ${performance.color}`}>
                {overallScore}
              </div>
              <p className="text-gray-600 mt-2">out of 100</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Key Strengths */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-green-500 text-3xl mr-3">✓</span>
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {summary.keyStrengths && summary.keyStrengths.length > 0 ? (
                summary.keyStrengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 font-bold mr-3 mt-1">
                      •
                    </span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No strengths recorded</li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-blue-500 text-3xl mr-3">→</span>
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {summary.areasToImprove && summary.areasToImprove.length > 0 ? (
                summary.areasToImprove.map((area, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 font-bold mr-3 mt-1">•</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">
                  No areas for improvement recorded
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Recommended Resources */}
        {summary.recommendedResources &&
          summary.recommendedResources.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-purple-500 text-3xl mr-3">📚</span>
                Recommended Resources
              </h3>
              <ul className="space-y-3">
                {summary.recommendedResources.map((resource, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-purple-500 font-bold mr-3 mt-1">
                      →
                    </span>
                    <span className="text-gray-700">{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Detailed Answer Feedback */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Answer-by-Answer Feedback
          </h3>

          {answers.length > 0 ? (
            <div className="space-y-6">
              {answers.map((answer, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-indigo-500 pl-6 py-4 bg-gray-50 rounded"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">
                      Question {idx + 1}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        answer.feedback?.label === "Excellent"
                          ? "bg-green-100 text-green-800"
                          : answer.feedback?.label === "Good"
                          ? "bg-blue-100 text-blue-800"
                          : answer.feedback?.label === "Fair"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {answer.feedback?.label || "N/A"} (
                      {answer.feedback?.score || 0}/100)
                    </span>
                  </div>

                  {answer.feedback?.strengths &&
                    answer.feedback.strengths.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-green-700 mb-2">
                          Strengths:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {answer.feedback.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {answer.feedback?.improvements &&
                    answer.feedback.improvements.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Could Improve:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {answer.feedback.improvements.map(
                            (improvement, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-blue-600 mr-2">→</span>
                                <span>{improvement}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {answer.feedback?.feedback && (
                    <p className="text-sm text-gray-600 italic border-t pt-3 mt-3">
                      "{answer.feedback.feedback}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No answer feedback available</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard/interview-history")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            View Interview History
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
