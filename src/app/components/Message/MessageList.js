import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble, faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";
import './messageList.css';

const MessageList = ({ activeUser, currentUserId }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeUser?.messages]);

  if (!activeUser || !activeUser.messages) return null;

  return (
    <div className="message-list">
      {activeUser.messages.map((msg, index) => {
        const isUserMessage = msg.userId === parseInt(currentUserId);

        return (
          <div className={`chat ${isUserMessage ? "chat-right" : "chat-left"}`} key={index}>
            <div className={`bubble-chat ${isUserMessage ? "bubble-chat-user" : "bubble-chat-other"}`}>
              
              {msg.text && <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>}
              {msg.image && (
                <div className="message-image">
                  <img src={msg.image} alt="Attachment" className="image-message" />
                </div>
              )}
              {msg.audio && (
                <div className="message-audio">
                  <audio controls src={msg.audio} className="audio-message-player" />
                </div>
              )}

            </div>
            <div className="message-meta">
              <span className="message-time">{msg.time}</span>
              {msg.status === 'DELIVERED' && <FontAwesomeIcon icon={faCheckDouble} />}
              {msg.status === 'SENT' && <FontAwesomeIcon icon={faCheck} />}
              {msg.status === "READ" && <FontAwesomeIcon className="icon-instance-node" icon={faCheckDouble} />}
              {msg.status === "FAILED" && <FontAwesomeIcon style={{ color: "red" }} icon={faCircleExclamation} />}
              {msg.status === "SENDING" && <FontAwesomeIcon icon={faSpinner} spin />}
            </div>
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
