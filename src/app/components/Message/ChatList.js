import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { formatChatTime } from "@/utils/timeUtils";
import "./chatlist.css";
import Image from "next/image";
import UserAvatar from "../UserAvatar";

const ChatList = ({ users, activeUser, handleChatSelect, loadMoreUsers, loading }) => {
  const results = users?.results || [];
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const chatListRef = useRef(null);

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const truncateMessage = (message, maxLength) => {
    if (!message) return "";
  
    const doc = new DOMParser().parseFromString(message, "text/html");
    const textContent = doc.body.textContent || "";
  
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent;
  };

  const handleScroll = useCallback(() => {
    if (!chatListRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;

    if (scrollHeight - scrollTop <= clientHeight + 5) {
      loadMoreUsers();
    }
  }, [loadMoreUsers]);

  useEffect(() => {
    const currentChatList = chatListRef.current;
    if (currentChatList) {
      currentChatList.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentChatList) {
        currentChatList.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);


  if (loading) {
    return (
      <div className="flex items-start flex-col relative body-theme px-2">
        <div className="chat-list-container animate-pulse flex flex-col overflow-y-auto h-[60vh] items-start w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 w-full">
                <div className="rounded-full bg-gray-200 h-11 w-11"></div>
                <div className="flex-1 content w-full">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && results.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <p className="text-gray-500">No chats in this category</p>
      </div>
    );
  }

  return (
    <div className="flex items-start flex-col relative body-theme px-2">
      <div ref={chatListRef} className="chat-list-container flex flex-col overflow-y-auto h-[60vh] items-start">
        {results.map((user) => {
            return (
              <div
                key={user.id}
                className={`flex items-center rounded ${
                  user?.id === activeUser?.id ? "bg-gray-200 dark:bg-gray-800" : ""
                }`}
                onClick={() => {handleChatSelect(user);}}
              >
                <div className="flex items-center gap-3 p-3 cursor-pointer rounded">
                  <div className="relative">
                    <div>
                      {user.profileImage ? (
                        <Image
                          loader={() => user.profileImage}
                          src={user.profileImage}
                          alt="User Profile"
                          width={100}
                          height={100}
                          className="w-11 h-11 rounded-full"
                        />
                      ) : (
                        <UserAvatar name={user.name || user.lead_name} width="w-11" height="h-11" />
                      )}
                    </div>
                    {user.channel?.image && (
                      <div>
                        <Image
                          loader={() => user.channel?.image}
                          src={`${user.channel?.image}`}
                          alt={`${user.channel?.name} Icon`}
                          className="absolute bottom-0 right-0 rounded-full bg-white p-[3.5px]"
                          width={18}
                          height={18}
                        />
                      </div>
                    )}
                  </div>
                  <div className="content ">
                    <div className="flex justify-between  w-full ">
                      <div className="text-black dark:text-white user-name">{user.name || user.lead_name || "Unknown User"}</div>
                      <div className="relative flex items-center">
                        {/* Time Display */}
                        <div className="title-2 ">{formatChatTime(user.lastMessageTime || user.last_message_at)}</div>

                        {/* Unread Message Indicator */}
                        {user.unreadCount > 0 && (
                          <div className="absolute -bottom-7 right-0 flex items-center justify-center w-5 h-5 bg-green-600 text-white text-xs font-bold rounded-full shadow-md">
                            {user.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between w-full ">
                      <p className="label last-message ">{truncateMessage(user.lastMessage, 27)}</p>
                      <div className="hidden">
                        {user.unreadCount > 0 && (
                          <div className="title-wrapper">
                            <div className="title-3">{user.unreadCount}</div>
                          </div>
                        )}
                        <FontAwesomeIcon
                          icon={faEllipsisH}
                          className="dots-horizontal"
                          onClick={() => toggleMenu(user.id)}
                        />
                        {menuOpen === user.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                            style={{ top: '0', right: '0' }} 
                          >
                            <button
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Menu 1
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Menu 2
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default ChatList;
