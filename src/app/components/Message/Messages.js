import React, { useState } from "react";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatList from "./ChatList";
import { useAuth } from "@/app/context/AuthContext";
import "./style.css";

const originalUsers = [
  {
    id: 27,
    name: "Emeka Okafor",
    profileImage: "../../assets/userprofile1.png",
    lastMessage: "Looking forward to your response.",
    time: "10:00AM",
    avatarIcon: faInstagram,
    unreadCount: 2,
    messages: [
      { text: "Hello Chioma! How's everything going?", time: "09:10", status: "SENT" },
      { text: "I wanted to check in on the project status.", time: "09:15", status: "DELIVERED" },
      { text: "Let me know if there’s anything you need from my side.", time: "09:20", status: "READ" },
      { text: "Are we still on track for the deadline?", time: "09:25", status: "DELIVERED" },
      { text: "Please update me when you have a moment.", time: "09:30", status: "FAILED" },
      { text: "I'm here if you need any assistance.", time: "09:35", status: "SENDING" },
      { text: "Do you need any additional resources?", time: "09:40", status: "DELIVERED" },
      { text: "Looking forward to your response.", time: "09:45", status: "READ" },
      { text: "Just checking in again to ensure everything is okay.", time: "09:50", status: "SENT" },
      { text: "Any updates on the current task?", time: "09:55", status: "SENT" },
      { text: "Please let me know when you're available.", time: "10:00", status: "DELIVERED" },
    ],
  },
  {
    id: 2,
    name: "Amaka Johnson",
    profileImage: "../../assets/userprofile2.png",
    lastMessage: "Can we reschedule our meeting?",
    time: "9:45AM",
    avatarIcon: faInstagram,
    unreadCount: 1,
    messages: [
      { text: "Hi Sade, let me know what works for you.", time: "09:30", status: "READ" },
    ],
  },
  {
    id: 3,
    name: "Bola Adebayo",
    profileImage: "../../assets/userprofile2.png",
    lastMessage: "Image Attached",
    time: "9:30AM",
    avatarIcon: faInstagram,
    unreadCount: 0,
    messages: [
      { text: "Here's the image you requested.", time: "09:25", status: "DELIVERED" },
    ],
  },
  {
    id: 4,
    name: "Nkechi Eze",
    profileImage: "../../assets/userprofile2.png",
    lastMessage: "Image Attached",
    time: "9:30AM",
    avatarIcon: faInstagram,
    unreadCount: 0,
    messages: [
      { text: "Here's the image you requested.", time: "09:25", status: "SENT" },
    ],
  },
  {
    id: 5,
    name: "Chidi Nwosu",
    profileImage: "../../assets/userprofile2.png",
    lastMessage: "Image Attached",
    time: "9:30AM",
    avatarIcon: faInstagram,
    unreadCount: 0,
    messages: [
      { text: "Here's the image you requested.", time: "09:25", status: "FAILED" },
    ],
  },
  {
    id: 6,
    name: "Tunde Oladipo",
    profileImage: "../../assets/userprofile2.png",
    lastMessage: "Image Attached",
    time: "9:30AM",
    avatarIcon: faInstagram,
    unreadCount: 0,
    messages: [
      { text: "Here's the image you requested.", time: "09:25", status: "SENT" },
    ],
  },
];

export const Messages = () => {
  const [message, setMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const { user: currentUser } = useAuth();

  const usersWithUserIds = originalUsers.map((user) => ({
    ...user,
    messages: user.messages.map((msg) => ({...msg, userId: user.id})),
  }));

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { text: message, time: new Date().toLocaleTimeString(), status: 'DELIVERED' };
      setActiveUser({
        ...activeUser,
        messages: [
          ...activeUser.messages,
          { userId: activeUser.id, ...newMessage }
        ],
      });
      setMessage("");
    }
  };

  return (
    <div className="messages m-4">
      <ChatList users={usersWithUserIds} activeUser={activeUser} setActiveUser={setActiveUser} />
      <div className="detail">
        {activeUser ? (
          <>
            <ChatHeader activeUser={activeUser} />
            <MessageList activeUser={activeUser} currentUserId={currentUser?.user_id} />
            <MessageInput
              message={message}
              onInputChange={handleInputChange}
              onSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className="no-chat-selected">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};
