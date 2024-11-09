import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import './messageList.css';

const MessageList = ({ activeUser }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeUser.messages]);

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
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
