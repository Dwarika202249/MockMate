import React, { useEffect, useState } from 'react';
import QuizService from '../../services/QuizService';
import QuizCard from '../../components/quizzes/QuizCard';
import Pagination from '../../components/shared/Pagination';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [isPremium, setIsPremium] = useState(null); // null = all, true = premium, false = free

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const params = { search, page, limit: 12 };
      if (selectedTech) params.tags = selectedTech;
      if (isPremium !== null) params.isPremium = isPremium;

      const data = await QuizService.list(params);
      setQuizzes(data.quizzes || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load quizzes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, page, selectedTech, isPremium]);

  // Reset page when featured changes
  useEffect(() => {
    setPage(1);
  }, [selectedTech, isPremium]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await QuizService.featured();
        setFeatured(res.featured || []);
      } catch (err) {
        // ignore
      }
    };
    loadFeatured();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-between">
        <div className="flex-1 min-w-0 sm:max-w-xl">
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search quizzes..." className="w-full p-3 rounded-xl bg-black/20 border border-white/10 placeholder-gray-400 text-white" />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button aria-pressed={isPremium === null} onClick={() => { setIsPremium(null); setPage(1); }} className={`px-4 py-2 rounded-full text-white text-sm ${isPremium === null ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-white/5'}`}>All</button>
          <button aria-pressed={isPremium === false} onClick={() => { setIsPremium(false); setPage(1); }} className={`px-4 py-2 rounded-full text-white text-sm ${isPremium === false ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-white/5'}`}>Free</button>
          <button aria-pressed={isPremium === true} onClick={() => { setIsPremium(true); setPage(1); }} className={`px-4 py-2 rounded-full text-white text-sm ${isPremium === true ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-white/5'}`}>Premium</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {featured.map(t => (
            <button key={t} onClick={() => { setSelectedTech(selectedTech === t ? null : t); setPage(1); }} className={`px-3 py-1 rounded-full text-sm ${selectedTech === t ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-white/5 text-white'}`}>#{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? <div>Loading...</div> : quizzes.map(q => (
          <QuizCard key={q._id} quiz={q} />
        ))}
      </div>

      <div className="mt-6">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
};

export default QuizzesPage;