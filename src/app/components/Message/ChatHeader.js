import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import './chatHeader.css'
import Image from "next/image";


const ChatHeader = ({ activeUser }) => {
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
            icon={activeUser.avatarIcon}
            className="icon-avatar-large"
            size="2x"
          />
        )}
      </div>
      <div className="info">
        <div className="text-wrapper-2">{activeUser.name}</div>
        <div className="title-4">Last Seen {activeUser.time}</div>
      </div>
      <FontAwesomeIcon icon={faEllipsisH} className="icon-instance-node" />
    </div>
  );
};

export default ChatHeader;