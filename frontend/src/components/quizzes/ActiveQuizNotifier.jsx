import React, { useEffect, useState } from 'react';
import QuizService from '../../services/QuizService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ActiveQuizNotifier = () => {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let lastCount = 0;

    const load = async () => {
      try {
        const resp = await QuizService.listAttempts();
        const count = (resp.attempts || []).length;
        if (mounted) {
          setActive(resp.attempts?.[0] || null);
          if (count > 0 && lastCount === 0) {
            toast.success(`You have ${count} active quiz attempt(s). Resume now.`);
          }
          lastCount = count;
        }
      } catch (err) {
        // ignore
      }
    };

    load();
    const id = setInterval(load, 30 * 1000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  if (!active) return null;

  return (
    <div className="px-3 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white cursor-pointer" onClick={() => navigate(`/dashboard/quizzes/${active.quiz}/attempt/${active._id}`)}>
      Resume quiz • {Math.round(active.totalScore || 0)} pts
    </div>
  );
};

export default ActiveQuizNotifier;