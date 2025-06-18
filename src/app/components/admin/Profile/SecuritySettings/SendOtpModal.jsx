import React, { useEffect, useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Modal from "../../Modal";
import { useAuth } from "@/context/AuthContext";


const SendOtpModal = ({ isModalOpen, closeModal, goToVerifyOtp }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [email, setEmail] = useState();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {        
        const userResponse = await axiosInstance.get(`/users/me`)

        const userData = userResponse.data.user;

        setEmail(userData.email)
      } catch (error) {
        handleApiError(error);
      } 
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/forgot-password/send-otp/", {
        email
      });

    closeModal();  
    goToVerifyOtp()

    } catch (error) {
      handleApiError(error);
    }
  };

  const modalFooter = (
    <>
      <button
        type="button"
        onClick={closeModal}
        className="px-4 py-2 bg-theme rounded-md border border-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
      >
        Send code
      </button>
    </>
  );

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          <>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.66666 6.66732C7.66666 5.37865 8.71133 4.33398 9.99999 4.33398C11.2887 4.33398 12.3333 5.37865 12.3333 6.66732V9.00065H7.66666V6.66732ZM14.3333 6.66732V9.00577C15.7284 9.09181 16.8333 10.2505 16.8333 11.6673V15.0007C16.8333 16.4734 15.6394 17.6673 14.1667 17.6673H5.83332C4.36056 17.6673 3.16666 16.4734 3.16666 15.0007V11.6673C3.16666 10.2505 4.27153 9.09181 5.66666 9.00577V6.66732C5.66666 4.27408 7.60676 2.33398 9.99999 2.33398C12.3932 2.33398 14.3333 4.27408 14.3333 6.66732ZM5.16666 11.6673C5.16666 11.2991 5.46513 11.0007 5.83332 11.0007H6.66666H13.3333H14.1667C14.5348 11.0007 14.8333 11.2991 14.8333 11.6673V15.0007C14.8333 15.3688 14.5348 15.6673 14.1667 15.6673H5.83332C5.46513 15.6673 5.16666 15.3688 5.16666 15.0007V11.6673ZM9.99999 14.3757C10.5753 14.3757 11.0417 13.9093 11.0417 13.334C11.0417 12.7587 10.5753 12.2923 9.99999 12.2923C9.42469 12.2923 8.95832 12.7587 8.95832 13.334C8.95832 13.9093 9.42469 14.3757 9.99999 14.3757Z" fill="#808897"/>
            </svg>
            <span className="ml-2">
                Update password
            </span>
          </>
        }
        footer={modalFooter}
        width="500px"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb-1">
              <label>Verify your email address</label>
            </div>

            <input
              type="email"
              name="email"
              value={email}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:border-[#3EBF0F] focus:outline-none"
              placeholder="johndoe@mail.com"
              required
              disabled
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SendOtpModal;
