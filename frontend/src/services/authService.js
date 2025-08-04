import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password
    });
    return response.data;
  },

  async register(name, email, password) {
    const response = await axios.post(`${API_BASE_URL}/api/register`, {
      name,
      email,
      password
    });
    return response.data;
  },

  async logout() {
    const response = await axios.post(`${API_BASE_URL}/api/logout`,
      {
        withCredentials: true
      }
    );
    return response.data;
  },

  async checkSessionStatus() {
    const response = await axios.get(`${API_BASE_URL}/api/session-status`,
      {
        withCredentials: true
      }
    );
    return response.data;
  },

  async getCurrentUser() {
    const response = await axios.get(`${API_BASE_URL}/api/me`,
      {
        withCredentials: true
      }
    );
    return response.data;
  },
  async getConnections() {
    const response = await axios.get(`${API_BASE_URL}/api/connections`,{
      withCredentials: true
    });
    return response.data;
  },
  async getRequests() {
    const response = await axios.get(`${API_BASE_URL}/api/requests`,{
      withCredentials: true
    });
    return response.data;
  },
  async declineRequest(requestId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/${requestId}/decline`,{
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to decline the request'
    }
  },
  async acceptRequest(requestId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/${requestId}/accept`,{
        withCredentials: true
      });
  
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to accept the request'
    }
  }

}; 