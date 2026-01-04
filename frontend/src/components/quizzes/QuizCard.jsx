import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizService from '../../services/QuizService';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();
  const [lastAttempt, setLastAttempt] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await QuizService.lastAttempt(quiz._id);
        if (!mounted) return;
        // defensive: ensure res is an object and attempt is present
        if (res && typeof res === 'object' && res.attempt) {
          setLastAttempt(res.attempt);
        } else {
          setLastAttempt(null);
        }
      } catch (err) {
        // silent
        if (mounted) setLastAttempt(null);
      }
    };
    load();
    return () => { mounted = false; };
  }, [quiz._id]);

  const handleStart = () => navigate(`/dashboard/quizzes/${quiz._id}`);

  return (
    <div className="relative p-4 pb-12 sm:pb-6 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white/3 to-white/5 border border-white/5 min-h-[170px] flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-lg sm:text-xl font-semibold text-white">{quiz.title}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {quiz.isPremium && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600/20 text-amber-200 rounded-full text-xs">⚡ Premium • {quiz.creditCost}c</div>
              )}
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${quiz.difficulty === 'easy' ? 'bg-green-600/20 text-green-200' : quiz.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-200' : 'bg-red-600/20 text-red-200'}`}>{quiz.difficulty}</div>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-3 line-clamp-3">{quiz.description}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            {(quiz.techTags || []).slice(0,5).map(t => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/90">#{t}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
          {lastAttempt ? (
            <div className="text-right">
              <div className="text-xs text-gray-300">Last</div>
              <div className="font-bold text-white rounded-full px-3 py-1 bg-black/40">{Math.round(lastAttempt.totalScore)} pts</div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">No attempts</div>
          )}
        </div>

        {/* Button anchored bottom-right on larger screens, full-width at bottom on mobile */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4 w-full sm:w-auto flex justify-end">
          <button onClick={handleStart} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm shadow-lg">{lastAttempt ? 'Restart' : 'Start'}</button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;