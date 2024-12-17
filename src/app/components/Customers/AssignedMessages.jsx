import react, {useState} from "react";
import MessageList from "../Message/MessageList";
import MessageInput from "../Message/MessageInput";
import CustomerChatList from "./CustomerChatList";
import UserChatList from "../Users/UserChatList";


export default function CustomerAssignedMessages() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    
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
    ];
  
    const handleChatSelect = (chat) => {
      setSelectedChat(chat);
      // Fetch chat history (for now, we'll use dummy data)
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
      ];
      setChatHistory(history);
    };
  
    const handleSendMessage = (messagePayload) => {
      const newMessage = {
        user_sender: 1, // Assuming the current user ID is 1
        content: messagePayload.text,
        content_type: "text",
        created_at: new Date(),
        status: "sending",
      };
      setChatHistory((prev) => [...prev, newMessage]);
  
      // Simulate message sending
      setTimeout(() => {
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg === newMessage ? { ...msg, status: "delivered" } : msg
          )
        );
      }, 1000);
    };
  
  
    if (selectedChat) {
      return (
        <div className="flex flex-col items-start gap-4 self-stretch p-6 rounded-lg border border-[#C1C7CF] body-theme">
            <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <div style={{cursor:"pointer"}} onClick={() => setSelectedChat(null)} className="flex w-10 h-10 p-2 justify-center items-center gap-2 rounded-[10px] border border-[--Greyscale-100,#DFE1E6] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  className="w-5 h-5 shrink-0"
                >
                  <path
                    d="M12.5 15.5L8.08926 11.0893C7.76382 10.7638 7.76382 10.2362 8.08926 9.91074L12.5 5.5"
                    stroke="#0D0D12"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
    
              <div className="flex items-center gap-4">
                <img
                  className="user-left-image"
                  src="/assets/user-details-image.png"
                  alt=""
                />
                <div className="flex flex-col">
                  <p className="text-[--Greyscale-900,#0D0D12] font-encode-sans text-[16px] font-semibold leading-[150%] tracking-[0.2px] self-stretch">
                    Chioma Okere
                  </p>
                  <span className="text-[--Greyscale-400,#808897] font-encode-sans text-[12px] font-normal leading-[160%] tracking-[0.4px] self-stretch">
                    Last Seen 09:40
                  </span>
                </div>
              </div>
            </div>
    
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{ width: 20, height: 20, flexShrink: 0 }}
              >
                <path
                  d="M10.8337 9.99935C10.8337 10.4596 10.4606 10.8327 10.0003 10.8327C9.54009 10.8327 9.16699 10.4596 9.16699 9.99935C9.16699 9.53911 9.54009 9.16602 10.0003 9.16602C10.4606 9.16602 10.8337 9.53911 10.8337 9.99935Z"
                  stroke="#808897"
                  strokeWidth="2"
                />
                <path
                  d="M5.83366 9.99935C5.83366 10.4596 5.46056 10.8327 5.00033 10.8327C4.54009 10.8327 4.16699 10.4596 4.16699 9.99935C4.16699 9.53911 4.54009 9.16602 5.00033 9.16602C5.46056 9.16602 5.83366 9.53911 5.83366 9.99935Z"
                  stroke="#808897"
                  strokeWidth="2"
                />
                <path
                  d="M15.8337 9.99935C15.8337 10.4596 15.4606 10.8327 15.0003 10.8327C14.5401 10.8327 14.167 10.4596 14.167 9.99935C14.167 9.53911 14.5401 9.16602 15.0003 9.16602C15.4606 9.16602 15.8337 9.53911 15.8337 9.99935Z"
                  stroke="#808897"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
           <div className="chat-list-border"></div>
            <div className="w-full chat-body">
              <MessageList chatHistory={chatHistory} currentUserId={1} />
            </div>
            <div className="w-full chat-input">
              <MessageInput
                onInputChange={(e) => console.log("Typing: ", e.target.value)}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
      );
    }
    
  
    return (
      <UserChatList dummyData={dummyData} handleChatSelect={handleChatSelect}/>
    );
  }
  