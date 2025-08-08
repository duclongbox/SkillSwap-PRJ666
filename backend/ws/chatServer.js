const WebSocket = require("ws");
const { saveMessage } = require("../controllers/chatController");

module.exports = function (server) {
  const wss = new WebSocket.Server({ server }); // Attach to existing HTTP server
  const clients = new Set();

  wss.on("connection", (ws) => {
    console.log("WebSocket connected");
    clients.add(ws);

    ws.on("message", async (rawMessage) => {
      try {
        let raw = rawMessage;
        if (raw instanceof Buffer) raw = raw.toString();
        const data = JSON.parse(raw);

        if (data.type === "chatMessage") {
          const { sender, senderName, content, conversationId } = data;

          if (!sender || !content || !conversationId) {
            throw new Error("Missing required fields");
          }

          const sortedConversationId = conversationId.split("-").sort().join("-");

          await saveMessage({
            conversationId: sortedConversationId,
            sender,
            content,
          });

          const formattedMessage = {
            conversationId: sortedConversationId,
            sender,
            senderName,
            content,
            createdAt: new Date().toISOString(),
          };

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

  console.log("WebSocket server attached to main HTTP server");
};
