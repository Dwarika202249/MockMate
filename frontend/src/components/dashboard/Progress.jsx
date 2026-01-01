import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiTarget, FiClock } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";
import InterviewService from "../../services/InterviewService";
import toast from "react-hot-toast";

const Progress = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [skillData, setSkillData] = useState([
    { skill: "React", score: 85 },
    { skill: "JavaScript", score: 75 },
    { skill: "Redux", score: 60 },
    { skill: "CSS/Tailwind", score: 80 },
    { skill: "Node.js", score: 70 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch interview history on component mount
  useEffect(() => {
    const fetchInterviewHistory = async () => {
      try {
        setLoading(true);
        const data = await InterviewService.getInterviewHistory(1, 10);
        
        if (data.interviews && data.interviews.length > 0) {
          // Transform API data to match component format
          const transformedInterviews = data.interviews.map((interview) => {
            // Calculate time taken - prioritize duration, fallback to pausedState
            let timeTaken = "N/A";
            if (interview.duration) {
              timeTaken = `${Math.round(interview.duration / 60)} mins`;
            } else if (interview.pausedState?.elapsedTime) {
              timeTaken = `${Math.round(interview.pausedState.elapsedTime / 60)} mins`;
            }
            
            return {
              id: interview._id,
              date: new Date(interview.createdAt).toISOString().split("T")[0],
              role: interview.type === 'free' 
                ? (interview.details || 'Free Practice Interview')
                : (interview.resume?.jobRole || "Unknown Role"),
              score: interview.summary?.averageScore || interview.summary?.overallScore || 0,
              timeTaken,
              createdAt: interview.createdAt,
            };
          });

          setInterviews(transformedInterviews);

          // Extract skill scores from both free and resume interviews
          if (data.interviews.length > 0) {
            const skillMap = {};
            
            data.interviews.forEach((interview) => {
              // For free interviews - use perQuestionFeedback
              if (interview.summary?.perQuestionFeedback && Array.isArray(interview.summary.perQuestionFeedback)) {
                interview.summary.perQuestionFeedback.forEach((feedback) => {
                  // Extract keywords from strengths and improvements
                  const allKeywords = [
                    ...(feedback.strengths || []),
                    ...(feedback.improvements || [])
                  ];
                  
                  allKeywords.forEach((keyword) => {
                    // Extract actual skill words (simplified)
                    const words = keyword.toLowerCase().match(/\b(react|javascript|node|redux|css|tailwind|api|rest|graphql|typescript|python|sql|mongodb)\b/gi);
                    if (words) {
                      words.forEach((word) => {
                        const normalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                        skillMap[normalizedWord] = (skillMap[normalizedWord] || 0) + (feedback.score || 0);
                      });
                    }
                  });
                });
              }
              
              // For resume interviews - use answers array
              if (interview.answers && Array.isArray(interview.answers)) {
                interview.answers.forEach((answer) => {
                  if (answer.feedback) {
                    // Check for keywords array
                    if (Array.isArray(answer.feedback.keywords)) {
                      answer.feedback.keywords.forEach((keyword) => {
                        skillMap[keyword] = (skillMap[keyword] || 0) + (answer.feedback.score || 0);
                      });
                    }
                    // Also check strengths/improvements
                    const allKeywords = [
                      ...(answer.feedback.strengths || []),
                      ...(answer.feedback.improvements || [])
                    ];
                    allKeywords.forEach((keyword) => {
                      const words = keyword.toLowerCase().match(/\b(react|javascript|node|redux|css|tailwind|api|rest|graphql|typescript|python|sql|mongodb)\b/gi);
                      if (words) {
                        words.forEach((word) => {
                          const normalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                          skillMap[normalizedWord] = (skillMap[normalizedWord] || 0) + (answer.feedback.score || 0);
                        });
                      }
                    });
                  }
                });
              }
            });

            // Convert to skill scores (top 5)
            const calculatedSkills = Object.entries(skillMap)
              .map(([skill, totalScore]) => ({
                skill,
                score: Math.min(100, Math.round(totalScore / data.interviews.length)),
              }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 5);

            if (calculatedSkills.length > 0) {
              setSkillData(calculatedSkills);
            }
          }
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching interview history:", err);
        setError(err.message || "Failed to load interview data");
        toast.error("Failed to load interview history");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewHistory();
  }, []);

  // Handle view details navigation
  const handleViewDetails = (interviewId) => {
    navigate(`/feedback/${interviewId}`);
  };

  // Calculate trend data from interviews (last 10 scores)
  const trendData = useMemo(() => {
    if (interviews.length === 0) {
      return [
        { interview: 1, score: 0 },
        { interview: 2, score: 0 },
      ];
    }

    const trends = interviews
      .slice(0, Math.min(10, interviews.length))
      .reverse()
      .map((interview, index) => ({
        interview: index + 1,
        score: interview.score || 0,
      }));
    

    return trends;
  }, [interviews]);

  // Calculate average score
  const averageScore = useMemo(() => {
    if (trendData.length === 0) return 0;
    const sum = trendData.reduce((acc, item) => acc + item.score, 0);
    return Math.round(sum / trendData.length);
  }, [trendData]);

  // Simple Line Chart Component (SVG-based)
  const LineChart = ({ data, width = 400, height = 250 }) => {
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const maxScore = 100;
    const minScore = 0;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth + padding;
      const y =
        height -
        padding -
        ((item.score - minScore) / (maxScore - minScore)) * chartHeight;
      return { x, y, score: item.score };
    });

    const pathD = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    return (
      <svg width={width} height={height} className="w-full h-full">
        {/* Grid lines */}
        {[20, 40, 60, 80, 100].map((value) => {
          const y =
            height -
            padding -
            ((value - minScore) / (maxScore - minScore)) * chartHeight;
          return (
            <g key={`grid-${value}`}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text
                x={padding - 10}
                y={y + 4}
                fontSize="12"
                fill="#6b7280"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <text
            key={`label-${index}`}
            x={point.x}
            y={height - padding + 20}
            fontSize="12"
            fill="#6b7280"
            textAnchor="middle"
          >
            {index + 1}
          </text>
        ))}

        {/* Line path */}
        <path
          d={pathD}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points (circles) */}
        {points.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#7c3aed"
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  };

  // Simple Radar Chart Component (Bar Chart alternative)
  const SkillChart = ({ skills, maxScore = 100 }) => {
    const chartHeight = 250;
    const padding = 40;

    return (
      <div className="w-full h-full flex items-end justify-center gap-6 p-6 bg-gray-50 rounded-lg">
        {skills.map((skill, index) => {
          const barHeight = (skill.score / maxScore) * (chartHeight - padding);
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="relative h-48 w-14 bg-gray-200 rounded-md overflow-hidden flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-md transition-all duration-500"
                  style={{ height: `${(skill.score / maxScore) * 100}%` }}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-bold text-xs rotation-90 origin-center whitespace-nowrap">
                      {skill.score}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">
                {skill.skill}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const lastFiveInterviews = interviews.slice(0, 5);

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FiTrendingUp className="text-purple-600 flex-shrink-0 text-lg sm:text-xl" />
          <span className="truncate">Progress Tracking</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
          Monitor your performance
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading your interview data...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">
            ⚠️ {error}
          </p>
          <p className="text-red-600 text-sm mt-1">
            Please refresh the page or try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && interviews.length === 0 && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-700 font-medium text-lg">
            No interviews yet
          </p>
          <p className="text-blue-600 mt-2">
            Complete your first interview to see progress tracking and analytics
          </p>
        </div>
      )}

      {/* Main Content */}
      {!loading && interviews.length > 0 && (
        <>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
        {/* Component 1: Overall Performance Trend */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiTrendingUp className="text-purple-600 text-sm sm:text-base" />
                <span className="hidden sm:inline">Overall Performance Trend</span>
                <span className="sm:hidden">Performance</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Last 10 Interviews
              </p>
            </div>
          </div>

          {/* Current Average Score KPI */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-purple-200">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-purple-600">
                  {averageScore}
                </span>
                <span className="text-base sm:text-lg text-gray-600">/100</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center gap-1 sm:ml-auto">
                <FiTrendingUp /> +8% this month
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Current Average Score</p>
          </div>

          {/* Line Chart */}
          <div className="bg-gray-50 rounded-lg p-2 sm:p-4 overflow-x-auto">
            <div className="min-w-[320px]">
              <LineChart data={trendData} width={400} height={220} />
            </div>
          </div>
        </div>

        {/* Component 2: Skill Mastery Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 border-l-4 border-blue-600">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiTarget className="text-blue-600 text-sm sm:text-base" />
              <span className="hidden sm:inline">Skill Mastery Breakdown</span>
              <span className="sm:hidden">Skills</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Focus Areas</p>
          </div>

          {/* Bar Chart */}
          <div className="mt-3 sm:mt-4 md:mt-6 overflow-x-auto">
            <div className="min-w-[280px]">
              <SkillChart skills={skillData} />
            </div>
          </div>

          {/* Skill Insights */}
          <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200">
            <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              Top Strengths & Focus Areas
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-[10px] sm:text-xs text-green-700 font-semibold">
                  🎯 Strongest
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-800">{skillData[0]?.skill} ({skillData[0]?.score})</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-[10px] sm:text-xs text-orange-700 font-semibold">
                  📈 Needs Focus
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-800">{skillData[skillData.length - 1]?.skill} ({skillData[skillData.length - 1]?.score})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component 3: Interview Log Summary Table */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
        <div className="mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiClock className="text-indigo-600 text-sm sm:text-base" />
            Interview Log Summary
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Last 5 interviews</p>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {lastFiveInterviews.map((interview) => (
            <div key={interview.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-500">
                    {new Date(interview.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{interview.role}</p>
                </div>
                <span className="text-xs text-gray-600">{interview.timeTaken}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{interview.score}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        interview.score >= 80
                          ? "bg-green-500"
                          : interview.score >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${interview.score}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(interview.id)}
                  className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  View
                  <MdKeyboardArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Final Score
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Time Taken
                </th>
                <th className="px-4 md:px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {lastFiveInterviews.map((interview) => (
                <tr
                  key={interview.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700">
                    {new Date(interview.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700 font-medium">
                    {interview.role}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">
                        {interview.score}
                      </span>
                      <div className="w-20 md:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            interview.score >= 80
                              ? "bg-green-500"
                              : interview.score >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${interview.score}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700">
                    {interview.timeTaken}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                    <button
                      onClick={() => handleViewDetails(interview.id)}
                      className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <span className="hidden md:inline">View Details</span>
                      <span className="md:hidden">View</span>
                      <MdKeyboardArrowRight size={16} className="md:hidden" />
                      <MdKeyboardArrowRight size={18} className="hidden md:inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View All Link */}
        <div className="mt-3 sm:mt-4 text-center">
          <button
            onClick={() => navigate("/dashboard/interview-history")}
            className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 mx-auto"
          >
            View All Interviews
            <MdKeyboardArrowRight size={16} className="sm:hidden" />
            <MdKeyboardArrowRight size={18} className="hidden sm:inline" />
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Progress;
