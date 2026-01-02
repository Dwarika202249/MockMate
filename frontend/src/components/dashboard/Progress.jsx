import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiTrendingDown, FiTarget, FiClock } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";
import InterviewService from "../../services/InterviewService";
import toast from "react-hot-toast";

const Progress = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comprehensive skill patterns for extraction
  const SKILL_PATTERNS = {
    languages: ['javascript', 'typescript', 'python', 'java', 'c', 'c++', 'cpp', 'c#', 'csharp', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'perl', 'r', 'matlab', 'dart', 'elixir', 'haskell', 'lua', 'shell', 'bash', 'powershell'],
    frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'jsx', 'tsx', 'css', 'html', 'sass', 'tailwind', 'bootstrap', 'nextjs', 'next.js'],
    backend: ['node', 'nodejs', 'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'nestjs', 'nest.js'],
    api: ['api', 'rest', 'restful', 'graphql', 'grpc', 'websocket', 'http'],
    database: ['mongodb', 'sql', 'postgres', 'postgresql', 'mysql', 'redis', 'dynamodb', 'cassandra', 'database'],
    tools: ['git', 'github', 'docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'aws', 'azure', 'gcp'],
    concepts: ['async', 'promise', 'callback', 'closure', 'oop', 'functional', 'algorithm', 'data structure', 'design pattern'],
    testing: ['jest', 'mocha', 'chai', 'testing', 'unit test', 'integration test', 'e2e', 'tdd'],
    state: ['redux', 'mobx', 'zustand', 'context', 'state management'],
  };

  // Smart skill extraction function
  const extractSkillsFromText = (text, score = 0) => {
    if (!text || typeof text !== 'string') return {};
    
    const skills = {};
    const lowerText = text.toLowerCase();
    
    // Flatten all patterns and search
    Object.values(SKILL_PATTERNS).flat().forEach(pattern => {
      // Escape special regex characters
      const escapedPattern = pattern.replace(/[+*?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedPattern}\\b`, 'gi');
      if (regex.test(lowerText)) {
        // Normalize skill name
        const normalized = pattern
          .split(/[.\s-]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        skills[normalized] = score;
      }
    });
    
    return skills;
  };

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

          // HYBRID APPROACH: Extract skills from multiple sources
          if (data.interviews.length > 0) {
            const skillMap = {}; // { skillName: { totalScore: number, count: number } }
            
            data.interviews.forEach((interview) => {
              // SOURCE 1: Summary fields (resume interviews - if available)
              if (interview.summary) {
                // Check keyStrengths (preferred for resume interviews)
                if (Array.isArray(interview.summary.keyStrengths) && interview.summary.keyStrengths.length > 0) {
                  interview.summary.keyStrengths.forEach((strength) => {
                    const extractedSkills = extractSkillsFromText(strength, 85); // High score for strengths
                    Object.entries(extractedSkills).forEach(([skill, score]) => {
                      if (!skillMap[skill]) {
                        skillMap[skill] = { totalScore: 0, count: 0 };
                      }
                      skillMap[skill].totalScore += score;
                      skillMap[skill].count += 1;
                    });
                  });
                }
                
                // Check areasToImprove (need focus)
                if (Array.isArray(interview.summary.areasToImprove) && interview.summary.areasToImprove.length > 0) {
                  interview.summary.areasToImprove.forEach((area) => {
                    const extractedSkills = extractSkillsFromText(area, 50); // Lower score for improvement areas
                    Object.entries(extractedSkills).forEach(([skill, score]) => {
                      if (!skillMap[skill]) {
                        skillMap[skill] = { totalScore: 0, count: 0 };
                      }
                      skillMap[skill].totalScore += score;
                      skillMap[skill].count += 1;
                    });
                  });
                }

                // Check perQuestionFeedback (free interviews)
                if (Array.isArray(interview.summary.perQuestionFeedback)) {
                  interview.summary.perQuestionFeedback.forEach((feedback) => {
                    const score = feedback.score || 0;
                    
                    // Extract from strengths
                    if (Array.isArray(feedback.strengths)) {
                      feedback.strengths.forEach((strength) => {
                        const extractedSkills = extractSkillsFromText(strength, score);
                        Object.entries(extractedSkills).forEach(([skill, _]) => {
                          if (!skillMap[skill]) {
                            skillMap[skill] = { totalScore: 0, count: 0 };
                          }
                          skillMap[skill].totalScore += score;
                          skillMap[skill].count += 1;
                        });
                      });
                    }
                    
                    // Extract from improvements
                    if (Array.isArray(feedback.improvements)) {
                      feedback.improvements.forEach((improvement) => {
                        const extractedSkills = extractSkillsFromText(improvement, Math.max(score - 20, 40));
                        Object.entries(extractedSkills).forEach(([skill, _]) => {
                          if (!skillMap[skill]) {
                            skillMap[skill] = { totalScore: 0, count: 0 };
                          }
                          skillMap[skill].totalScore += Math.max(score - 20, 40);
                          skillMap[skill].count += 1;
                        });
                      });
                    }
                  });
                }
              }
              
              // SOURCE 2: Answers feedback (fallback & additional data)
              if (Array.isArray(interview.answers)) {
                interview.answers.forEach((answer) => {
                  if (answer.feedback) {
                    const score = answer.feedback.score || 0;
                    
                    // Direct keywords (highest priority)
                    if (Array.isArray(answer.feedback.keywords)) {
                      answer.feedback.keywords.forEach((keyword) => {
                        const normalized = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
                        if (!skillMap[normalized]) {
                          skillMap[normalized] = { totalScore: 0, count: 0 };
                        }
                        skillMap[normalized].totalScore += score;
                        skillMap[normalized].count += 1;
                      });
                    }
                    
                    // Extract from strengths text
                    if (Array.isArray(answer.feedback.strengths)) {
                      answer.feedback.strengths.forEach((strength) => {
                        const extractedSkills = extractSkillsFromText(strength, score);
                        Object.entries(extractedSkills).forEach(([skill, _]) => {
                          if (!skillMap[skill]) {
                            skillMap[skill] = { totalScore: 0, count: 0 };
                          }
                          skillMap[skill].totalScore += score;
                          skillMap[skill].count += 1;
                        });
                      });
                    }
                    
                    // Extract from improvements text
                    if (Array.isArray(answer.feedback.improvements)) {
                      answer.feedback.improvements.forEach((improvement) => {
                        const extractedSkills = extractSkillsFromText(improvement, Math.max(score - 15, 45));
                        Object.entries(extractedSkills).forEach(([skill, _]) => {
                          if (!skillMap[skill]) {
                            skillMap[skill] = { totalScore: 0, count: 0 };
                          }
                          skillMap[skill].totalScore += Math.max(score - 15, 45);
                          skillMap[skill].count += 1;
                        });
                      });
                    }
                  }
                });
              }
            });

            // Calculate final averaged scores
            const calculatedSkills = Object.entries(skillMap)
              .map(([skill, data]) => ({
                skill,
                score: Math.min(100, Math.round(data.totalScore / data.count)),
                mentions: data.count, // For debugging/confidence
              }))
              .filter(skill => skill.score > 0) // Remove zero scores
              .sort((a, b) => {
                // Sort by score first, then by mentions (confidence)
                if (b.score !== a.score) return b.score - a.score;
                return b.mentions - a.mentions;
              })
              .slice(0, 5); // Top 5 skills

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

  // Calculate performance trend (current vs previous interviews)
  const performanceTrend = useMemo(() => {
    if (interviews.length < 2) return { percentage: 0, isPositive: true };

    // Split interviews into two halves: recent vs previous
    const halfPoint = Math.ceil(interviews.length / 2);
    const recentInterviews = interviews.slice(0, halfPoint); // Most recent half
    const previousInterviews = interviews.slice(halfPoint); // Older half

    if (recentInterviews.length === 0 || previousInterviews.length === 0) {
      return { percentage: 0, isPositive: true };
    }

    // Calculate averages
    const recentAvg = recentInterviews.reduce((sum, i) => sum + i.score, 0) / recentInterviews.length;
    const previousAvg = previousInterviews.reduce((sum, i) => sum + i.score, 0) / previousInterviews.length;

    if (previousAvg === 0) return { percentage: 0, isPositive: true };

    const percentageChange = ((recentAvg - previousAvg) / previousAvg) * 100;
    return {
      percentage: Math.abs(Math.round(percentageChange)),
      isPositive: percentageChange >= 0
    };
  }, [interviews]);

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
      <div className="w-full h-full flex items-end justify-center gap-6 p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        {skills.map((skill, index) => {
          const barHeight = (skill.score / maxScore) * (chartHeight - padding);
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="relative h-48 w-14 bg-white/10 rounded-lg overflow-hidden flex items-end backdrop-blur-sm border border-white/20">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-lg transition-all duration-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  style={{ height: `${(skill.score / maxScore) * 100}%` }}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-bold text-xs rotation-90 origin-center whitespace-nowrap">
                      {skill.score}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-200 text-center">
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
    <div className="relative p-3 sm:p-4 md:p-6 bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] min-h-screen overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 flex items-center gap-2 drop-shadow-lg">
            <FiTrendingUp className="text-purple-400 flex-shrink-0 text-lg sm:text-xl drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            <span className="truncate">Progress Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 mt-1 sm:mt-2">
            Monitor your performance and skill development
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
              </div>
              <p className="mt-4 text-gray-200 font-medium">
                Loading your interview data...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-300 font-medium">
              ⚠️ {error}
            </p>
            <p className="text-red-400 text-sm mt-1">
              Please refresh the page or try again later.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && interviews.length === 0 && !error && (
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 text-center">
            <p className="text-purple-300 font-medium text-lg">
              🚀 No interviews yet
            </p>
            <p className="text-gray-300 mt-2">
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
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-3 sm:p-4 md:p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)]">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <FiTrendingUp className="text-purple-400 text-sm sm:text-base drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                  <span className="hidden sm:inline">Overall Performance Trend</span>
                  <span className="sm:hidden">Performance</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Last 10 Interviews
                </p>
              </div>
            </div>

            {/* Current Average Score KPI */}
            <div className="relative z-10 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 backdrop-blur-md rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-purple-500/40 shadow-[0_4px_16px_rgba(168,85,247,0.2)]">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 drop-shadow-lg">
                    {averageScore}
                  </span>
                  <span className="text-base sm:text-lg text-gray-300">/100</span>
                </div>
                {performanceTrend.percentage > 0 && (
                  <span className={`text-xs sm:text-sm font-medium flex items-center gap-1 sm:ml-auto ${
                    performanceTrend.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {performanceTrend.isPositive ? (
                      <FiTrendingUp className="drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]" />
                    ) : (
                      <FiTrendingDown className="drop-shadow-[0_0_4px_rgba(248,113,113,0.5)]" />
                    )}
                    {performanceTrend.isPositive ? '+' : '-'}{performanceTrend.percentage}% vs previous interviews
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mt-2">Current Average Score</p>
            </div>

            {/* Line Chart */}
            <div className="relative z-10 bg-white/5 backdrop-blur-md rounded-xl p-2 sm:p-4 overflow-x-auto border border-white/10">
              <div className="min-w-[320px]">
                <LineChart data={trendData} width={400} height={220} />
              </div>
            </div>
          </div>

          {/* Component 2: Skill Mastery Breakdown */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-3 sm:p-4 md:p-6 border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(99,102,241,0.3)]">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FiTarget className="text-indigo-400 text-sm sm:text-base drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="hidden sm:inline">Skill Mastery Breakdown</span>
                <span className="sm:hidden">Skills</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">Focus Areas</p>
            </div>

            {/* Bar Chart */}
            <div className="relative z-10 mt-3 sm:mt-4 md:mt-6 overflow-x-auto">
              {skillData.length > 0 ? (
                <div className="min-w-[280px]">
                  <SkillChart skills={skillData} />
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="text-center">
                    <p className="text-gray-300 text-sm font-medium">No skill data available yet</p>
                    <p className="text-gray-400 text-xs mt-1">Complete more interviews with detailed feedback</p>
                  </div>
                </div>
              )}
            </div>

            {/* Skill Insights */}
            {skillData.length > 0 && (
              <div className="relative z-10 mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-white/10">
                <h3 className="text-xs sm:text-sm font-bold text-gray-200 mb-2 sm:mb-3">
                  Top Strengths & Focus Areas
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="p-2 sm:p-3 bg-green-500/10 backdrop-blur-md rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all duration-300">
                    <p className="text-[10px] sm:text-xs text-green-400 font-semibold">
                      🎯 Strongest
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white">{skillData[0]?.skill} ({skillData[0]?.score})</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-orange-500/10 backdrop-blur-md rounded-lg border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300">
                    <p className="text-[10px] sm:text-xs text-orange-400 font-semibold">
                      📈 Needs Focus
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white">{skillData[skillData.length - 1]?.skill} ({skillData[skillData.length - 1]?.score})</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Component 3: Interview Log Summary Table */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-3 sm:p-4 md:p-6 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative z-10 mb-3 sm:mb-4 md:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FiClock className="text-cyan-400 text-sm sm:text-base drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              Interview Log Summary
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">Last 5 interviews</p>
          </div>

          {/* Mobile Card View */}
          <div className="relative z-10 block lg:hidden space-y-3">
            {lastFiveInterviews.map((interview) => (
              <div key={interview.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-gray-400">
                    {new Date(interview.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      })}
                    </p>
                    <p className="text-sm font-semibold text-white">{interview.role}</p>
                  </div>
                  <span className="text-xs text-gray-400">{interview.timeTaken}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{interview.score}</span>
                    <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
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
                    className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    View
                    <MdKeyboardArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="relative z-10 hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-white/10 bg-white/5">
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-200">
                    Date
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-200">
                    Role
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-200">
                    Final Score
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-200">
                    Time Taken
                  </th>
                  <th className="px-4 md:px-6 py-3 text-center text-sm font-semibold text-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {lastFiveInterviews.map((interview) => (
                  <tr
                    key={interview.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-300">
                    {new Date(interview.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      })}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-white font-medium">
                      {interview.role}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {interview.score}
                        </span>
                        <div className="w-20 md:w-24 h-2 bg-white/10 rounded-full overflow-hidden">
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
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-300">
                      {interview.timeTaken}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(interview.id)}
                        className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-medium text-purple-400 hover:bg-purple-500/20 rounded-lg transition-all duration-300 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
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
          <div className="relative z-10 mt-3 sm:mt-4 text-center">
            <button
              onClick={() => navigate("/dashboard/interview-history")}
              className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 mx-auto transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
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
    </div>
  );
};

export default Progress;
