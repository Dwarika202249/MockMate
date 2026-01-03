import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class InterviewService {
    static getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            }
        };
    }

    static async createInterview(resumeId, preferences = {}) {
        try {
            // Backend mounts interview routes at /api/interview
            const response = await axios.post(`${API_URL}/interview`, { resumeId, preferences }, this.getAuthHeaders());
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getInterview(interviewId) {
        try {
            const response = await axios.get(`${API_URL}/interview/${interviewId}`, this.getAuthHeaders());
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async saveMessage(interviewId, message) {
        try {
            const response = await axios.post(`${API_URL}/interview/${interviewId}/message`, message, this.getAuthHeaders());
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async updateInterviewPreferences(interviewId, preferences) {
        try {
            const response = await axios.put(`${API_URL}/interview/${interviewId}/preferences`, preferences, this.getAuthHeaders());
            return response.data;
        } catch (error) {
            const handled = this.handleError(error);
            throw handled;
        }
    }

    static async getInterviewHistory(page = 1, limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/interview/history?page=${page}&limit=${limit}`, this.getAuthHeaders());
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getPublicStats() {
        try {
            const response = await axios.get(`${API_URL}/interview/stats`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static handleError(error) {
        if (error.response) {
            // Server responded with error
            return {
                status: error.response.status,
                message: error.response.data.message || 'Server error occurred'
            };
        } else if (error.request) {
            // Request made but no response
            return {
                status: 503,
                message: 'Unable to reach server'
            };
        } else {
            // Request setup error
            return {
                status: 500,
                message: error.message
            };
        }
    }
}

export default InterviewService;