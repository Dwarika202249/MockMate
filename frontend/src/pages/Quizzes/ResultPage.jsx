import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import QuizService from '../../services/QuizService';

const ResultPage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const result = state?.result;
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      try {
        const res = await QuizService.get(id);
        if (mounted) setQuiz(res.quiz);
      } catch (err) {
        // ignore
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  if (!result) return <div>No result available</div>;

  // Compute breakdown if maxPoints are provided
  const totalQuestions = result.perQuestionResults?.length || 0;
  let correct = 0, partial = 0, wrong = 0;
  let totalMax = 0;
  // Prefer scaled values if available
  result.perQuestionResults?.forEach(r => {
    const score = (typeof r.scaledScore !== 'undefined') ? r.scaledScore : (r.score ?? r.rawScore ?? 0);
    const maxP = (typeof r.scaledMax !== 'undefined') ? r.scaledMax : (r.maxPoints ?? r.rawMax ?? 1);
    totalMax += maxP;
    if (score === 0) wrong++;
    else if (score >= maxP) correct++;
    else partial++;
  });
  const obtained = Math.round((result.totalScore || 0) * 100) / 100;
  const displayTotalMax = result.totalMax ?? totalMax;

  const pct = displayTotalMax > 0 ? Math.round((obtained / displayTotalMax) * 100) : 0;
  const [animatedPct, setAnimatedPct] = React.useState(0);

  React.useEffect(() => {
    // small delay for nicer mount animation
    const t = setTimeout(() => setAnimatedPct(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  const circumference = Math.round(2 * Math.PI * 42);
  const dashOffset = Math.round(circumference * (1 - (animatedPct / 100)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <div className="flex items-center gap-6 col-span-2">
          <div className="relative w-28 h-28">
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#grad)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(.2,.8,.3,1)' }}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ transform: animatedPct ? 'scale(1)' : 'scale(0.88)', transition: 'transform 400ms cubic-bezier(.2,.8,.3,1)' }} className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">{Math.round(result.totalScore)}</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Quiz Results</h2>
            <div className="text-sm text-gray-300">Nice work — review per-question details below.</div>
            <div className="text-sm text-gray-300 mt-1">Obtained: <span className="text-white font-bold">{obtained}/{displayTotalMax}</span> <span className="ml-3 text-sm text-indigo-300">({pct}%)</span></div>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-4 gap-3">
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <div className="text-sm text-gray-300">Questions</div>
            <div className="text-lg font-bold text-white">{totalQuestions}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <div className="text-sm text-gray-300">Correct</div>
            <div className="text-lg font-bold text-green-300">{correct}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <div className="text-sm text-gray-300">Partial</div>
            <div className="text-lg font-bold text-yellow-300">{partial}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <div className="text-sm text-gray-300">Marks</div>
            <div className="text-lg font-bold text-white">{obtained}/{displayTotalMax}</div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-2xl">
        <div className="grid gap-4">
          {result.perQuestionResults.map((r, idx) => {
            const score = (typeof r.scaledScore !== 'undefined') ? r.scaledScore : (r.score ?? r.rawScore ?? 0);
            const maxP = (typeof r.scaledMax !== 'undefined') ? r.scaledMax : (r.maxPoints ?? r.rawMax ?? 1);
            const label = score === 0 ? 'Incorrect' : (score >= maxP ? 'Correct' : 'Partial');
            const colorClass = label === 'Correct' ? 'bg-green-600/20 text-green-200' : label === 'Partial' ? 'bg-yellow-600/20 text-yellow-200' : 'bg-rose-600/20 text-rose-200';

            // Find question details if available
            const question = quiz?.questions?.find(q => q.id === r.questionId) || null;
            const qText = question?.text || ("Question " + (idx + 1));
            const choices = question?.choices || [];

            return (
              <div key={idx} className="p-4 rounded-xl bg-black/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-300">Question {idx + 1}</div>
                    <div className="text-white font-medium">{qText}</div>
                    <div className="mt-3 flex flex-col gap-2">
                      {choices.length ? choices.map(c => {
                        const isSelected = Array.isArray(r.selected) && r.selected.includes(c.id);
                        const isCorrect = !!c.isCorrect;
                        return (
                          <div key={c.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${isSelected ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-white/5 text-white/90'}`}>
                            <div className="text-sm">{c.text}</div>
                            <div className="flex items-center gap-2">
                              {isSelected && <div className={`text-xs px-2 py-1 rounded-full ${isCorrect ? 'bg-green-600/20 text-green-200' : 'bg-rose-600/20 text-rose-200'}`}>{isCorrect ? 'Selected ✓' : 'Selected ✕'}</div>}
                              {!isSelected && isCorrect && <div className="text-xs px-2 py-1 rounded-full bg-green-600/10 text-green-200">Answer</div>}
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="text-sm text-gray-300">(No choices available)</div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-center">
                    <div className={`px-3 py-1 rounded-full text-sm ${colorClass}`}>{label}</div>
                    <div className="text-xs text-gray-400 mt-2">{score}/{maxP}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;