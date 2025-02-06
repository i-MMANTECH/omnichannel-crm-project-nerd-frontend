import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble, faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./messageList.css";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import { useRouter } from "next/navigation";

const MessageList = ({ chatHistory, currentUserId }) => {
  const messageEndRef = useRef(null);
  const router = useRouter();
  const [hoveredUserId, setHoveredUserId] = useState(null); // Track the hovered user uniquely

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

  if (!chatHistory || chatHistory?.length === 0) return null;

  return (
    <div className="message-list flex overflow-y-auto overflow-x-hidden h-[60vh] flex-col relative scrollbar-hide">
      {chatHistory.map((msg, index) => {
        const isUserMessage = msg.user_sender === parseInt(currentUserId);
        const isOutgoing = msg.company_is_sender;
        const userDisplayInfo = msg.user_sender_details?.last_name || msg.user_sender_details?.first_name || msg.user_sender_details?.email;

        return (
          <div className={`chat ${isUserMessage ? "chat-right" : "chat-left"}`} key={index}>
            <div className={`mt-1 bubble-chat ${isUserMessage ? "bubble-chat-user" : "bubble-chat-other"}`}>
              <div className="relative ">
                {isOutgoing ? (
                  <div className="flex items-center relative">
                    {/* User Profile Image with Hover Effect */}
                    <div
                      className="relative pointer"
                      onMouseEnter={() => setHoveredUserId(index)} 
                      onMouseLeave={() => setHoveredUserId(null)} 
                    >
                      {msg.user_sender_details?.image ? (
                        <Image
                          loader={() => msg.user_sender_details.image}
                          src={msg.user_sender_details.image}
                          alt={`${msg.user_sender_details.name} Profile`}
                          className="w-8 h-8 rounded-full mr-3"
                          width={30}
                          height={30}
                          onClick={() => (router.push(`/nativecrm/users/${msg.user_sender_details.id}`))}
                          title={msg.user_sender_details.name}
                        />
                      ) : (
                        <UserAvatar name={msg.user_sender_details?.name} width="w-8" height="h-8" />
                      )}

                      {hoveredUserId === index && userDisplayInfo && (
                        <div className=" absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg z-50">
                          {userDisplayInfo}
                        </div>
                      )}
                    </div>

                    {msg.content_type === "text" ? (
                      <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
                    ) : msg.content_type === "html" ? (
                      <div
                        className="message-html"
                        dangerouslySetInnerHTML={{ __html: msg.content }} // Render HTML content
                      />
                    ) : null}
                  </div>
                ) : (
                  <div>
                    {msg.content_type === "text" && (
                      <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
                    )}
                    {msg.content_type === "html" && (
                      <div
                        className="message-html"
                        dangerouslySetInnerHTML={{ __html: msg.content }} // Render HTML content
                      />
                    )}
                  </div>
                )}

                {msg.content_type === "image" && (
                  <div className="message-image">
                    <Image
                      src={msg.content}
                      alt="Attachment"
                      className="image-message"
                      width={250}
                      height={250}
                    />
                  </div>
                )}
                {msg.content_type === "audio" && (
                  <div className="message-audio">
                    <audio controls src={msg.content} className="audio-message-player" />
                  </div>
                )}
              </div>
            </div>
            <div className={`mt-1 flex items-center ${isOutgoing ? "justify-end" : "justify-start"}`}>
              <p className="message-time">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              {isOutgoing && getIconForStatus(msg.status) && (
                <FontAwesomeIcon className="ms-1" style={{ fontSize: 12 }} icon={getIconForStatus(msg.status)} />
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
