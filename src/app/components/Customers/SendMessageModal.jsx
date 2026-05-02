"use client";
import React, { useEffect, useRef, useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Select from 'react-select';
import { selectStyles } from "../selectStyles";
import Modal from "../Modal";
import EmailComposer from "../Message/EmailComposer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faImage,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const SendMessageModal = ({ isOpen, onClose, customerId, customerName, onMessageSent }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState("Hello! there!!, I'm reaching out to follow up on your recent interest.");
  const [emailSubject, setEmailSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, _setSelectedImages] = useState([]);
  const [selectedFiles, _setSelectedFiles] = useState([]);

  const setSelectedImages = (updater) => {
    _setSelectedImages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next.length > 4) {
        alert("Maximum 4 images allowed.");
        return next.slice(0, 4);
      }
      return next;
    });
  };

  const setSelectedFiles = (updater) => {
    _setSelectedFiles(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next.length > 4) {
        alert("Maximum 4 documents allowed.");
        return next.slice(0, 4);
      }
      return next;
    });
  };

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const isEmailChannel = selectedChannel?.label === "Email";

  const resetModalState = () => {
    setMessage("Hello! there!!, I'm reaching out to follow up on your recent interest.");
    setEmailSubject("");
    setSelectedImages([]);
    setSelectedFiles([]);
    setSelectedChannel(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDocumentChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (fileInputRef.current) fileInputRef.current.value = null;

    if (newFiles.length > 0) {
      const maxSizeInMB = 30;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
      const validFiles = newFiles.filter(file => {
        if (file.size > maxSizeInBytes) {
          alert(`File ${file.name} is too large. Maximum size allowed is ${maxSizeInMB}MB.`);
          return false;
        }
        return true;
      });

      setSelectedFiles(prev => {
        const total = [...prev, ...validFiles];
        if (total.length > 4) {
          alert("Maximum 4 documents allowed.");
          return total.slice(0, 4);
        }
        return total;
      });
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    const validImages = newFiles.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`Invalid type for ${file.name}. Please upload JPG, PNG, or WEBP.`);
        return false;
      }
      if (file.size > maxSizeInBytes) {
        alert(`Image ${file.name} is too large. Maximum 5MB allowed.`);
        return false;
      }
      return true;
    });

    setSelectedImages(prev => {
      const total = [...prev, ...validImages];
      if (total.length > 4) {
        alert("Maximum 4 images allowed.");
        return total.slice(0, 4);
      }
      return total;
    });

    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  const removeSelectedImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    } else {
      resetModalState();
    }
  }, [isOpen]);

  const fetchChannels = async () => {
    try {
      const response = await axiosInstance.get("/channels/connected-channels/");
      setChannels(response.data.connected_channels.map((channel) => ({
        value: channel?.id,
        label: channel?.name
      })));
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSendMessage = async () => {
    const plainTextMessage = isEmailChannel
      ? message.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      : message.trim();

    if (!selectedChannel || (!plainTextMessage && selectedImages.length === 0 && selectedFiles.length === 0 && !emailSubject.trim())) return;
  
    setIsLoading(true);
  
    const formData = new FormData();
  
    const contentType = selectedImages.length > 0
      ? "image"
      : selectedFiles.length > 0
      ? "document"
      : "text";
  
    formData.append("customer_id", customerId);
    formData.append("channel_id", selectedChannel.value);
    formData.append("content", message || "");
    formData.append("subject", isEmailChannel ? emailSubject : "");
    formData.append("content_type", contentType);
  
    selectedImages.forEach(image => {
      formData.append("image", image);
    });
    
    selectedFiles.forEach(file => {
      formData.append("document", file);
    });
  
    try {
      const response = await axiosInstance.post(
        "/communication/send-to-customer/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 201) {
        setIsLoading(false);
        onMessageSent();
        resetModalState();
      }
    } catch (error) {
      handleApiError(error);
      setIsLoading(false);
    }
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate a Conversation"
      width={isEmailChannel ? "900px" : "500px"}
      footer={
        <div className="flex gap-3 w-7/12">
          <button 
            onClick={onClose} 
            className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSendMessage} 
            className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
            disabled={!selectedChannel || isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      }
    >
      <div className="mb-4">
        <p>Send a message to start a conversation with <strong>{customerName}</strong>.</p>
      </div>

      {isEmailChannel ? (
        <div className="mb-4 border body-theme rounded-md overflow-hidden">
          <EmailComposer
            selectedChannel={selectedChannel}
            subject={emailSubject}
            onSubjectChange={setEmailSubject}
            message={message}
            onMessageChange={setMessage}
            selectedImages={selectedImages}
            onSelectedImagesChange={setSelectedImages}
            selectedFiles={selectedFiles}
            onSelectedFilesChange={setSelectedFiles}
            hideSendButton
          />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className="w-full border body-theme rounded-md p-2 mt-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Hidden Inputs */}
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            ref={imageInputRef}
            onChange={handleImageChange}
          />

          {/* Hidden Inputs */}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.zip"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleDocumentChange}
          />

          {/* Icon Buttons */}
          <div className="flex gap-3">
            <div
              onClick={selectedFiles.length > 0 ? undefined : handleImageSelect}
              className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#0D0D12] shadow-md border border-gray-600 cursor-pointer ${
                selectedFiles.length > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FontAwesomeIcon icon={faImage} className="text-white" />
            </div>

            <div
              onClick={selectedImages.length > 0 ? undefined : handleFileSelect}
              className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#0D0D12] shadow-md border border-gray-600 cursor-pointer ${
                selectedImages.length > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FontAwesomeIcon icon={faPaperclip} className="text-white" />
            </div>
          </div>

          {selectedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedImages.map((img, index) => (
                <div key={index} className="image-preview-container relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Selected ${index}`}
                    className="image-preview w-20 h-20 object-cover rounded"
                  />
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    className="remove-image absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer" 
                    onClick={() => removeSelectedImage(index)} 
                  />
                </div>
              ))}
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-preview flex items-center justify-between bg-gray-100 p-2 rounded">
                  <p className="text-sm truncate flex-1">
                    {file.name.length > 50
                      ? file.name.slice(0, 50) + '...'
                      : file.name}
                  </p>
                  <button onClick={() => removeSelectedFile(index)} className="remove-file-btn ml-2" title="Remove File">
                    <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}


      <div className="mb-4 mt-8">
        <label className="block text-sm mb-2 font-medium">Select Channel</label>
        <Select
          options={channels}
          value={selectedChannel}
          onChange={setSelectedChannel}
          styles={selectStyles}
          placeholder="Select a Channel"
        />
      </div>
    </Modal>
  );
};

export default SendMessageModal;
