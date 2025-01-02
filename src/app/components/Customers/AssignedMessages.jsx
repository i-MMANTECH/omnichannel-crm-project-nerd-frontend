import react, {useEffect, useState} from "react";
import MessageList from "../Message/MessageList";
import MessageInput from "../Message/MessageInput";
import UserChatList from "../Users/UserChatList";
import { useParams } from "next/navigation";
import { useError } from '@/context/ErrorContext';
import { useApi } from "@/services/axiosConfig";
import Image from "next/image";
import { formatDateTime, formatTime } from '@/utils/timeUtils';


export default function CustomerAssignedMessages() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const { id } = useParams();
    const { handleApiError } = useError();
    const { axiosInstance } = useApi();

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

    useEffect(() => {
        async function fetchCustomerMessages() {
            try {
                const response = await axiosInstance.get(`/communication/customer-chat-history/${id}/`);
                setChatHistory(response.data.results.messages)
            } catch (error) {
                handleApiError(error);
            }
        }

        fetchCustomerMessages();
    }, [id]);

    const handleChatSelect = (chat) => {
      
    };
  
    return (
      <div className="flex flex-col items-start gap-4 self-stretch px-6 pb-6 rounded-lg body-theme ">
            <div className="flex justify-between w-full mb-3">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6.66663 11.2497H13.3333M6.66663 7.08301H9.99996" stroke="#808897" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.0823 15.833C3.99888 15.7264 3.18725 15.401 2.64293 14.8567C1.66663 13.8804 1.66663 12.309 1.66663 9.16634V8.74967C1.66663 5.60697 1.66663 4.03563 2.64293 3.05932C3.61925 2.08301 5.19059 2.08301 8.33329 2.08301H11.6666C14.8093 2.08301 16.3807 2.08301 17.357 3.05932C18.3333 4.03563 18.3333 5.60697 18.3333 8.74967V9.16634C18.3333 12.309 18.3333 13.8804 17.357 14.8567C16.3807 15.833 14.8093 15.833 11.6666 15.833C11.1995 15.8434 10.8275 15.8789 10.4621 15.9622C9.46346 16.1921 8.53871 16.7031 7.62485 17.1488C6.3227 17.7837 5.67163 18.1012 5.26303 17.8039C4.48137 17.2218 5.24541 15.4179 5.41663 14.583" stroke="#808897" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
        
                    <p className="ms-2 font-['Encode Sans'] text-[14px] font-semibold leading-[21px] tracking-[0.2px]">
                    All Messages
                    </p>
                </div>
    
                <div className="flex h-10 px-3 justify-center items-center gap-2 rounded-lg border border-[#DFE1E6] body-theme cursor-pointer shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
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
                {/* <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm 
                    hover:dark:bg-neutral-900 hover:bg-gray-100">
                    <Image src={filter} className='mr-2' width={15} height={15} />
                    <span className="text-sm font-medium"> </span>
                </button> */}
            </div>
        
        <div className="w-full">
        {chatHistory.map((chat) => (
          <div key={chat.id}
          style={{cursor:"pointer"}}
          onClick={() => handleChatSelect(user)}
          >  
            <div className="flex justify-between items-center border rounded-lg p-3 mb-5 shadow">
              <div className="flex justify-center  ">
                <div className="rounded-lg h-8 w-8 flex item-center justify-center p-1.5 bg-[#EDF9FF]">
                  <Image 
                    width={100}
                    height={100}
                    src={chat.channel.image} 
                    alt={`${chat.channel.id} `} 
                    />
                </div>
                <div className="flex flex-col ms-4 gap-1">
                  <p className="text-sm font-medium ">
                    {chat.channel.name}
                  </p>
                  <p className="text-sm">
                    {chat.content}
                  </p>
                </div>
              </div>
  
              <div>
                <div className="flex flex flex-col">
                  <span className=" text-right font-['Encode_Sans'] text-[12px] font-normal leading-[170%] tracking-[0.2px]">
                    {formatDateTime(chat.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    );
  }
  