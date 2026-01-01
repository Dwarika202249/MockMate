import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreditsService = {
  // Get user's credit balance and events
  getCredits: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/credits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const response = await axios.get(`${API_URL}/credits/check`, {
        params: { required },
        headers: { Authorization: `Bearer ${token}` }
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
      const response = await axios.post(
        `${API_URL}/credits/purchase`,
        { amount, paymentId, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error purchasing credits:', error);
      throw error;
    }
  }
};

export default CreditsService;
