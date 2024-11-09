import React, { useState } from "react";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import "./style.css";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatList from "./ChatList";

const users = [
  {
    id: 1,
    name: "Emeka Okafor",
    profileImage: "../../assets/userprofile1.png",
    lastMessage: "Looking forward to your response.",
    time: "10:00AM",
    avatarIcon: faInstagram,
    unreadCount: 2,
    messages: [
      { text: "Hello Chioma! How's everything going?", time: "09:10" },
      { text: "I wanted to check in on the project status.", time: "09:15" },
      { text: "Let me know if there’s anything you need from my side.", time: "09:20" },
      { text: "Are we still on track for the deadline?", time: "09:25" },
      { text: "Please update me when you have a moment.", time: "09:30" },
      { text: "I'm here if you need any assistance.", time: "09:35" },
      { text: "Do you need any additional resources?", time: "09:40" },
      { text: "Looking forward to your response.", time: "09:45" },
      { text: "Just checking in again to ensure everything is okay.", time: "09:50" },
      { text: "Any updates on the current task?", time: "09:55" },
      { text: "Please let me know when you're available.", time: "10:00" },
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
      { text: "Hi Sade, let me know what works for you.", time: "09:30" },
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
      { text: "Here's the image you requested.", time: "09:25" },
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
      { text: "Here's the image you requested.", time: "09:25" },
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
      { text: "Here's the image you requested.", time: "09:25" },
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
      { text: "Here's the image you requested.", time: "09:25" },
    ],
  },
];


export const Messages = () => {
  const [message, setMessage] = useState("");
  const [activeUser, setActiveUser] = useState(users[0]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { text: message, time: new Date().toLocaleTimeString() };
      setActiveUser({
        ...activeUser,
        messages: [...activeUser.messages, newMessage],
      });
      setMessage("");
    }
  };

  return (
    <div className="messages m-4">
    <ChatList users={users} activeUser={activeUser} setActiveUser={setActiveUser} />
    <div className="detail">
      <ChatHeader activeUser={activeUser} />
      <MessageList activeUser={activeUser} />
      <MessageInput
        message={message}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
      />
    </div>
  </div>
  );
};
