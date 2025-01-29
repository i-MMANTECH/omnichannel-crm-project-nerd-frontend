import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import "./chatlist.css";
import Image from "next/image";
import UserAvatar from "../UserAvatar";

const ChatList = ({ users, activeUser, setActiveUser }) => {
  const contacts = users?.contacts || [];
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  const filteredUsers = contacts;

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const truncateMessage = (message, maxLength) => {
    if (message.length > maxLength) {
      return `${message.slice(0, maxLength)}...`;
    }
    return message;
  };

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

  return (
    <div className="flex items-start flex-col relative body-theme px-2">
      <div className="chat-list-container flex flex-col overflow-y-auto h-[60vh] items-start">
        {filteredUsers.map((user) => {
          return (
            <div
              key={user.id}
              className={`flex items-center rounded ${
                user?.id === activeUser?.id ? "bg-gray-100 dark:bg-neutral-900" : ""
              }`}
              onClick={() => setActiveUser(user)}
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
                      <UserAvatar name={user.name} width="w-11" height="h-11" />
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
                <div className="content">
                  <div className="flex justify-between w-full">
                    <div className="text-black dark:text-white">{user.name || "Unknown User"}</div>
                    <div className="title-2">{formatTime(user.lastMessageTime)}</div>
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="label">{truncateMessage(user.lastMessage, 27)}</p>
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
        })}
      </div>
    </div>
  );
};

export default ChatList;
