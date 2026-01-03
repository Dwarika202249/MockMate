import axios from 'axios';
import InterviewService from './InterviewService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class FeedbackService {
  static getAuthHeaders() {
    return InterviewService.getAuthHeaders();
  }

  static async getFeedbackByInterviewId(interviewId) {
    try {
      const response = await axios.get(`${API_URL}/feedback/${interviewId}`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      throw InterviewService.handleError(error);
    }
  }

  static async createFeedback(payload) {
    try {
      const response = await axios.post(`${API_URL}/feedback`, payload, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      throw InterviewService.handleError(error);
    }
  }

  static async updateFeedback(id, payload) {
    try {
      const response = await axios.patch(`${API_URL}/feedback/${id}`, payload, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      throw InterviewService.handleError(error);
    }
  }
}

export default FeedbackService;