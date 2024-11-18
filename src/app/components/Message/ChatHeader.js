import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./chatHeader.css";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import './chatHeader.css'
import Image from "next/image";

const ChatHeader = ({ activeUser }) => {
  if (!activeUser) return null;

  const formattedTime = new Date(activeUser.time).toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="header">
      <div className="avatar-woman">
        {activeUser.profileImage ? (
          <Image src={activeUser.profileImage} alt="User Profile" className="icon-avatar-large"
          width={100}
          height={100}
          />
        ) : (
          <FontAwesomeIcon
            icon={faUserCircle} 
            className="icon-avatar-large"
            size="2x"
          />
        )}
      </div>
      <div className="info">
        <div className="text-wrapper-2">{activeUser.name || "Unknown User"}</div>
        <div className="title-4">Last Seen {formattedTime}</div>
      </div>
      <FontAwesomeIcon icon={faEllipsisH} className="icon-instance-node" />
    </div>
  );
};

export default ChatHeader;
