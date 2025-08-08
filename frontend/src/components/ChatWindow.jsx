import React, { useState, useEffect, useRef } from "react";
import { chatService } from "../services/chatService";

function ChatWindow({ user, conversationId }) {
  const userId = user._id || user.id;
  const userName = user.name || user.email || "Anonymous";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://skillswap-prj666-3ag6.onrender.com");

    ws.current.onopen = () => console.log("WebSocket connected");

    ws.current.onmessage = async (event) => {
      try {
        let raw = event.data;
        if (raw instanceof Blob) raw = await raw.text();
        const data = JSON.parse(raw);

        if (data.type === "chatMessage") {
          const incoming = data.message;

          setMessages((prev) => {
            // Remove optimistic messages that match this incoming message (same sender & content, no createdAt)
            const filtered = prev.filter(
              (msg) =>
                !(
                  !msg.createdAt &&
                  msg.content === incoming.content &&
                  String(msg.sender) === String(incoming.sender)
                )
            );

            // Avoid duplicates if message with same createdAt already exists
            const exists = filtered.some(
              (msg) =>
                msg.content === incoming.content &&
                String(msg.sender) === String(incoming.sender) &&
                msg.createdAt === incoming.createdAt
            );
            if (exists) return filtered;

            return [...filtered, incoming];
          });
        }
      } catch (e) {
        console.error("Message parse error", e);
      }
    };

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    async function fetchMessages() {
      try {
        const data = await chatService.getMessages(conversationId);

        // Normalize sender to string ID and extract senderName for display
        const normalized = data.map((msg) => ({
          ...msg,
          sender: typeof msg.sender === "object" && msg.sender?._id ? msg.sender._id : msg.sender,
          senderName: msg.sender?.name || msg.senderName || "Unknown",
        }));

        setMessages(normalized);
      } catch (err) {
        console.error("Failed to load messages:", err);
        setMessages([]);
      }
    }

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(content) {
    if (!content.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const message = {
      type: "chatMessage",
      conversationId,
      sender: userId,
      senderName: userName,
      content,
    };

    // Optimistic message without createdAt (server adds it)
    setMessages((prev) => [...prev, message]);
    ws.current.send(JSON.stringify(message));
    setInput("");
  }

  return (
    <div className="flex flex-col h-[60vh] bg-white rounded-lg shadow p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, i) => {
          const isMe = String(msg.sender) === String(userId);
          return (
            <div
              key={i}
              className={`max-w-[75%] p-3 rounded-lg ${
                isMe ? "bg-blue-100 ml-auto text-right" : "bg-gray-100 mr-auto text-left"
              }`}
            >
              <div className="text-xs text-gray-600 mb-1">{isMe ? "You" : msg.senderName}</div>
              <div className="text-sm">{msg.content}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              handleSend(input);
            }
          }}
        />
        <button
          onClick={() => handleSend(input)}
          className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;