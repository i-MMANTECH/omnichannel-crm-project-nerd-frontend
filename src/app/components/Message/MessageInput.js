import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faPaperclip,
  faPaperPlane,
  faImage,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./messageInput.css";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { X } from "lucide-react";


const MessageInput = ({onSendMessage, onSendImage, onRemoveImage, chatType}) => {
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatType == "customers") {
      fetchChannels();
    }
  }, [chatType]);

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

  const handleAttachClick = () => {
    setShowAttachOptions((prev) => !prev);
  };

  const handleInputChangeInternal = (e) => {
    const text = e.target.value;
    setInputText(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileSelect = () => {
    imageInputRef.current.click();
  };
  const handleDocSelect = () => {
    fileInputRef.current.click();
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];

    if (fileInputRef.current) fileInputRef.current.value = null;

    if (file) {
      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        alert(`File is too large. Maximum size allowed is ${maxSizeInMB}MB.`);
        return;
      }

      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > maxSizeInBytes) {
      alert(`File is too large. Maximum allowed size is ${maxSizeInMB}MB.`);
      return;
    }

    setSelectedImage(file);
    onSendImage(file);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    onRemoveImage(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  const sendMessage = () => {
    if (!inputText.trim() && !selectedImage && !selectedFile) return;

    const messagePayload = {
      text: inputText.trim(),
      channel_id: selectedChannel?.value,
      file: selectedFile || null,
    };

    onSendMessage(messagePayload);
    setInputText("");
    setSelectedImage(null);
    setSelectedFile(null);
    setShowAttachOptions(false);
  };

  return (
    <div className="body-theme type absolute bottom-0">
      <div className="write-area ">
        <div className="attach-icon bg-white rounded-full" onClick={handleAttachClick}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M17 7.75C11.8914 7.75 7.75 11.8914 7.75 17C7.75 22.1086 11.8914 26.25 17 26.25C22.1086 26.25 26.25 22.1086 26.25 17C26.25 11.8914 22.1086 7.75 17 7.75ZM6.25 17C6.25 11.0629 11.0629 6.25 17 6.25C22.9371 6.25 27.75 11.0629 27.75 17C27.75 22.9371 22.9371 27.75 17 27.75C11.0629 27.75 6.25 22.9371 6.25 17ZM14.6514 12.628C16.5129 10.7783 19.5165 10.7758 21.3704 12.6297L21.372 12.6314C23.2217 14.4929 23.2242 17.4965 21.3704 19.3503L19.1503 21.5703C18.0774 22.6432 16.3325 22.6432 15.2596 21.5703C14.1867 20.4974 14.1867 18.7525 15.2596 17.6796L16.6697 16.2696C16.9626 15.9767 17.4375 15.9768 17.7303 16.2697C18.0232 16.5625 18.0232 17.0374 17.7303 17.3303L16.3203 18.7403C15.8332 19.2274 15.8332 20.0226 16.3203 20.5097C16.8074 20.9968 17.6026 20.9968 18.0897 20.5097L20.3097 18.2897C21.5756 17.0238 21.5783 14.9679 20.3088 13.6895C19.0428 12.4244 16.9876 12.422 15.7094 13.6912L15.7086 13.692L13.2903 16.1103C12.2432 17.1574 12.2432 18.8525 13.2903 19.8996C13.5832 20.1925 13.5832 20.6674 13.2903 20.9603C12.9974 21.2532 12.5226 21.2532 12.2297 20.9603C10.5968 19.3274 10.5968 16.6825 12.2297 15.0496L14.6514 12.628Z" fill="#0D0D12"/>
          </svg>
        </div>
        {showAttachOptions && (
          <div className="attach-options top-[-140px] flex gap-3">
            <div
              onClick={selectedFile ? undefined : handleFileSelect}
              className={`w-[60px] h-[60px] flex items-center justify-center rounded-full bg-[#0D0D12] shadow-md border border-gray-600 cursor-pointer ${selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FontAwesomeIcon icon={faImage} className="text-white text-xl" />
            </div>
            <div
              onClick={selectedImage ? undefined : handleDocSelect}
              className={`w-[60px] h-[60px] flex items-center justify-center rounded-full bg-[#0D0D12] shadow-md border border-gray-600 cursor-pointer ${selectedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FontAwesomeIcon icon={faPaperclip} className="text-white text-xl" />
            </div>
          </div>
        )}
        {chatType === "customers" && (
          <div className="relative ml-2">
            <button
              className=" rounded-full bg-white  p-1 text-sm flex items-center gap-2"
              onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
            >
              {!isLoadingChannels ? (
                <img src={selectedChannel?.image} alt="icon" className="w-7 h-7 rounded-full" />
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
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <div className=" rounded-full bg-white  p-1 text-sm flex items-center gap-2"                    >
                      <img src={channel.image} alt={channel.label} className="w-5 h-5 rounded-full" />
                    </div>
                    <span className="text-sm">{channel.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <textarea
          placeholder="Type your message..."
          className="message-input body-theme"
          value={inputText}
          onChange={handleInputChangeInternal}
          onKeyDown={handleKeyDown}
          rows={inputText.split("\n").length}
        />
        {selectedImage && (
          <div className="image-preview-container">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="image-preview"
            />
            <FontAwesomeIcon icon={faTimes} className="remove-image" onClick={removeSelectedImage} />
          </div>
        )}

       {selectedFile && (
        <div className="file-preview">
          <p>
            {selectedFile.name.length > 13
              ? selectedFile.name.slice(0, 13) + '...'
              : selectedFile.name}
          </p>
          <button onClick={removeSelectedFile} className="remove-file-btn" title="Remove File">
            <X size={18} color="red" />
          </button>
        </div>
      )}

      </div>
      {inputText || selectedImage || selectedFile ? (
        <button className="send-button" onClick={(sendMessage)}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      ) : (
        <button className="send-button">
          <FontAwesomeIcon icon={faPaperPlane} color="grey"/>
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={imageInputRef}
        onChange={handleImageChange}
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,.zip"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleDocumentChange}
      />
    </div>
  );
};

export default MessageInput;
