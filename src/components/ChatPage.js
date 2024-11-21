import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../utils/api';
import './ChatPage.css';
import { SocketContext } from '../App';

const ChatPage = ({ currentUserId }) => {
  const { donorId, donationId } = useParams();
  const [chatGroups, setChatGroups] = useState([]);
  const [selectedChatGroupId, setSelectedChatGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const messagesEndRef = useRef(null); // useRef for scrolling

  useEffect(() => {
    const fetchChatGroups = async () => {
      try {
        const response = await apiGet(`/api/chats/user/${currentUserId}`);
        setChatGroups(response);
      } catch (error) {
        console.error("Error fetching chat groups:", error);
      }
    };

    fetchChatGroups();
  }, [currentUserId]);

  // Fetch messages for the selected chat group
  useEffect(() => {
    if (selectedChatGroupId) {
      socket.emit('joinChatGroup', selectedChatGroupId);

      const fetchMessages = async () => {
        try {
          const response = await apiGet(`/api/chats/messages/${selectedChatGroupId}`);
          setMessages(response);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();

      socket.on('messageReceived', (messageData) => {
        if (messageData.chatGroupId === selectedChatGroupId) {
          setMessages((prevMessages) => [...prevMessages, messageData]);
        }
      });

      return () => {
        socket.emit('leaveChatGroup', selectedChatGroupId); 
        socket.off('messageReceived');
      };
    }
  }, [selectedChatGroupId, socket]);

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // This will trigger when new messages are added

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await apiPost('/api/messages', {
        chatGroupId: selectedChatGroupId,
        senderId: currentUserId,
        content: newMessage,
      });

      const newMsgData = {
        chatGroupId: selectedChatGroupId,
        sender: currentUserId,
        content: newMessage,
        _id: response.messageId,
      };

      setNewMessage('');
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: currentUserId, 
          content: newMessage, 
          _id: response.messageId,
        },
      ]);
      socket.emit('sendMessage', newMsgData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-list">
        <h2>Chats</h2>
        {chatGroups.length > 0 ? (
          chatGroups.map((chatGroup) => (
            <div
              key={chatGroup._id}
              onClick={() => setSelectedChatGroupId(chatGroup._id)}
              className={selectedChatGroupId === chatGroup._id ? 'chat-item active' : 'chat-item'}
            >
              {chatGroup.groupName}
            </div>
          ))
        ) : (
          <p>No chats available.</p>
        )}
      </div>
      <div className="chat-messages">
        {selectedChatGroupId ? (
          <>
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${msg.sender === currentUserId ? 'own' : 'received'}`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* This is where the scroll will stop */}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
