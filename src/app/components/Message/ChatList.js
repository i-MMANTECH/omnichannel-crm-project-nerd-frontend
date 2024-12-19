import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./chatlist.css";
import Image from "next/image";
import UserAvatar from "../UserAvatar";

const ChatList = ({ users, activeUser, setActiveUser }) => {
  const [searchTerm, setSearchTerm] = useState("");

  console.log(users)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const contacts = users?.contacts || [];

  const filteredUsers = contacts.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="flex items-start flex-col relative body-theme  px-2">
      <div className="body-theme justify-center gap-5 p-5 flex items-start flex-col w-full">
        <div className="w-full">
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
        <div className="flex gap-5 w-full">
          <div className="tab-atom">
            <div className="active">Leads</div>
          </div>
          <div className="tab-atom">
            <div>Customers</div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="flex flex-col overflow-y-auto h-[60vh] items-start">
        {filteredUsers.map((user) => {
          return(
            <div
              key={user.id}
              className={`flex items-center rounded ${user?.id === activeUser?.id ? "bg-gray-100 dark:bg-neutral-900" : ""}`}
              onClick={() => setActiveUser(user)}
            >
              <div className="flex items-center gap-3 p-3 cursor-pointer rounded">
                <div className="relative">
                  <div>
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="User Profile"
                        className="icon-avatar"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <UserAvatar
                        name={user.name}
                        width="w-11"
                        height="h-11"
                      />
                    )}
                  </div>
                  {user.channel?.image && (
                    <div>
                      {user.channel?.image && (
                        <Image
                          src={`${user.channel?.image}`}
                          alt={`${user.channel?.name} Icon`}
                          className="absolute bottom-0 right-0 rounded-full bg-white p-[3.5px]"
                          width={18}
                          height={18}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="content">
                  <div className="flex justify-between w-full">
                    <div className="text-black dark:text-white">{user.name || "Unknown User"}</div>
                    <div className="title-2">{formatTime(user.lastMessageTime)}</div>
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="label">{truncateMessage(user.lastMessage, 30)}</p>
                    <div className="frame-3">
                      {user.unreadCount > 0 && (
                        <div className="title-wrapper">
                          <div className="title-3">{user.unreadCount}</div>
                        </div>
                      )}
                      <FontAwesomeIcon icon={faEllipsisH} className="dots-horizontal" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default ChatList;
