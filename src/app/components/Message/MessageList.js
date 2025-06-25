import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faDownload, faFilePdf, faFileWord, faFile } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faCheckDouble, faCircleExclamation, faRobot } from "@fortawesome/free-solid-svg-icons";
import "./messageList.css";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import { useRouter } from "next/navigation";


const getSmartTimestamp = (messageDate) => {
  const now = new Date();
  const msgDate = new Date(messageDate);
  
  // Get time in 12-hour format
  const timeString = msgDate.toLocaleTimeString([], { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true 
  });
  
  // Check if it's today
  const isToday = now.toDateString() === msgDate.toDateString();
  if (isToday) {
    return timeString; // Just "2:50 PM"
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = yesterday.toDateString() === msgDate.toDateString();
  if (isYesterday) {
    return `Yesterday, ${timeString}`; // "Yesterday, 2:50 PM"
  }
  
  // Check if it's this year
  const isThisYear = now.getFullYear() === msgDate.getFullYear();
  if (isThisYear) {
    const shortDate = `${msgDate.getMonth() + 1}/${msgDate.getDate()}`;
    return `${shortDate}, ${timeString}`; // "5/11, 2:50 PM"
  }
  
  // Different year - include year
  const shortDateWithYear = `${msgDate.getMonth() + 1}/${msgDate.getDate()}/${msgDate.getFullYear().toString().slice(-2)}`;
  return `${shortDateWithYear}, ${timeString}`; // "2/11/22, 2:50 PM"
};

const MessageList = ({ chatHistory }) => {
  const messageEndRef = useRef(null);
  const router = useRouter();
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const [hoveredChannelId, setHoveredChannelId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const getIconForStatus = (status) => {
    // Convert status to lowercase for case-insensitive comparison
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case "read":
        return <FontAwesomeIcon className="ms-1 text-green-500" style={{ fontSize: 12 }} icon={faCheckDouble} />;
        
      case "delivered":
        return <FontAwesomeIcon className="ms-1 text-gray-500" style={{ fontSize: 12 }} icon={faCheckDouble} />;
        
      case "sent":
        return <FontAwesomeIcon className="ms-1 text-gray-500" style={{ fontSize: 12 }} icon={faCheck} />;
        
      case "failed":
        return <FontAwesomeIcon className="ms-1 text-red-500" style={{ fontSize: 12 }} icon={faCircleExclamation} />;
        
      case "sending":
        return (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-2 w-2 ms-2 border-t-2 border-gray-400"></div>
          </div>
        );
        
      case "received":
        return <FontAwesomeIcon className="ms-1 text-gray-500" style={{ fontSize: 12 }} icon={faCheck} />;
        
      default:
        return null;
    }
  };
  

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || `file_${new Date().getTime()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (fileType) => {
    if (fileType === "pdf") return faFilePdf;
    if (fileType === "doc" || fileType === "docx") return faFileWord;
    return faFile;
  };

  if (!chatHistory || chatHistory?.length === 0) return null;

  return (
    <div className="message-list flex overflow-y-auto overflow-x-hidden h-[60vh] flex-col relative scrollbar-hide">
      {chatHistory.map((msg, index) => {
        const isOutgoing = msg.company_is_sender;
        const userDisplayInfo = msg.user_sender_details?.last_name || msg.user_sender_details?.first_name || msg.user_sender_details?.email;

        return (
          <div className={`chat ${isOutgoing ? "chat-right" : "chat-left"}`} key={index}>
            <div className={`mt-1 bubble-chat ${isOutgoing ? "bubble-chat-user" : "bubble-chat-other"}`}>
              {msg.channel?.image && (
                <div
                  className={`absolute -top-2 ${isOutgoing ? "-right-3" : "-left-3"} mb-7 w-5 h-5 bg-white rounded-full border border-gray-300 shadow-md p-[2px]`}
                  onMouseEnter={() => setHoveredChannelId(index)}
                  onMouseLeave={() => setHoveredChannelId(null)}
                >
                  <Image
                    loader={() => msg.channel.image}
                    src={msg.channel.image}
                    alt="Channel Icon"
                    className="rounded-full"
                    width={18}
                    height={18}
                  />
                  {hoveredChannelId === index && msg.channel?.name && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg z-50">
                      {msg.channel.name}
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                {msg?.channel?.id == 7 &&
                  <div className="text-lg font-semibold mb-10">Subject: <span>{msg?.subject ?? "__"}</span></div>
                }
                {isOutgoing ? (
                  <div className="flex items-center relative">
                    <div
                      className="relative pointer shrink-0"
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
                        onClick={() => router.push(`/nativecrm/users/${msg.user_sender_details.id}`)}
                        title={msg.user_sender_details.name}
                      />
                    ) : msg.user_sender_details?.first_name || msg.user_sender_details?.last_name || msg.user_sender_details?.email ? (
                      <UserAvatar 
                        className="mr-3 shrink-0" 
                        name={
                          msg.user_sender_details?.first_name || msg.user_sender_details?.last_name
                            ? `${msg.user_sender_details?.first_name || ''} ${msg.user_sender_details?.last_name || ''}`.trim()
                            : msg.user_sender_details?.email
                        }
                        width="w-8" 
                        height="h-8"
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 flex items-center justify-center bg-green-200 text-white rounded-full border mr-3"
                        title="AI Assistant"
                      >
                        <FontAwesomeIcon icon={faRobot} className="sm" color="#3EBF0F" />
                      </div>
                    )}
                    </div>

                    {/* Handle Different Content Types */}
                    <div className="flex flex-col">
                      {/* If message contains images, display them first */}
                      {msg.content_type === "image" && msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {msg.attachments.map((attachment, i) => (
                            <Image
                              key={i}
                              loader={() => attachment.file}
                              src={attachment.file}
                              alt="Sent Image"
                              className="image-message max-w-[250px] max-h-[250px] pointer"
                              width={250}
                              height={250}
                              onClick={() => openImageModal(attachment.file)}
                            />
                          ))}
                        </div>
                      )}

                      {/* If message contains documents, display them */}
                      {msg.content_type === "document" && msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {msg.attachments.map((attachment, i) => {
                            const fileType = attachment.file.split('.').pop(); // Extract file extension
                            const fileName = attachment.file.split('/').pop(); // Extract file name
                            return (
                              <div key={i} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <FontAwesomeIcon icon={getFileIcon(fileType)} className="text-gray-600 dark:text-gray-300" />
                                <span className="text-sm truncate text-white">{fileName}</span>
                                <button
                                  className="ml-auto text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                  onClick={() => downloadFile(attachment.file, fileName)}
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Display text content below images or documents (if available) */}
                      {msg.content_type === "text" || msg.content_type === "image" || msg.content_type === "document" ? (
                        <p style={{ whiteSpace: "pre-wrap", marginTop: msg.attachments?.length ? "8px" : "0" }}>
                          {msg.content}
                        </p>
                      ) : msg.content_type === "html" ? (
                        <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                      ) : null}
                    </div>

                    {hoveredUserId === index && userDisplayInfo && (
                      <div className="absolute -top-3 left-0 transform -translate-x-4 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg z-50 w-fit truncate">
                        {userDisplayInfo}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {/* If message contains documents, display them */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="mt-10 mb-2 font-semibold underline">{msg.attachments.length == 1 ? 'Attachment' : 'Attachments'}</div>
                        {msg.attachments.map((attachment, i) => {
                          const fileType = attachment.file.split('.').pop();
                          const fileName = attachment.file.split('/').pop();

                          if (attachment.file_type == 'image') {
                            return (
                              <Image
                                key={i}
                                loader={() => attachment.file}
                                src={attachment.file}
                                alt="Sent Image"
                                className="image-message max-w-[250px] max-h-[250px] pointer mb-2"
                                width={300}
                                height={300}
                                onClick={() => openImageModal(attachment.file)}
                              />
                            )
                          }
                          else {
                            return (
                              <div key={i} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                                <FontAwesomeIcon icon={getFileIcon(fileType)} className="text-gray-600 dark:text-gray-300" />
                                <span className="text-sm truncate ">{fileName}</span>
                                <button
                                  className="ml-auto text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                  onClick={() => downloadFile(attachment.file, fileName)}
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </button>
                              </div>
                            );
                          }
                        })}
                      </div>
                    )}

                    {/* Show text content below images or documents if present */}
                    {msg.content_type === "text" || msg.content_type === "image" || msg.content_type === "document" ? (
                      <p style={{ whiteSpace: "pre-wrap", marginTop: msg.attachments?.length ? "8px" : "0" }}>
                        {msg.content}
                      </p>
                    ) : msg.content_type === "html" ? (
                      <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                    ) : <i>invalid content</i>}
                  </div>
                )}
              </div>
            </div>

            <div className={`mt-1 flex items-center ${isOutgoing ? "justify-end" : "justify-start"}`}>
              <p className="message-time">
                {getSmartTimestamp(msg.created_at)}
              </p>
              {isOutgoing && getIconForStatus(msg.status)}

            </div>
          </div>
        );
      })}
      <div ref={messageEndRef} />

      {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80 z-50" onClick={closeImageModal}>
          <div className="relative p-4" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-white text-xl" onClick={closeImageModal}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <Image src={selectedImage} alt="Full Image" width={600} height={600} className="rounded-lg" />
            <button className="mt-3 px-4 py-2 bg-white text-gray-800 rounded-lg shadow" onClick={() => downloadFile(selectedImage)}>
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;