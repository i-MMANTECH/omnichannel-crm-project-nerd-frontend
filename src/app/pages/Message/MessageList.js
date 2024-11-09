import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const MessageList = ({ activeUser }) => {
  return (
    <div className="message-list">
      {activeUser.messages.map((msg, index) => (
        <div className="chat" key={index}>
          <div className="bubble-chat">
            <p>{msg.text}</p>
          </div>
          <div className="div-4">
            <div className="text-wrapper-3">{msg.time}</div>
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="icon-instance-node"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;