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
    name: "Uche",
    profileImage: "../../assets/userprofile1.png",
    lastMessage: "I’m Nia! My first investment...",
    time: "10:00AM",
    avatarIcon: faInstagram,
    unreadCount: 2,
    messages: [
      { text: "Hello Chioma! consectetur adipiscing elit ames.", time: "09:10" },
      { text: "How have you been?", time: "09:15" },
    ],
  },
  {
    id: 2,
    name: "Victory",
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
    name: "Mubarak",
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
