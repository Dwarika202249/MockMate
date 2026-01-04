import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizService from '../../services/QuizService';
import ConfirmStartModal from '../../components/quizzes/ConfirmStartModal';

const QuizDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await QuizService.get(id);
        setQuiz(data.quiz);
      } catch (err) {
        console.error('Failed to load quiz', err);
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const [lastAttempt, setLastAttempt] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        const res = await QuizService.lastAttempt(id);
        setLastAttempt(res.attempt);
      } catch (err) {
        // ignore
      }
    };
    loadAttempt();
  }, [id]);

  const start = async () => {
    // If premium, show confirm modal
    if (quiz.isPremium && quiz.creditCost > 0) {
      setShowConfirm(true);
      return;
    }

    try {
      setStarting(true);
      const data = await QuizService.start(id);
      navigate(`/dashboard/quizzes/${id}/attempt/${data.attemptId}`);
    } catch (err) {
      console.error('Failed to start quiz', err);
      alert(err.response?.data?.msg || 'Could not start quiz');
    } finally {
      setStarting(false);
    }
  };

  const confirmStart = async () => {
    try {
      setStarting(true);
      const data = await QuizService.start(id);
      setShowConfirm(false);
      navigate(`/dashboard/quizzes/${id}/attempt/${data.attemptId}`);
    } catch (err) {
      console.error('Failed to start quiz', err);
      alert(err.response?.data?.msg || 'Could not start quiz');
    } finally {
      setStarting(false);
    }
  };

  if (loading || !quiz) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-white/3 to-white/5 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">{quiz.title}</h2>
            <p className="text-sm text-gray-300 mt-2 line-clamp-3">{quiz.description}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {(quiz.techTags || []).map(t => <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/90">#{t}</span>)}
              <span className={`text-xs px-2 py-1 rounded-full ${quiz.difficulty === 'easy' ? 'bg-green-600/20 text-green-200' : quiz.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-200' : 'bg-red-600/20 text-red-200'}`}>{quiz.difficulty}</span>
              {quiz.isPremium && <span className="text-xs px-2 py-1 rounded-full bg-amber-600/20 text-amber-200">Premium • {quiz.creditCost}c</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right flex items-center gap-1">
              <div className="text-sm text-gray-300">Questions</div>
              <div className="font-bold text-white">{quiz.questions?.length || 0}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={start} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">{starting ? 'Starting...' : (lastAttempt ? 'Restart Quiz' : 'Start Quiz')}</button>
              <button onClick={() => navigate('/dashboard/quizzes')} className="px-3 py-2 rounded-xl bg-white/5 text-white">Back</button>
            </div>
          </div>
        </div>

        {lastAttempt && (
          <div className="mt-4 text-sm text-gray-300">Last score: <strong className="text-white">{Math.round(lastAttempt.totalScore)} pts</strong></div>
        )}
      </div>

      {showConfirm && <ConfirmStartModal quiz={quiz} onConfirm={confirmStart} onCancel={() => setShowConfirm(false)} />}
    </div>
  );
};

export default QuizDetailPage;