const WebSocket = require("ws");
const { saveMessage } = require("../controllers/chatController");

const wss = new WebSocket.Server({ port: 3001 });
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("WebSocket connected");
  clients.add(ws);

  ws.on("message", async (rawMessage) => {
    try {
      let raw = rawMessage;

      // Handle binary WebSocket frames (Blob-like)
      if (raw instanceof Buffer) raw = raw.toString();

      console.log("RAW MESSAGE:", raw);
      const data = JSON.parse(raw);
      console.log("PARSED DATA:", data);

      if (data.type === "chatMessage") {
        const { sender, senderName, content, conversationId } = data;

        if (!sender || !content || !conversationId) {
          throw new Error(
            "Missing required fields (sender, content, conversationId)"
          );
        }

        // Ensure sorted conversation ID (to match DB)
        const sortedConversationId = conversationId.split("-").sort().join("-");

        // Save to DB
        await saveMessage({
          conversationId: sortedConversationId,
          sender,
          content,
        });

        // Prepare message for broadcast
        const formattedMessage = {
          conversationId: sortedConversationId,
          sender,
          senderName,
          content,
          createdAt: new Date().toISOString(),
        };

        // Broadcast to all connected clients
        for (let client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "chatMessage",
                message: formattedMessage,
              })
            );
          }
        }
      }
    } catch (err) {
      console.error("WS error:", err.message || err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

console.log("WebSocket server running on ws://localhost:3001");
