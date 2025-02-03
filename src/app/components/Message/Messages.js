import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatList from "./ChatList";
import { useAuth } from "@/context/AuthContext";
import "./style.css";
import { useApi } from "@/services/axiosConfig";
import { useError } from '@/context/ErrorContext';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";



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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("leads");

  useEffect(() => {
    if (activeTab == 'customers') {
      fetchCustomerChatList()
    } else {
      fetchLeadsChatList()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeUser) {
      if (activeTab == 'customers') {
        axiosInstance
          .get(`/communication/customer-chat-history/${activeUser.id}`)
          .then((response) => {
            const messages = response.data.results.messages || [];
            setChatHistory(messages.reverse());
          })
          .catch((error) => {
            handleApiError(error)
          });
      } else {
        axiosInstance
          .get(`/communication/history/?lead_id=${activeUser.id}`)
          .then((response) => {
            setChatHistory(response.data.messages || []);
          })
          .catch((error) => {
            handleApiError(error)
          });
      }
    }
  }, [activeUser, activeTab]);

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
  if (companyId) {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://ws-staging.nativetalkcrm.com/ws/chat/?uuid=${companyId}&type=company`;
    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log(event)
      const data = JSON.parse(event.data);
      const message = data.message;

      if (message.is_new_lead) {
        fetchLeadsChatList(); 
      }

      // if (activeUser && (message.content.lead_receiver === activeUser?.id || message.content.customer_receiver === activeUser?.id)) {
        setChatHistory((prev) => [...prev, message]);
      // }
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchCustomerChatList = () => {
    axiosInstance
      .get("/communication/chatted-customers/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        handleApiError(error)
      });
  }

  const fetchLeadsChatList = () => {
    axiosInstance
      .get("/communication/contacts/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        handleApiError(error)
      });
  }

  const handleSendMessage = (messageContent) => {
    const payload = {
      lead_id: activeUser.id,
      content: messageContent.text || "",
      content_type: "text",
    };

    let url = '/communication/'
    let dataToSend = payload;
    if (activeTab === "customers") {
      url += "send-to-customer/";
  
      const formData = new FormData();
      formData.append("customer_id", activeUser.id);
      formData.append("content", messageContent.text || "");
      formData.append("channel_id", 2);
  
      dataToSend = formData;
    } else {
      url += "send-to-lead/";
    }
  
    axiosInstance
      .post(url, dataToSend, {
        headers: activeTab === "customers" ? { "Content-Type": "multipart/form-data" } : {},
      })
      .then((response) => {  
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
        handleApiError(error)
      });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveUser(null); // Reset active user when changing tabs
  };

  return (
    <div className="body-theme flex flex-col px-5 ">
      <div className="flex p-4 items-center justify-between w-full ">
        <h1 className="font-bold ">
          All Messages
        </h1>

        <div className="flex gap-4">
          <button 
            onClick={() => {router.push('/nativecrm/settings#channels-integration');}}
            className="bg-[#3EBF0F] text-white px-4 py-2 rounded-lg shadow-sm">
              + Connect Channel
          </button>
          <div className="bg-gray-500 w-0.5 hidden"></div>
          <div className="hidden flex h-10 w-20 px-3 justify-center items-center gap-2 rounded-lg border border-[#DFE1E6] body-theme cursor-pointer shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
                d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z" 
                stroke="#808897" 
                strokeWidth="1.33333" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            </svg>

            <p className=" text-[14px] font-medium leading-[150%] tracking-[0.2px]">
            Filter
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-y-hidden overflow-x-hidden  messages flex items-start  border border-gray-500 rounded-lg relative h-[80vh] m-4 mt-0">
        <div>
          <div className="body-theme justify-center gap-5 p-5 flex items-start flex-col w-full">
            <div className="w-full hidden">
              <div className="flex items-center justify-center h-[40px] gap-5 rounded border border-gray-500 p-5">
                <input
                  type="text"
                  placeholder="Search message..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-label="Search messages"
                />
                <FontAwesomeIcon icon={faSearch} className="search" />
              </div>
            </div>
            <div className="flex gap-3 w-full ">
              <div className="tab-atom">
                <div className={`px-4 pb-1 ${activeTab === 'leads' ? 'active' : ""}`} onClick={() => handleTabChange('leads')}>Leads</div>
              </div>
              <div className="tab-atom">
                <div className={`px-4 pb-1 ${activeTab === 'customers' ? 'active' : ""}`} onClick={() => handleTabChange('customers')}>Customers</div>
              </div>
            </div>
          </div>

          <ChatList users={users} activeUser={activeUser} setActiveUser={setActiveUser} />
        </div>
        
        <div className="detail ">
          {activeUser ? (
            <div >
              <ChatHeader activeUser={activeUser} />
              <div className="flex items-center ">
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
            </div>
          ) : (
            <div className="no-chat-selected">
              {activeTab === "leads" ? "Select a lead to chat with" : "Select a customer to chat with"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
