import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizService from '../../services/QuizService';

const AttemptPage = () => {
  const { id, attemptId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = await QuizService.get(id);
      setQuiz(data.quiz);
    };
    load();
  }, [id]);

  const toggleChoice = (qId, choiceId, scoringType) => {
    setAnswers(prev => {
      const cur = prev[qId] || [];
      if (scoringType === 'single') return { ...prev, [qId]: [choiceId] };
      // multiple
      const set = new Set(cur);
      if (set.has(choiceId)) set.delete(choiceId); else set.add(choiceId);
      return { ...prev, [qId]: Array.from(set) };
    });
  };

  const submit = async () => {
    // build answers
    const payload = { attemptId, answers: Object.keys(answers).map(qid => ({ questionId: qid, selectedChoiceIds: answers[qid] })) };
    const res = await QuizService.submit(id, payload);
    navigate(`/dashboard/quizzes/${id}/result/${attemptId}`, { state: { result: res } });
  };

  const cancelAttempt = async () => {
    try {
      await QuizService.cancelAttempt(id, attemptId);
      navigate('/dashboard/quizzes');
    } catch (err) {
      console.error('Failed to cancel attempt', err);
      alert('Failed to cancel attempt');
    }
  };

  if (!quiz) return <div>Loading...</div>;
  const q = quiz.questions[currentIdx];
  const pct = Math.round(((currentIdx + 1) / quiz.questions.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">{quiz.title}</h2>
        <div className="text-sm text-gray-300">{currentIdx + 1}/{quiz.questions.length}</div>
      </div>

      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600" style={{ width: `${pct}%` }}></div>
      </div>

      <div className="mt-4 bg-white/5 p-4 rounded-2xl">
        <div className="mb-2 text-gray-300 text-sm">Question</div>
        <div className="text-white font-medium mb-4 text-lg">{q.text}</div>

        <div className="grid gap-3">
          {q.choices.map(c => {
            const selected = (answers[q.id] || []).includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleChoice(q.id, c.id, q.scoringType)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ease-in-out border transform ${selected ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg scale-102' : 'bg-white/5 border-white/6 text-white hover:scale-[1.02] hover:shadow-md'}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm">{c.text}</div>
                  {c.explain && <div className="text-xs text-gray-300">{c.explain}</div>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-4">
          <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)} className="flex-1 px-3 py-2 rounded-xl bg-white/5 text-white">Back</button>
          {currentIdx < quiz.questions.length - 1 ? (
            <button onClick={() => setCurrentIdx(i => i + 1)} className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Next</button>
          ) : (
            <button onClick={submit} className="flex-1 px-3 py-2 rounded-xl bg-green-600 text-white">Submit Quiz</button>
          )}
        </div>

        <div className="mt-3 flex justify-end">
          <button onClick={cancelAttempt} className="text-xs text-rose-400 underline">Cancel attempt</button>
        </div>
      </div>
    </div>
  );
};

export default AttemptPage;