const express = require("express");
const router = express.Router();
const { Message } = require("../../models/DBModels");

router.get("/messages", async (req, res) => {
  try {
    let { conversationId } = req.query;

    // Ensure it's sorted (just like on server-side WS save)
    conversationId = conversationId.split("-").sort().join("-");

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name");
    res.json(messages);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
