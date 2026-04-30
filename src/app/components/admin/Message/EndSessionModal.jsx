import React, { useState } from "react";
import Modal from "../../Modal";
import { useApi } from "@/services/axiosConfig";

const EndSessionModal = ({ 
  isOpen, 
  onClose, 
  conversationId, 
  setIsSuccessModalOpen, 
  setSuccessModalMessage 
}) => {
  const [reason, setReason] = useState("");
  const { axiosInstance } = useApi();

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleEndSession = async () => {
    console.log("converstaino id is ", conversationId)
    if (!conversationId) return;

    try {
      const payload = {
        reason,
      };

      const response = await axiosInstance.post(`/communication/conversations/${conversationId}/end/`, payload);
      console.log("Session ended:", response.data);
      
      setSuccessModalMessage(`This conversation has been ended successfully.`);
      setIsSuccessModalOpen(true);
      onClose();
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const footerContent = (
    <>
      <button
        onClick={onClose}
        className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30"
      >
        Cancel
      </button>
      <button
        onClick={handleEndSession}
        className="cursor-pointer w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
      >
        End Session
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="End Session"
      showFooter={true}
      footer={footerContent}
      width="500px"
    >
      <div className="modal-body">
        <div className="mt-4 body-theme">
          <label htmlFor="session-reason" className="block text-sm font-medium">
            Reason for Ending the Session (Optional)
          </label>
          <textarea
            id="session-reason"
            value={reason}
            onChange={handleReasonChange}
            placeholder="Type reason..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 body-theme"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EndSessionModal;
