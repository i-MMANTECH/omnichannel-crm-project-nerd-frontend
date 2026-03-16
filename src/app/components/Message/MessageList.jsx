import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faDownload, faFilePdf, faFileWord, faFile } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faCheckDouble, faCircleExclamation, faRobot } from "@fortawesome/free-solid-svg-icons";
import "./messageList.css";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dot } from "lucide-react";



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

const MessageList = ({ chatHistory, isLoadingHistory, inputIsEmailMode, loadMoreMessages, isFetchingMore, isScrolledUp, setIsScrolledUp, next, chatType, currentUserId }) => {
  const messageEndRef = useRef(null);
  const listRef = useRef(null);
  const router = useRouter();
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const [hoveredChannelId, setHoveredChannelId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [pendingPrepend, setPendingPrepend] = useState(false);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const [prevScrollTop, setPrevScrollTop] = useState(0);
  const anchorIdRef = useRef(null);

  const handleScroll = (e) => {
    const container = e.target;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const atTop = scrollTop <= 0;
    const nearBottom = scrollHeight - (scrollTop + clientHeight) < 20;

    // If user gets near the bottom again, re-enable auto-bottom behavior
    if (nearBottom && isScrolledUp) setIsScrolledUp(false);

    // Infinite scroll up (only if there's a next page and we're not fetching)
    if (atTop && !isFetchingMore && next) {
      setIsScrolledUp(true); // user is up-reading
      setPendingPrepend(true);
      setPrevScrollHeight(container?.scrollHeight || 0);
      setPrevScrollTop(container?.scrollTop || 0); // will be 0 at top, but kept for symmetry
      const firstMsgEl = container?.querySelector('.chat');
      anchorIdRef.current = firstMsgEl?.getAttribute('data-mid') || null;
      loadMoreMessages();
    }
  };

  useEffect(() => {
    if (pendingPrepend && listRef.current) {
      const container = listRef.current;

      const doAdjust = () => {
        const newHeight = container.scrollHeight || 0;
        const delta = newHeight - prevScrollHeight;

        // Temporarily disable smooth behavior to avoid animation while we correct position
        const prevBehavior = container.style.scrollBehavior;
        container.style.scrollBehavior = 'auto';
        container.scrollTop = (prevScrollTop || 0) + delta; // land at bottom of the newly loaded batch

        // Fallback: if images/fonts caused reflow, anchor on the old first visible message
        if (anchorIdRef.current) {
          const anchorEl = container.querySelector(`[data-mid="${anchorIdRef.current}"]`);
          if (anchorEl) anchorEl.scrollIntoView({ block: 'start' });
        }

        container.style.scrollBehavior = prevBehavior || '';
        setPendingPrepend(false);
        anchorIdRef.current = null;
      };

      // Double RAF to ensure layout (images/markdown) has settled
      requestAnimationFrame(() => requestAnimationFrame(doAdjust));

      // Extra tiny recheck after images might decode
      setTimeout(() => {
        if (!isScrolledUp || !listRef.current) return;
        const anchorEl = anchorIdRef.current
          ? listRef.current.querySelector(`[data-mid="${anchorIdRef.current}"]`)
          : null;
        if (anchorEl) anchorEl.scrollIntoView({ block: 'start' });
      }, 100);

      return;
    }

    // Otherwise (new message / initial load) auto-scroll to bottom if not up-reading
    if (!isScrolledUp) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isScrolledUp, pendingPrepend, prevScrollHeight, prevScrollTop]);

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

  const openVideoModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedVideo(null);
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

  const getFileExtension = (fileUrl = "") => {
    const cleanUrl = String(fileUrl).split("?")[0];
    const parts = cleanUrl.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  };

  const isVideoAttachment = (attachment) => {
    if (!attachment) return false;
    if (attachment.file_type === "video") return true;
    const ext = getFileExtension(attachment.file);
    return ["mp4", "webm", "ogg", "mov", "m4v"].includes(ext);
  };

  const formatTime = (value) => {
    if (!Number.isFinite(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    if (value > 0 && isMuted) {
      setIsMuted(false);
      if (videoRef.current) videoRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  useEffect(() => {
    if (!selectedVideo) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setVolume(1);
      setIsMuted(false);
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 1;
      videoRef.current.muted = false;
    }
  }, [selectedVideo]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (selectedImage) setSelectedImage(null);
      if (selectedVideo) closeVideoModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, selectedVideo]);

  function renderMessageContent(msg) {
    const contentType = msg.content_type || "text"; // ✅ fallback for internal messages

    if (contentType === "html") {
      return <div dangerouslySetInnerHTML={{ __html: msg.content }} />;
    }

    // WhatsApp markdown formatting
    if (contentType === "text" && msg.channel?.name === "WhatsApp") {
      let md = (msg.content || "")
        .replace(/^•\s/gm, "- ")
        .replace(
          /^([A-Za-z0-9 \-\(\)]+):\s*(.+)$/gm,
          (_, title, rest) => `- **${title.trim()}**: ${rest.trim()}`
        );

      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p
                style={{
                  whiteSpace: "pre-wrap",
                  marginTop: msg.attachments?.length ? "8px" : "0",
                }}
                {...props}
              />
            ),
          }}
        >
          {md}
        </ReactMarkdown>
      );
    }

    // ✅ Normal text (internal messages will land here)
    if (contentType === "text") {
      return (
        <div
          style={{
            whiteSpace: "pre-wrap",
            marginTop: msg.attachments?.length ? "8px" : "0",
          }}
        >
          {msg.content}
        </div>
      );
    }

    // If you truly want "image"/"document" to still show msg.content as HTML text
    if (contentType === "image" || contentType === "document") {
      return msg.content ? (
        <div
          style={{
            whiteSpace: "pre-wrap",
            marginTop: msg.attachments?.length ? "8px" : "0",
          }}
        >
          {msg.content}
        </div>
      ) : null;
    }

    return null;
  }



  if (isLoadingHistory) {
    return (
      <div className={`message-list flex overflow-y-auto overflow-x-hidden flex-col relative scrollbar-hide ${inputIsEmailMode ? 'h-[50vh]' : 'h-[60vh]'} p-4 justify-end`}>
        <div className="flex flex-col gap-4 w-full h-full justify-end pb-4">
          <div className="flex w-full justify-start">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-[60%] rounded-tr-xl rounded-br-xl rounded-tl-xl border border-gray-100 dark:border-gray-600"></div>
          </div>
          <div className="flex w-full justify-end">
            <div className="animate-pulse bg-[#e1f7d5] dark:bg-green-900/40 h-10 w-[50%] rounded-tl-xl rounded-bl-xl rounded-tr-xl border border-green-100 dark:border-green-800"></div>
          </div>
          <div className="flex w-full justify-start">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-14 w-[75%] rounded-tr-xl rounded-br-xl rounded-tl-xl border border-gray-100 dark:border-gray-600"></div>
          </div>
          <div className="flex w-full justify-end">
            <div className="animate-pulse bg-[#e1f7d5] dark:bg-green-900/40 h-20 w-[65%] rounded-tl-xl rounded-bl-xl rounded-tr-xl border border-green-100 dark:border-green-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!chatHistory || chatHistory?.length === 0) return null;

  return (
    <div
      className={`message-list flex overflow-y-auto overflow-x-hidden flex-col relative scrollbar-hide ${inputIsEmailMode ? 'h-[50vh]' : 'h-[60vh]'
        }`}
      ref={listRef}
      onScroll={handleScroll}
    >
      {chatHistory.map((msg, index) => {
        const isSystemMessage = msg.is_system_message;
        const isOutgoing =
          chatType === "internal"
            ? msg?.sender?.id === currentUserId
            : !!msg.company_is_sender;

        const userDisplayInfo =
          msg.user_sender_details?.last_name ||
          msg.user_sender_details?.first_name ||
          msg.user_sender_details?.email;

        // --- STABLE KEY (critical for anchoring) ---
        const stableKey = msg.id ?? msg.uuid ?? `${msg.created_at ?? ''}-${index}`;

        // Render ticket notification messages (when ticket is created or closed)
        if (msg.message_type === 'ticket_notification' || msg.is_ticket_notification) {
          return (
            <div key={stableKey} className="flex justify-center my-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2 text-sm max-w-[80%]">
                <p className="text-green-800 dark:text-green-300 text-center">
                  {msg.content || msg.notification_text}
                </p>
              </div>
            </div>
          );
        }

        return (
          <React.Fragment key={stableKey}>
            {isSystemMessage ? (
              <div className="flex items-center justify-center w-full mt-4">
                <div
                  className="flex items-center text-sm px-2 py-1 rounded  bg-purple-200">
                  {msg.content} <Dot></Dot> {getSmartTimestamp(msg.created_at)}
                </div>
              </div>

            ) :
              <div className={`chat ${isOutgoing ? "chat-right" : "chat-left"}`}>
                <div className={`mt-1 bubble-chat ${isOutgoing ? "bubble-chat-user" : "bubble-chat-other"}`}>
                  {msg?.channel?.image && (
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
                      <div className="text-lg font-semibold mb-5"><span>{msg?.subject ?? "__"}</span></div>
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
                              // onClick={() => router.push(`/nativecrm/users/${msg.user_sender_details?.id}`)}
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
                                if (isVideoAttachment(attachment)) {
                                  return (
                                    <div key={i} className="relative max-w-[320px]">
                                      <video
                                        src={attachment.file}
                                        className="max-w-[320px] max-h-[240px] rounded-lg cursor-pointer bg-black"
                                        muted
                                        playsInline
                                        onClick={() => openVideoModal(attachment.file)}
                                      />
                                      <button
                                        type="button"
                                        className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/30 rounded-lg"
                                        onClick={() => openVideoModal(attachment.file)}
                                      >
                                        Play
                                      </button>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <FontAwesomeIcon icon={getFileIcon(fileType)} className="text-gray-600 dark:text-gray-300" />
                                    <span className="text-sm truncate">{fileName}</span>
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
                          {renderMessageContent(msg)}
                        </div>

                        {hoveredUserId === index && userDisplayInfo && (
                          <div className="absolute -top-3 left-0 transform -translate-x-4 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg z-50 w-fit truncate">
                            {userDisplayInfo}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {/* Show text content below images or documents if present */}
                        {renderMessageContent(msg)}
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
                              if (isVideoAttachment(attachment)) {
                                return (
                                  <div key={i} className="relative max-w-[320px] mb-2">
                                    <video
                                      src={attachment.file}
                                      className="max-w-[320px] max-h-[240px] rounded-lg cursor-pointer bg-black"
                                      muted
                                      playsInline
                                      onClick={() => openVideoModal(attachment.file)}
                                    />
                                    <button
                                      type="button"
                                      className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/30 rounded-lg"
                                      onClick={() => openVideoModal(attachment.file)}
                                    >
                                      Play
                                    </button>
                                  </div>
                                );
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
            }
          </React.Fragment>
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

      {selectedVideo && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80 z-50" onClick={closeVideoModal}>
          <div className="relative p-4 w-[90vw] max-w-[960px]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-white text-xl" onClick={closeVideoModal}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className="bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={selectedVideo}
                className="w-full max-h-[70vh] bg-black"
                playsInline
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration || 0);
                }}
                onTimeUpdate={(e) => {
                  setCurrentTime(e.currentTarget.currentTime || 0);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="flex items-center gap-3 px-3 py-2 bg-[#0D0D12] text-white">
                <button
                  type="button"
                  className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                  onClick={togglePlay}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <span className="text-xs tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1"
                />
                <button
                  type="button"
                  className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
