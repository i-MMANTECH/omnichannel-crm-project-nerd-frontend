"use client";
import React, { useEffect, useRef, useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Select from 'react-select';
import { selectStyles } from "../selectStyles";
import Modal from "../Modal";
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
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
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
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
    if (!selectedChannel || (!message.trim() && !selectedImage && !selectedFile)) return;
  
    setIsLoading(true);
  
    const formData = new FormData();
  
    const contentType = selectedImage
      ? "image"
      : selectedFile
      ? "document"
      : "text";
  
    formData.append("customer_id", customerId);
    formData.append("channel_id", selectedChannel.value);
    formData.append("content", message || ""); // fallback in case message is empty but a file is uploaded
    formData.append("content_type", contentType);
  
    if (selectedImage) {
      formData.append("image", selectedImage);
    } else if (selectedFile) {
      formData.append("document", selectedFile);
    }
  
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
  
        // Reset UI
        setMessage("Hello! there!!, I'm reaching out to follow up on your recent interest.");
        setSelectedImage(null);
        setSelectedFile(null);
        setSelectedChannel(null);
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
      width="500px"
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
        style={{ display: "none" }}
        ref={imageInputRef}
        onChange={handleImageChange}
      />

      {/* Hidden Inputs */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,.zip"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleDocumentChange}
      />

      {/* Icon Buttons */}
      <div className="flex gap-3">
        <div
          onClick={selectedFile ? undefined : handleImageSelect}
          className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#0D0D12] shadow-md border border-gray-600 cursor-pointer ${
            selectedFile ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FontAwesomeIcon icon={faImage} className="text-white" />
        </div>

        <div
          onClick={selectedImage ? undefined : handleFileSelect}
          className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#0D0D12] shadow-md border border-gray-600 cursor-pointer ${
            selectedImage ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FontAwesomeIcon icon={faPaperclip} className="text-white" />
        </div>
      </div>

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
            {selectedFile.name.length > 50
              ? selectedFile.name.slice(0, 50) + '...'
              : selectedFile.name}
          </p>
          <button onClick={removeSelectedFile} className="remove-file-btn" title="Remove File">
            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
          </button>
        </div>
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
