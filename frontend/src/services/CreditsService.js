import api from '../utils/api';

const CreditsService = {
  // Get user's credit balance and events
  getCredits: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Avoid unauthenticated requests that cause noisy 401s
        return { balance: 0, events: [], grantedAt: null };
      }
      const response = await api.get('/api/credits');
      return response.data;
    } catch (error) {
      console.error('Error fetching credits:', error);
      throw error;
    }
  },

  // Check if user has enough credits
  checkCredits: async (required) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { hasEnough: false, balance: 0 };
      }
      const response = await api.get('/api/credits/check', {
        params: { required }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking credits:', error);
      throw error;
    }
  },

  // Purchase credits (will be called after Stripe payment)
  purchaseCredits: async (amount, paymentId, orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const response = await api.post('/api/credits/purchase', { amount, paymentId, orderId });
      return response.data;
    } catch (error) {
      console.error('Error purchasing credits:', error);
      throw error;
    }
  }
};

export default CreditsService;
