import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const chatService = {
  getMessages: async (conversationId) => {
    const res = await axios.get(
      `${API_BASE_URL}/chat/messages?conversationId=${conversationId}`,
      { withCredentials: true }
    );
    return res.data;
  },
};
