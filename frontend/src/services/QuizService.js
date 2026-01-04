import api from '../utils/api';

const QuizService = {
  list: async (params = {}) => {
    const resp = await api.get('/api/quizzes', { params });
    return resp.data;
  },
  featured: async () => {
    const resp = await api.get('/api/quizzes/featured');
    return resp.data;
  },
  get: async (id) => {
    const resp = await api.get(`/api/quizzes/${id}`);
    return resp.data;
  },
  start: async (id) => {
    const resp = await api.post(`/api/quizzes/${id}/start`);
    return resp.data;
  },
  submit: async (id, payload) => {
    const resp = await api.post(`/api/quizzes/${id}/submit`, payload);
    return resp.data;
  },
  lastAttempt: async (id) => {
    try {
      const resp = await api.get(`/api/quizzes/${id}/last-attempt`);
      return resp.data;
    } catch (err) {
      // If the endpoint is 401/404 or any error, return a safe empty shape to avoid runtime errors in components
      console.debug('QuizService.lastAttempt error (returning null):', err?.response?.status || err.message || err);
      return { attempt: null };
    }
  },
  cancelAttempt: async (id, attemptId) => {
    const resp = await api.post(`/api/quizzes/${id}/attempt/${attemptId}/cancel`);
    return resp.data;
  },
  // List active attempts for current user
  listAttempts: async () => {
    try {
      const resp = await api.get('/api/quizzes/attempts/active');
      return resp.data;
    } catch (err) {
      console.debug('QuizService.listAttempts error, returning empty list:', err?.response?.status || err.message || err);
      return { attempts: [] };
    }
  }
};

export default QuizService;