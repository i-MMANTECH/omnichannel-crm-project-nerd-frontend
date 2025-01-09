import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic for password update
    console.log("Password changed successfully", formData);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
      <div className=" p-6 rounded-lg shadow-lg w-[400px]">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.66666 6.66732C7.66666 5.37865 8.71133 4.33398 9.99999 4.33398C11.2887 4.33398 12.3333 5.37865 12.3333 6.66732V9.00065H7.66666V6.66732ZM14.3333 6.66732V9.00577C15.7284 9.09181 16.8333 10.2505 16.8333 11.6673V15.0007C16.8333 16.4734 15.6394 17.6673 14.1667 17.6673H5.83332C4.36056 17.6673 3.16666 16.4734 3.16666 15.0007V11.6673C3.16666 10.2505 4.27153 9.09181 5.66666 9.00577V6.66732C5.66666 4.27408 7.60676 2.33398 9.99999 2.33398C12.3932 2.33398 14.3333 4.27408 14.3333 6.66732ZM5.16666 11.6673C5.16666 11.2991 5.46513 11.0007 5.83332 11.0007H6.66666H13.3333H14.1667C14.5348 11.0007 14.8333 11.2991 14.8333 11.6673V15.0007C14.8333 15.3688 14.5348 15.6673 14.1667 15.6673H5.83332C5.46513 15.6673 5.16666 15.3688 5.16666 15.0007V11.6673ZM9.99999 14.3757C10.5753 14.3757 11.0417 13.9093 11.0417 13.334C11.0417 12.7587 10.5753 12.2923 9.99999 12.2923C9.42469 12.2923 8.95832 12.7587 8.95832 13.334C8.95832 13.9093 9.42469 14.3757 9.99999 14.3757Z"
                fill="#808897"
              />
            </svg>
            <h2
              className="text-lg"
              style={{
                color: "var(--Greyscale-500, #666D80)",
                fontFamily: "Encode Sans",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "150%",
                letterSpacing: "0.32px",
              }}
            >
              Change Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium ">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                name="currentPassword"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="absolute right-2 top-2"
              >
                <FontAwesomeIcon
                  icon={showPasswords.currentPassword ? faEyeSlash : faEye}
                  size="lg"
                  color="#808897"
                />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium ">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-2 top-2"
              >
                <FontAwesomeIcon
                  icon={showPasswords.newPassword ? faEyeSlash : faEye}
                  size="lg"
                  color="#808897"
                />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium ">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-2 top-2"
              >
                <FontAwesomeIcon
                  icon={showPasswords.confirmPassword ? faEyeSlash : faEye}
                  size="lg"
                  color="#808897"
                />
              </button>
            </div>
          </div>

          <div className="flex justify-start gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-[#369D0C]"
            >
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
