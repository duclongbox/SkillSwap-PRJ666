import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export const authService = {
  async login(email, password) {
    const response = await axios.post(`${ API_BASE_URL}/api/login`, {
      email,
      password
    });
    return response.data;
  },

  async register(name, email, password) {
    const response = await axios.post(`${ API_BASE_URL}/api/register`, {
      name,
      email,
      password
    });
    return response.data;
  },

  async logout() {
    const response = await axios.post(`${ API_BASE_URL}/api/logout`);
    return response.data;
  },

  async checkSessionStatus() {
    const response = await axios.get(`${ API_BASE_URL}/api/session-status`);
    return response.data;
  },

  async getCurrentUser() {
    const response = await axios.get(`${ API_BASE_URL}/api/me`);
    return response.data;
  }
}; 