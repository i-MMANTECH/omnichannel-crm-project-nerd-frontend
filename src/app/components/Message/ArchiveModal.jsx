import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import UserAvatar from "../UserAvatar";
import { formatDateTime } from "@/utils/timeUtils";
import { useSearchParams } from "next/navigation";



const ArchiveModal = ({ isOpen, onClose }) => {
  const { axiosInstance } = useApi()
  const [conversations, setConversations] = useState([])
  const searchParams = useSearchParams()

  const chatType = searchParams.get("chat");
  const entityId = searchParams.get("id");

  useEffect(() => {
    if (isOpen && chatType && entityId) {
      fetchConversations();
    }
  }, [isOpen, chatType, entityId]);

  const fetchConversations = async () => {
    try {
      const params =
        chatType === "customers"
          ? { customer_id: entityId }
          : { lead_id: entityId };

      const response = await axiosInstance.get("/communication/conversations/", {
        params,
      });

      console.log(response.data.results.conversations)
      if (response.data.success) {
        setConversations(response.data.results.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Archived messages"
      showFooter={true}
      width="500px"
    >

      <div>
        <p className="text-sm mb-4">Select a message you want</p>
        <div className="flex gap-4 hidden">
          <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{
                width: "20px",
                height: "20px",
                flexShrink: 0,
                aspectRatio: "1/1"
              }}
            >
              <path
                d="M6.66667 2.49935H5C3.61929 2.49935 2.5 3.61864 2.5 4.99935V7.49935M6.66667 2.49935V1.66602M6.66667 2.49935H13.3333M6.66667 2.49935V3.33268M13.3333 2.49935H15C16.3807 2.49935 17.5 3.61864 17.5 4.99935V7.49935M13.3333 2.49935V1.66602M13.3333 2.49935V3.33268M2.5 7.49935V15.8327C2.5 17.2134 3.61929 18.3327 5 18.3327H15C16.3807 18.3327 17.5 17.2134 17.5 15.8327V7.49935M2.5 7.49935H17.5M11.25 10.416H13.75L11.6667 14.5827M8.75 11.666V13.3327C8.75 14.023 8.19036 14.5827 7.5 14.5827C6.80964 14.5827 6.25 14.023 6.25 13.3327V11.666C6.25 10.9757 6.80964 10.416 7.5 10.416C8.19036 10.416 8.75 10.9757 8.75 11.666Z"
                stroke="#808897"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input type="date" className="outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border rounded-md w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{
                width: "16px",
                height: "16px",
                flexShrink: 0
              }}
            >
              <path
                d="M11.6736 11.6736C13.8866 9.46063 13.8866 5.8727 11.6736 3.65973C9.46063 1.44676 5.8727 1.44676 3.65973 3.65973C1.44676 5.8727 1.44676 9.46063 3.65973 11.6736C5.8727 13.8866 9.46063 13.8866 11.6736 11.6736ZM11.6736 11.6736L14 14"
                stroke="#808897"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input type="text" placeholder="Search" className="outline-none text-sm w-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col max-h-80 overflow-y-auto custom-scrollbar">
          {conversations.length > 0 ? (
            conversations.map((conversation, index) => (
              <div
                key={index}
                className="mt-3 flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm"
              >
                {conversation.image ? (
                      <Image
                        loader={() => user.profileImage}
                        src={user.profileImage}
                        alt="User Profile"
                        width={100}
                        height={100}
                        className="w-11 h-11 rounded-full"
                      />
                    ) : (
                      <UserAvatar name={conversation.lead_name} width="w-11" height="h-11" />
                    )}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{conversation.lead_name || "Unknown User"}</h3>
                  <p className="text-xs ">{conversation.lastMessage?.content || "No message"}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDateTime(conversation.last_message_at) || "N/A"}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">No archived messages found for this customer.</p>
          )}
        </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px; /* Thinner scrollbar */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--greyscale-500); /* Thumb color */
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: var(--greyscale-100); /* Track color */
          border-radius: 4px;
        }
      `}</style>
    </Modal>
  );
};

export default ArchiveModal;
