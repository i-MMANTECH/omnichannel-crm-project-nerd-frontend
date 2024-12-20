import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./chatHeader.css";
import UserAvatar from "../UserAvatar";
import Image from "next/image";


const ChatHeader = ({ activeUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeUser) return null;

  const formattedTime = new Date(activeUser.lastMessageTime).toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const menuItems = [
    { label: "Add as customer", onClick: () => console.log("View Profile") },
    { label: "Create a ticket", onClick: () => console.log("Block User") },
    { label: "Assign to agent", onClick: () => console.log("Report") },
    { label: "Notes", onClick: () => console.log("Notes") },
    { label: "End session", onClick: () => console.log("End session") },
  ];


  return (
    <div className="header">
      <div className="relative">
        <div>
          {activeUser.profileImage ? (
            <Image
              loader={() => activeUser.profileImage}
              src={activeUser.profileImage}
              alt="User Profile"
              className="icon-avatar-large"
              width={70}
              height={70}
            />
          ) : (
            <UserAvatar
              name={activeUser.name}
              width="w-9"
              height="h-9"
            />
          )}
        </div>
        {activeUser.channel?.image && (
          <div>
            {activeUser.channel?.image && (
              <Image
                loader={() => activeUser.channel?.image}
                src={`${activeUser.channel?.image}`}
                alt={`${activeUser.channel?.name} Icon`}
                className="absolute -bottom-1 -right-1 rounded-full bg-white p-[3.5px]"
                width={18}
                height={18}
              />
            )}
          </div>
        )}
      </div>
      <div className="info flex flex-col relative grow justify-center gap-2 bottom-1">
        <div className="text-black dark:text-white">{activeUser.name || "Unknown User"}</div>
        <div className="title-4">Last Seen {formattedTime}</div>
      </div>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faEllipsisH} className="icon-instance-node" />
        </button>
        
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;

