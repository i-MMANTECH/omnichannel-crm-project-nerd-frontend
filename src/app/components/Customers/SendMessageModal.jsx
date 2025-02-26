import React, { useEffect, useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Select from 'react-select';
import { selectStyles } from "../selectStyles";
import Modal from "../Modal";


const SendMessageModal = ({ isOpen, onClose, customerId, customerName, onMessageSent }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState("Hello! there!!, I'm reaching out to follow up on your recent interest.");
  const [isLoading, setIsLoading] = useState(false);

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
    if (!selectedChannel || !message.trim()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/communication/send-to-customer/", {
        customer_id: customerId,
        content: message,
        content_type: "text",
        channel_id: selectedChannel.value,
      });

      if (response.status === 201) {
        setIsLoading(false);
        onMessageSent(); // Notify parent component (CustomerDetails) to redirect
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
            className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30"
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

      <div className="mb-4">
        <label className="block text-sm font-medium">Select Channel</label>
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
