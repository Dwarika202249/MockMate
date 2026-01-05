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
    <div className="relative p-4 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white/3 to-white/5 border border-white/5 min-h-[220px] flex flex-col justify-between">
      {/* Top row: difficulty / premium (left) and last score (right) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {quiz.isPremium && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600/20 text-amber-200 rounded-full text-xs">⚡ Premium • {quiz.creditCost}c</div>
          )}
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${quiz.difficulty === 'easy' ? 'bg-green-600/20 text-green-200' : quiz.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-200' : 'bg-red-600/20 text-rose-200'}`}>{quiz.difficulty}</div>
        </div>

        <div className="text-right">
          {lastAttempt ? (
            <>
              <div className="text-xs text-gray-300">Last</div>
              <div className="font-bold text-white rounded-full px-3 py-1 bg-black/40">{Math.round(lastAttempt.totalScore)} pts</div>
            </>
          ) : (
            <div className="text-xs text-gray-400">No attempts</div>
          )}
        </div>
      </div>

      {/* Middle: title + description */}
      <div className="mt-3">
        <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">{quiz.title}</h3>
        <p className="text-sm text-gray-300 mt-2 line-clamp-3">{quiz.description}</p>
      </div>

      {/* Bottom row: tags (left) and action button (right) */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2 max-w-xs">
          {(quiz.techTags || []).slice(0,5).map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/90">#{t}</span>
          ))}
        </div>

        <div className="ml-4 flex-shrink-0">
          <button aria-label={`Start ${quiz.title}`} onClick={handleStart} className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm shadow-lg">{lastAttempt ? 'Restart' : 'Start'}</button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;