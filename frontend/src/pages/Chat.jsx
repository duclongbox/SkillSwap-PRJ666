import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function ChatPage() {
  const { user } = useAuth();
  const { userId: chatUserId } = useParams();

  const [connections, setConnections] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function fetchConnections() {
      try {
        const res = await authService.getConnections();
        const accepted = res.connections?.filter(conn => conn.status === "accepted") || [];
        setConnections(accepted);

        if (chatUserId) {
          const found = accepted.find(conn => {
            const otherUser = getOtherUser(conn, user._id);
            return otherUser._id?.toString() === chatUserId;
          });

          if (found) {
            const otherUser = getOtherUser(found, user._id);
            setSelectedUser(otherUser);
            setSelectedConversationId(buildConversationId(user._id, otherUser._id));
          }
        } else if (!selectedConversationId && accepted.length > 0) {
          const first = accepted[0];
          const otherUser = getOtherUser(first, user._id);
          setSelectedUser(otherUser);
          setSelectedConversationId(buildConversationId(user._id, otherUser._id));
        }
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    }

    fetchConnections();
  }, [user, chatUserId]);

  function buildConversationId(userA, userB) {
    return [userA?.toString(), userB?.toString()].sort().join("-");
  }

  function getOtherUser(connection, currentUserId) {
    const currentId = currentUserId?.toString?.();
    return connection.sender._id?.toString() === currentId
      ? connection.recipient
      : connection.sender;
  }

  function handleSelectChat(connection) {
    const otherUser = getOtherUser(connection, user._id);
    setSelectedUser(otherUser);
    setSelectedConversationId(buildConversationId(user._id, otherUser._id));
  }

  if (!user) {
    return <div className="text-center text-gray-500 mt-10">Please log in to access chat.</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8">
      <div className="w-full max-w-6xl flex bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Panel: Connections */}
        <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto max-h-[80vh] bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-gray-800">My Conversations</h2>
          {connections.length === 0 ? (
            <p className="text-gray-500">No connections yet</p>
          ) : (
            <ul>
              {connections.map(conn => {
                const otherUser = getOtherUser(conn, user._id);
                const convoId = buildConversationId(user._id, otherUser._id);
                const avatarUrl = otherUser.avatar || otherUser.image || otherUser.photo;

                return (
                  <li
                    key={conn._id}
                    onClick={() => handleSelectChat(conn)}
                    className={`flex items-center gap-3 p-2 mb-2 rounded-lg cursor-pointer transition ${
                      convoId === selectedConversationId ? "bg-blue-100" : "hover:bg-gray-100"
                    }`}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 text-white flex items-center justify-center font-semibold text-lg">
                        {otherUser.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-800">
                        {otherUser.name || otherUser.email}
                      </div>
                      <div className="text-sm text-gray-500">{otherUser.email}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right Panel: Chat Window */}
        <div className="w-2/3 p-6">
          {selectedConversationId && selectedUser ? (
            <>
              <h2 className="text-lg font-semibold mb-2 text-blue-600">
                Chatting with {selectedUser.name || selectedUser.email}
              </h2>
              <div className="flex-1 overflow-y-auto max-h-[70vh]">
                <ChatWindow user={user} conversationId={selectedConversationId} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a connection to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;