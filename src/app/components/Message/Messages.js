import React, { useState, useEffect } from "react";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatList from "./ChatList";
import { useAuth } from "@/context/AuthContext";
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
      { 
        text: "Hello Chioma! How's everything going?", 
        image: "", 
        audio: "", 
        time: "09:10", 
        status: "SENT",
        messageType: "text"
      },
      { 
        text: "I wanted to check in on the project status.", 
        image: "", 
        audio: "", 
        time: "09:15", 
        status: "DELIVERED", 
        messageType: "text"
      },
      { 
        text: "Here's the image you requested.", 
        image: "../../assets/requested_image.png", 
        audio: "", 
        time: "09:20", 
        status: "READ", 
        messageType: "text-image"
      },
      { 
        text: "", 
        image: "../../assets/another_image.png", 
        audio: "", 
        time: "09:25", 
        status: "DELIVERED", 
        messageType: "image"
      },
      { 
        text: "Failed", 
        image: "", 
        audio: "../../assets/audio_file.mp3", 
        time: "09:30", 
        status: "FAILED", 
        messageType: "audio"
      },
      { 
        text: "I'm here if you need any assistance.", 
        image: "", 
        audio: "", 
        time: "09:35", 
        status: "SENDING", 
        messageType: "text"
      },
      { 
        text: "", 
        image: "", 
        audio: "../../assets/voice_note.mp3", 
        time: "09:45", 
        status: "READ", 
        messageType: "audio"
      },
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
      { 
        text: "Hi Sade, let me know what works for you.", 
        image: "", 
        audio: "", 
        time: "09:30", 
        status: "READ", 
        messageType: "text"
      },
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
      { 
        text: "Here's the image you requested.", 
        image: "../../assets/bola_image.png", 
        audio: "", 
        time: "09:25", 
        status: "DELIVERED", 
        messageType: "text-image"
      },
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
      { 
        text: "", 
        image: "../../assets/nkechi_image.png", 
        audio: "", 
        time: "09:25", 
        status: "SENT", 
        messageType: "image"
      },
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
      { 
        text: "Here's the image you requested.", 
        image: "../../assets/chidi_image.png", 
        audio: "", 
        time: "09:25", 
        status: "FAILED", 
        messageType: "text-image"
      },
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
      { 
        text: "", 
        image: "../../assets/tunde_image.png", 
        audio: "", 
        time: "09:25", 
        status: "SENT", 
        messageType: "image"
      },
    ],
  },
];


export const Messages = () => {
  const [message, setMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const { user: currentUser } = useAuth();
  const [socket, setSocket] = useState(null);

  const usersWithUserIds = originalUsers.map((user) => ({
    ...user,
    messages: user.messages.map((msg) => ({...msg, userId: user.id})),
  }));

  useEffect(() => {
    const ws = new WebSocket("ws://staging.core.nativetalkcrm.com:8001/ws/chat/");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  
  const handleSendMessage = (messageContent) => {
    const newMessage = {
      userId: activeUser.id,
      time: new Date().toLocaleTimeString(),
      status: "DELIVERED",
      ...messageContent,
    };
    setActiveUser({
      ...activeUser,
      messages: [...activeUser.messages, newMessage],
    });
    setMessage("");
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
              audioRecordingEnabled
            />
          </>
        ) : (
          <div className="no-chat-selected">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};
