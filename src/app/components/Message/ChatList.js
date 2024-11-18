import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./chatlist.css";
import { faEllipsisH, faSearch } from "@fortawesome/free-solid-svg-icons";
import './chatlist.css'
import Image from "next/image";

const ChatList = ({ users, activeUser, setActiveUser }) => {
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="list-chat">
      <div className="tab">
        <div className="field">
          <div className="input-area">
            <input
              type="text"
              placeholder="Search message..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search messages"
            />
            <FontAwesomeIcon icon={faSearch} className="search" />
          </div>
        </div>
        <div className="tab-menu">
          <div className="tab-atom">
            <div className="active">All</div>
          </div>
          <div className="active-wrapper">
            <div className="div">Unread</div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="div-2" style={{ overflowY: "auto", maxHeight: "300px" }}>
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`message ${user?.id === activeUser?.id ? "selected-user" : ""}`}
            onClick={() => setActiveUser(user)}
          >
            <div className="frame">
              <div className="avatar">
                {user.profileImage ? (
                   <Image src={user.profileImage} alt="User Profile" className="icon-avatar"
                            width={100}
                            height={100}
                            />
                ) : (
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="icon-avatar"
                    size="2x"
                  />
                )}
              </div>
              <div className="content">
                <div className="div-3">
                  <div className="title">{user.name || "Unknown User"}</div>
                  <div className="title-2">{formatTime(user.lastMessageTime)}</div>
                </div>
                <div className="div-3">
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
        ))}
      </div>
    </div>
  );
};

export default ChatList;
