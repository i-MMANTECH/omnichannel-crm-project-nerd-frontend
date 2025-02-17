import React from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useRouter } from "next/router";

const EndSessionModal = ({ isOpen, onClose, onConfirm }) => {
  const { axiosInstance } = useApi();
  const router = useRouter();

  const chatId = router.query.id;

  const handleConfirm = async () => {
    if (!chatId) {
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/communication/conversations/${chatId}/end/`
      );
      
      if (onConfirm) {
        onConfirm(response.data);
      }
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      onClose();
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
        onClick={handleConfirm}
        className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
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
      width="400px"
    >
      <div className="modal-body">
        <p>Are you sure you want to end this session?</p>
      </div>
    </Modal>
  );
};

export default EndSessionModal;
