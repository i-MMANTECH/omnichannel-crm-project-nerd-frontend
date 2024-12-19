import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./chatHeader.css";
import UserAvatar from "../UserAvatar";
import Image from "next/image";


const ChatHeader = ({ activeUser }) => {
  if (!activeUser) return null;

  const formattedTime = new Date(activeUser.lastMessageTime).toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

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
      <FontAwesomeIcon icon={faEllipsisH} className="icon-instance-node" />
    </div>
  );
};

export default ChatHeader;

