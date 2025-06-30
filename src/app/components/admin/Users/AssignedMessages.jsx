import React, { useState } from "react";
import MessageList from "../Message/MessageList";
import UserChatList from "./UserChatList";
import AgentChatHeader from "./AgentChatHeader";
import AgentMessageInput from "./AgentMessageInput";

export default function AssignedMessages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");

  const dummyData = [
    {
      id: 1,
      name: "Chioma Okere",
      message: "I’m Nia! My first investment...",
      time: "10:00AM",
      unreadCount: 2,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 2,
      name: "James Ade",
      message: "Please review the document...",
      time: "11:15AM",
      unreadCount: 1,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 3,
      name: "Lara Smith",
      message: "Can we schedule a meeting?",
      time: "1:30PM",
      unreadCount: 0,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 4,
      name: "Tunde Balogun",
      message: "Got your email, will reply soon.",
      time: "2:00PM",
      unreadCount: 0,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 5,
      name: "Esther Adebayo",
      message: "Check out the new proposal...",
      time: "3:00PM",
      unreadCount: 3,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 6,
      name: "Emeka Obi",
      message: "Let’s finalize the deal tomorrow.",
      time: "4:00PM",
      unreadCount: 1,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 7,
      name: "Sophie Ayodele",
      message: "Are we meeting this evening?",
      time: "5:00PM",
      unreadCount: 0,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 8,
      name: "John Durojaiye",
      message: "I’ll send the report shortly.",
      time: "6:15PM",
      unreadCount: 2,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 9,
      name: "Ruth Nwachukwu",
      message: "Can you send me the details?",
      time: "7:00PM",
      unreadCount: 0,
      imageUrl: "/assets/user-details-image.png",
    },
    {
      id: 10,
      name: "Olumide Adeyemi",
      message: "Just checking in to see if you’re available.",
      time: "8:00PM",
      unreadCount: 4,
      imageUrl: "/assets/user-details-image.png",
    },
  ];

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    const history = [
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
      {
        user_sender: 1,
        content: "Hi! How are you?",
        content_type: "text",
        created_at: new Date(),
        status: "delivered",
      },
      {
        user_sender: 2,
        content: "I’m good, thank you!",
        content_type: "text",
        created_at: new Date(),
        status: "received",
      },
    ];
    setChatHistory(history);
  };

  const handleSendMessage = (messagePayload) => {
    const newMessage = {
      user_sender: 1,
      content: messagePayload.text,
      content_type: "text",
      created_at: new Date(),
      status: "sending",
    };
    setChatHistory((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg === newMessage ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  if (selectedChat) {
    return (
      <div className="flex flex-col items-start gap-4 self-stretch p-6 rounded-lg border border-[#C1C7CF] body-theme">
        <AgentChatHeader selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        <div className="chat-list-border"></div>
        <div className="w-full chat-body">
          <MessageList chatHistory={chatHistory} currentUserId={1} />
        </div>
        <div className="w-full chat-input">
          <AgentMessageInput
            message={message}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    );
  }

  return <UserChatList dummyData={dummyData} handleChatSelect={handleChatSelect} />;
}
