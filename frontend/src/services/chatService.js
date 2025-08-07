import axios from "axios";

export const chatService = {
  getMessages: async (conversationId) => {
    const res = await axios.get(
      `http://localhost:8000/chat/messages?conversationId=${conversationId}`,
      { withCredentials: true }
    );
    return res.data;
  },
};
