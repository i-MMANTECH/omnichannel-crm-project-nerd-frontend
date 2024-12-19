import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatList from "./ChatList";
import { useAuth } from "@/context/AuthContext";
import "./style.css";
import { useApi } from "@/services/axiosConfig";
import { useError } from '@/context/ErrorContext';


export const Messages = () => {
  const { axiosInstance } = useApi();
  const { user: currentUser } = useAuth();

  const [message, setMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const { handleApiError } = useError();

  const handleSendMessage = (messageContent) => {
    const payload = {
      lead_id: activeUser.id,
      content: messageContent.text || "",
      content_type: "text",
    };
  
    axiosInstance
      .post("/communication/send-to-lead/", payload)
      .then((response) => {
        console.log("Message sent successfully:", response.data);
  
        setActiveUser((prevUser) => {
          const updatedMessages = prevUser.messages
            ? [...prevUser.messages, {
                id: response.data.id,
                content: messageContent.text,
                content_type: "text",
                created_at: new Date().toISOString(),
                status: "SENT",
                user_sender: currentUser?.user_id,
                lead_receiver: activeUser.id,
              }]
            : [{
                id: response.data.id,
                content: messageContent.text,
                content_type: "text",
                created_at: new Date().toISOString(),
                status: "SENT",
                user_sender: currentUser?.user_id,
                lead_receiver: activeUser.id,
              }];
          
          return {
            ...prevUser,
            messages: updatedMessages,
          };
        });
  
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  useEffect(() => {
    const fetchScript = async () => {
        try {
          const response = await axiosInstance.get('/companies/details/',
            {},
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );

          if (response.data.company) {
            setCompanyId(response.data.company.id);
          } 
        } catch (error) {
          handleApiError(error)
        }
    };

    fetchScript();
  }, []);

  useEffect(() => {
    if (activeUser) {
      axiosInstance
        .get(`/communication/history/?lead_id=${activeUser.id}`)
        .then((response) => {
          setChatHistory(response.data.messages || []);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });
    }
  }, [activeUser]);
  
  useEffect(() => {
    axiosInstance
      .get("/communication/contacts/")
      .then((response) => {
        console.log("contacts list ", response.data)
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  
 useEffect(() => {
  if (companyId) {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://ws-staging.nativetalkcrm.com/ws/chat/?uuid=${companyId}&type=company`;

    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.message;
      if (message.content.lead_receiver === activeUser?.id) {
        setChatHistory((prev) => [...prev, message]);
      }
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
  }
}, [companyId]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="overflow-y-hidden messages flex items-start body-theme border border-gray-500 rounded-lg relative h-[80vh] m-4">
      <ChatList users={users} activeUser={activeUser} setActiveUser={setActiveUser} />
      <div className="detail">
        {activeUser ? (
          <>
            <ChatHeader activeUser={activeUser} />
            <div className="flex items-center grow">
              <MessageList 
                chatHistory={chatHistory} 
                currentUserId={currentUser?.user_id} 
                />

              <MessageInput
                message={message}
                onInputChange={handleInputChange}
                onSendMessage={handleSendMessage}
                audioRecordingEnabled
              />
            </div>
          </>
        ) : (
          <div className="no-chat-selected">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};
