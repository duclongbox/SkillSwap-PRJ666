import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export const authService = {
  async getSkills() {
    const response = await axios.post(`${ API_BASE_URL}/api/skills`);
    return response.data;
  }
};