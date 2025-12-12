import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./messageInput.css";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { MultiSelectModal } from "./MultiSelectModal";
import EmailComposer from "./EmailComposer";

const MessageInput = ({ onSendMessage, activeUser, chatType, setInputIsEmailMode }) => {
  const [message, setMessage] = useState("");
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (setInputIsEmailMode) {
      setInputIsEmailMode(selectedChannel?.label === "Email");
    }
  }, [selectedChannel]);

  useEffect(() => {
    if (chatType === "customers") {
      fetchChannels();
    }
  }, [chatType]);

  // Reset everything when chat user or chat type changes
  useEffect(() => {
    setMessage("");
    setSelectedImages([]);
    setSelectedFiles([]);
    setIsOpen(false);
    if (chatType === "customers") {
      fetchChannels();
    } else {
      setSelectedChannel(
        {
          value: activeUser.channel?.id,
          label: activeUser.channel?.name,
          image: activeUser.channel?.image,
        }
      );
    }
  }, [activeUser, chatType]);

  const fetchChannels = async () => {
    setIsLoadingChannels(true);
    try {
      const response = await axiosInstance.get("/channels/connected-channels/");
      const mapped = response.data.connected_channels.map((channel) => ({
        value: channel?.id,
        label: channel?.name,
        image: channel?.image,
      }));
      setChannels(mapped);
      if (mapped.length > 0) {
        setSelectedChannel(mapped[0]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingChannels(false);
    }
  };

  const handleInputChangeInternal = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageSelect = (files) => {
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (files) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleAttachOptions = () => {
    setIsOpen((prev) => !prev);
  };

  const sendMessage = () => {
    if (!message.trim() && selectedImages.length === 0 && selectedFiles.length === 0) return;

    const messagePayload = {
      text: message.trim(),
      channel_id: selectedChannel?.value,
      file: selectedFiles.length > 0 ? selectedFiles : null,
      image: selectedImages.length > 0 ? selectedImages : null,
    };

    onSendMessage(messagePayload);
    setMessage("");
    setSelectedImages([]);
    setSelectedFiles([]);
    setIsOpen(false);
  };

  return (
    <div className={`body-theme type absolute bottom-0 w-full pr-6 pt-4 ${
      selectedChannel?.label !== "Email" ? 'pb-4' : ''
    }`}>
      <div className="write-area ">
        {chatType === "customers" && (
          <div className="relative ml-2">
            <button
              className="rounded-full bg-white p-1 text-sm flex items-center gap-2"
              onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
            >
              {!isLoadingChannels ? (
                <img src={selectedChannel?.image} alt={selectedChannel?.label} className="w-7 h-7 rounded-full" />
              ) : (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              )}
            </button>

            {channelDropdownOpen && (
              <ul className="absolute z-10 mb-5 bottom-full body-theme border rounded shadow w-48">
                {channels.map((channel) => (
                  <li
                    key={channel.value}
                    onClick={() => {
                      setSelectedChannel(channel);
                      setChannelDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
                  >
                    <img src={channel.image} alt={channel.label} className="w-5 h-5 rounded-full" />
                    <span className="text-sm">{channel.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {selectedChannel?.label !== "Email" && (
          <div className="attach-icon bg-white rounded-full pl-4" onClick={() => setIsOpen(true)}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17 7.75C11.8914 7.75 7.75 11.8914 7.75 17C7.75 22.1086 11.8914 26.25 17 26.25C22.1086 26.25 26.25 22.1086 26.25 17C26.25 11.8914 22.1086 7.75 17 7.75ZM6.25 17C6.25 11.0629 11.0629 6.25 17 6.25C22.9371 6.25 27.75 11.0629 27.75 17C27.75 22.9371 22.9371 27.75 17 27.75C11.0629 27.75 6.25 22.9371 6.25 17ZM14.6514 12.628C16.5129 10.7783 19.5165 10.7758 21.3704 12.6297L21.372 12.6314C23.2217 14.4929 23.2242 17.4965 21.3704 19.3503L19.1503 21.5703C18.0774 22.6432 16.3325 22.6432 15.2596 21.5703C14.1867 20.4974 14.1867 18.7525 15.2596 17.6796L16.6697 16.2696C16.9626 15.9767 17.4375 15.9768 17.7303 16.2697C18.0232 16.5625 18.0232 17.0374 17.7303 17.3303L16.3203 18.7403C15.8332 19.2274 15.8332 20.0226 16.3203 20.5097C16.8074 20.9968 17.6026 20.9968 18.0897 20.5097L20.3097 18.2897C21.5756 17.0238 21.5783 14.9679 20.3088 13.6895C19.0428 12.4244 16.9876 12.422 15.7094 13.6912L13.2903 16.1103C12.2432 17.1574 12.2432 18.8525 13.2903 19.8996C13.5832 20.1925 13.5832 20.6674 13.2903 20.9603C12.9974 21.2532 12.5226 21.2532 12.2297 20.9603C10.5968 19.3274 10.5968 16.6825 12.2297 15.0496L14.6514 12.628Z"
                fill="#0D0D12"
              />
            </svg>
          </div>
        )}

        {selectedChannel?.label !== "Email" && isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50">
            <MultiSelectModal
              selectedImages={selectedImages}
              selectedFiles={selectedFiles}
              onImageSelect={handleImageSelect}
              onFileSelect={handleFileSelect}
              onRemoveImage={removeSelectedImage}
              onRemoveFile={removeSelectedFile}
              onToggleAttachOptions={toggleAttachOptions}
              message={message}
              onSendMessage={setMessage}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onSend={sendMessage}
              activeUser={activeUser}
            />
          </div>
        )}

        {selectedChannel?.label === "Email" ? (
          <div style={{ width: "100%" }}>
            <EmailComposer
              onSendMessage={onSendMessage}
              selectedChannel={selectedChannel}
            />
          </div>
        ) : (
          !isOpen && (
            <textarea
              placeholder="Write message here..."
              className="message-input body-theme "
              value={message}
              onChange={handleInputChangeInternal}
              onKeyDown={handleKeyDown}
              rows={message.split("\n").length}
              style={{ border: 'none'}}
            />
          )
        )}
      </div>

       {selectedChannel?.label !== "Email" && <>
          {message || selectedImages || selectedFiles ? (
            <button className="send-button" onClick={(sendMessage)}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          ) : (
            <button className="send-button">
              <FontAwesomeIcon icon={faPaperPlane} color="grey"/>
            </button>
          )}
       </>}
    </div>
  );
};

export default MessageInput;
