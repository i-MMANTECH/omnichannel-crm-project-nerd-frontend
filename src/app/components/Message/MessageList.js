import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble, faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./messageList.css";
import Image from "next/image";

const MessageList = ({ chatHistory, currentUserId }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const getIconForStatus = (status) => {
    switch (status) {
      case "delivered":
        return faCheckDouble;
      case "sent":
        return faCheck;
      case "failed":
        return faCircleExclamation;
      case "sending":
        return faSpinner;
      case "received":
        return faCheck;
      default:
        return null;
    }
  };

  if (!chatHistory || chatHistory.length === 0) return null;

  return (
    <div className="message-list flex overflow-y-auto overflow-x-hidden  h-[60vh] flex-col relative ">
      {chatHistory.map((msg, index) => {
        const isUserMessage = msg.user_sender === parseInt(currentUserId);

        return (
          <div className={`chat  ${isUserMessage ? "chat-right" : "chat-left"}`} key={index}>
            <div className={`bubble-chat ${isUserMessage ? "bubble-chat-user" : "bubble-chat-other"}`}>
              <div className="relative " >
                {msg.content_type === "text" && 
                  <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
                }
                {msg.customer_receiver && (
                    <div >
                      {msg.channel.image && (
                        <Image
                          loader={() => msg.channel.image}
                          src={`${msg.channel.image}`}
                          alt={`${msg.channel.image} Icon`}
                          className="absolute bottom--20 right-[-20px] rounded-full bg-white p-[3.5px]"
                          width={18}
                          height={18}
                        />
                      )}
                    </div>
                )}
              </div>
              {msg.content_type === "image" && (
                <div className="message-image">
                  <img src={msg.content} alt="Attachment" className="image-message" />
                </div>
              )}
              {msg.content_type === "audio" && (
                <div className="message-audio">
                  <audio controls src={msg.content} className="audio-message-player" />
                </div>
              )}
            </div>
            <div className="message-meta">
              <span className="message-time">{new Date(msg.created_at).toLocaleTimeString()}</span>
              {getIconForStatus(msg.status) && (
                <FontAwesomeIcon
                  className="ms-1"
                  style={{ fontSize: 12 }}
                  icon={getIconForStatus(msg.status)}
                />
              )}
            </div>
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
