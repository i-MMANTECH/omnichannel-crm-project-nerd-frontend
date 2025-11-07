import React, { useState, useRef, useEffect, act } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import "./chatHeader.css";
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import LeadToCustomer from "./LeadToCustomer";
import NotesModal from "./NotesModal";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SuccessModal from "../SuccessModal";
import { usePermissions } from "@/context/PermissionsContext";
import AssignAgentModal from "./AssignAgentModal";
import EndSessionModal from "./EndSessionModal";
import ArchiveModal from "./ArchiveModal";
import TaskModel from "./TaskModel";
import { useApi } from "@/services/axiosConfig";
import { useError } from '@/context/ErrorContext';



const ModalController = ({ children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const isModalOpen = searchParams.get('action') === 'lead-to-customer';

  const openModal = () => {
    const params = new URLSearchParams(searchParams);
    params.set('action', 'lead-to-customer');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('action');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return children({ isModalOpen, openModal, closeModal });
};

const ChatHeader = ({ activeUser, isLead, conversationId, refreshChatList, refreshChatHeader }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isAssignAgentModalOpen, setIsAssignAgentModalOpen] = useState(false);
  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
  const [isTaskCreation, setIsTaskCreation] = useState(false)
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [aiResponsesEnabled, setAiResponsesEnabled] = useState(false);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();


  const { checkPermission } = usePermissions();
  const addCustomer = checkPermission('add_customer');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    // Fetch AI status
    const fetchAiStatus = async () => {
      try {
        const res = await axiosInstance.get(`/communication/conversations/${conversationId}/ai-status/`, {
          showLoader: false
        });
  
        if (res?.data?.success) {
          setAiResponsesEnabled(res.data.data.ai_is_active);
        }
      } catch (err) {
        handleApiError(err, "Failed to fetch AI status");
      }
    };
  
    if (conversationId) fetchAiStatus();
  
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [conversationId, refreshChatHeader]);  

  if (!activeUser) return null;

  const closeSessionModal = () => {
    setIsEndSessionModalOpen(false)
    refreshChatList()
  }

  const lastTime = new Date(activeUser?.lastMessageTime || activeUser?.last_message_at);
  const now = new Date();

  const isToday = lastTime.toDateString() === now.toDateString();

  const formattedTime = isToday
    ? lastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    : lastTime.toLocaleDateString([], { month: "short", day: "numeric" });


  const aiToggleMenuItem = (
    <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
      <span>Automated Responses (AI)</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={aiResponsesEnabled}
          onChange={async () => {
            try {
              const res = await axiosInstance.patch(`/communication/conversations/${conversationId}/ai-status/`, {}, {
                showLoader: false
              });

              if (res?.data?.success) {
                setAiResponsesEnabled(res.data.data.ai_is_active);
              }
            } catch (err) {
              handleApiError(err, "Failed to toggle AI status");
            }
          }}
          className="sr-only peer"
        />

        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            aiResponsesEnabled ? "bg-[#3EBF0F]" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 body-theme rounded-full transition-transform ${
              aiResponsesEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
  
  const leadMenuItems = [
    ...(addCustomer ? [{
      label: "Add as customer",
      onClick: () => {
        const params = new URLSearchParams(searchParams);
        params.set('action', 'lead-to-customer');
        router.push(`?${params.toString()}`, { scroll: false });
      },
    }] : []),
    {
      label: "Archived messages", 
      onClick: () => setIsArchivedModalOpen(true),
    },
    {
      label: "Notes", 
      onClick: () => setIsNotesModalOpen(true),
    },
    {
      label: "Assign to agent",
      onClick: () => setIsAssignAgentModalOpen(true),
    },
    {
      label: "End session",
      onClick: () => setIsEndSessionModalOpen(true),
    },
    {
      label: "Create a task",
      onClick: () => setIsTaskCreation(true),
    },
    {
      label: aiToggleMenuItem,
      isCustom: true,
    }    
  ]
  
  
  const customerMenuItems = [
    {
      label: "Edit customer",
      onClick: () => {
        router.push(`/nativecrm/customers/${activeUser?.id}?action=edit-customer`);
      },
    },
    {
      label: "Archived messages", 
      onClick: () => setIsArchivedModalOpen(true),
    },
    {
      label: "Assign to agent",
      onClick: () => setIsAssignAgentModalOpen(true),
    },
    {
      label: "End session",
      onClick: () => setIsEndSessionModalOpen(true),
    },
    {
      label: aiToggleMenuItem,
      isCustom: true,
    }    
  ];

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <ModalController>
        {({ isModalOpen, closeModal }) => (
          <div className="header">
            <div className="relative">
              <div>
                {activeUser?.profileImage ? (
                  <Image
                    loader={() => activeUser?.profileImage}
                    src={activeUser?.profileImage}
                    alt="User Profile"
                    width={70}
                    height={70}
                    className="w-9 h-9 rounded-full"
                  />
                ) : (
                  <UserAvatar name={activeUser?.name || activeUser?.lead_name || activeUser?.name || activeUser?.customer_name || activeUser?.first_name || activeUser?.username || activeUser?.email || "Unknown "} width="w-9" height="h-9" />
                )}
              </div>
              {activeUser?.channel?.image && (
                <div>
                  <Image
                    loader={() => activeUser?.channel?.image}
                    src={`${activeUser?.channel?.image}`}
                    alt={`${activeUser?.channel?.name} Icon`}
                    className="absolute -bottom-1 -right-1 rounded-full bg-white p-[3.5px]"
                    width={18}
                    height={18}
                  />
                </div>
              )}
            </div>
            <div className="info flex flex-col relative grow justify-center gap-2 bottom-1">
              <div className="text-black dark:text-white">
                {activeUser?.name || activeUser?.lead_name || "Unknown User"}
              </div>
              <div className="title-4">Last Seen {formattedTime}</div>
            </div>
            <div className="relative">
              {!activeUser?.ended_at &&
                <button
                  ref={buttonRef}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faEllipsisH} className="icon-instance-node" />
                </button>
              }
              {isMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                >
                    <div className="py-1">
                    {(isLead ? leadMenuItems : customerMenuItems).map((item, index) => (
                      <div key={index}>
                        {item.isCustom ? (
                          item.label // direct JSX like toggle
                        ) : (
                          <button
                            onClick={() => {
                              item.onClick();
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {item.label}
                          </button>
                        )}
                      </div>
                    ))}

                  </div>
                  
                </div>
              )}
            </div>

            {isTaskCreation && (
              <TaskModel
                isOpen={isTaskCreation}
                onClose={() => setIsTaskCreation(false)}
                conversationId={conversationId}
                setIsSuccessModalOpen={setIsSuccessModalOpen}
                setSuccessModalMessage={setSuccessModalMessage}
              />
            )}

            {isModalOpen && (
              <LeadToCustomer
                isOpen={isModalOpen}
                onClose={closeModal}
                leadId={activeUser?.id}
                setIsSuccessModalOpen={setIsSuccessModalOpen}
                setSuccessModalMessage={setSuccessModalMessage}
              />
            )}

            {isArchivedModalOpen && (
               <ArchiveModal 
               isOpen={isArchivedModalOpen} 
               onClose={() => setIsArchivedModalOpen(false)} />
            )}

            {isNotesModalOpen && (
              <NotesModal
                isOpen={isNotesModalOpen}
                onClose={() => setIsNotesModalOpen(false)}
                userId={activeUser?.id}
                conversationId={conversationId}
                setIsSuccessModalOpen={setIsSuccessModalOpen}
                setSuccessModalMessage={setSuccessModalMessage}
              />
            )}

             {isAssignAgentModalOpen && (
            <AssignAgentModal
              isOpen={isAssignAgentModalOpen}
              onClose={() => setIsAssignAgentModalOpen(false)}
              userId={activeUser?.id}
              conversationId={conversationId}
              setIsSuccessModalOpen={setIsSuccessModalOpen}
              setSuccessModalMessage={setSuccessModalMessage}
            />
          )}
          
          {isEndSessionModalOpen && (
            <EndSessionModal
              isOpen={isEndSessionModalOpen}
              onClose={closeSessionModal}
              conversationId={conversationId}
              setIsSuccessModalOpen={setIsSuccessModalOpen}
              setSuccessModalMessage={setSuccessModalMessage}
            />
          )}
          </div>
        )}
      </ModalController>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        title="Success!"
        message={successModalMessage}
        buttonText="Okay, thank you"
        onClose={closeSuccessModal}
        setIsSuccessModalOpen={setIsSuccessModalOpen}
      />
    </>
  );
};

export default ChatHeader;
