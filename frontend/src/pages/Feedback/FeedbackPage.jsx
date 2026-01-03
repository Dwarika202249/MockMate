import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import InterviewService from "../../services/InterviewService";
import FreeInterviewFeedback from "./FreeInterviewFeedback";
import ResumeInterviewFeedback from "./ResumeInterviewFeedback";
import FeedbackService from "../../services/FeedbackService";

const FeedbackPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);


  useEffect(() => {
    const fetchFeedbackAndInterview = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both feedback (may 404) and interview metadata in parallel
        const feedbackPromise = FeedbackService.getFeedbackByInterviewId(interviewId).catch((e) => ({ _err: e }));
        const interviewPromise = InterviewService.getInterview(interviewId).catch((e) => ({ _err: e }));

        const [feedbackRes, interviewRes] = await Promise.all([feedbackPromise, interviewPromise]);

        if (!interviewRes || interviewRes._err) {
          // Interview must exist
          const err = interviewRes?._err || new Error('Interview not found');
          console.error('❌ Error fetching interview:', err);
          setError(err.message || 'Failed to load interview');
          return;
        }

        setInterview(interviewRes.interview || interviewRes);

        if (feedbackRes && !feedbackRes._err) {
          setFeedback(feedbackRes.feedback || feedbackRes);
        } else {
          // No feedback yet — leave feedback null
        }
      } catch (err) {
        console.error("❌ Unexpected error fetching feedback/interview:", err);
        setError(err.message || "Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchFeedbackAndInterview();
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

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 mt-20">
          <div className="bg-yellow-500/10 backdrop-blur-xl border-l-4 border-yellow-500 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">No Interview Data</h2>
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

  // Prefer structured feedback when available, otherwise fall back to interview fields
  // Merge interview.summary as fallback so per-question feedback from interview is shown when Feedback doc lacks it
  const mergedSummary = {
    ...(interview.summary || {}),
    ...(feedback && feedback.summary ? feedback.summary : {})
  };
  const summary = mergedSummary;
  const answers = (feedback && feedback.answers) || interview.answers || [];
  const questions = (feedback && feedback.questions) || interview.questions || [];
  const resume = interview.resume || {};
  const interviewType = interview.type || (feedback && feedback.source === 'local' ? 'free' : 'resume') || 'resume'; // Default to 'resume' for backward compatibility
  const createdAt = interview.createdAt
    ? new Date(interview.createdAt).toLocaleDateString()
    : "N/A";

  // Calculate overall score
  const overallScore =
    (answers && answers.length > 0)
      ? Math.round(
          answers.reduce((sum, ans) => sum + (ans.feedback?.score || 0), 0) /
            answers.length
        )
      : (summary && (summary.averageScore || summary.overallScore)) || 0;

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

        <FreeInterviewFeedback
          interview={interview}
          interviewId={interviewId}
          summary={summary}
          answers={answers}
          resume={resume}
          performance={performance}
          overallScore={overallScore}
          createdAt={createdAt}
          navigate={navigate}
          source={feedback?.source || 'local'}
        />
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

      <ResumeInterviewFeedback
        interview={interview}
        interviewId={interviewId}
        summary={summary}
        answers={answers}
        questions={questions}
        resume={resume}
        performance={performance}
        overallScore={overallScore}
        createdAt={createdAt}
        navigate={navigate}
        source={feedback?.source || 'ai'}
      />
    </div>
  );
};

export default FeedbackPage;

