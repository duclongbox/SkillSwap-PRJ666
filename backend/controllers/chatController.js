const { Message } = require("../models/DBModels");

// GET /chat/messages?conversationId=abc-def
exports.getMessages = async (req, res) => {
  const { conversationId } = req.query;
  try {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email");

    const formatted = messages.map((msg) => ({
      sender: msg.sender?._id?.toString?.() || msg.sender?.toString?.(),
      senderName: msg.sender?.name || "Unknown",
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Called from WebSocket server when saving a new message
exports.saveMessage = async ({ conversationId, sender, content }) => {
  try {
    // Ensure consistent ordering of IDs
    const sortedConversationId = conversationId.split("-").sort().join("-");

    const msg = new Message({
      conversationId: sortedConversationId,
      sender,
      content,
    });

    await msg.save();
  } catch (err) {
    console.error("Error saving message:", err);
  }
};
