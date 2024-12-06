import React, { useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import SuccessModal from "../SuccessModal";

const CreateUserModal = ({ isModalOpen, closeModal }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [formData, setFormData] = useState({
    email: "",
    userRole: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("users/invitations/send/", formData);

      if (response.status === 201) {
        closeModal();
        setIsSuccessModalOpen(true);
    } 
    } catch (error) {
      handleApiError(error);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
};

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="body-theme rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center w-full border-b mb-5 pb-3 border-[#DFE1E6]">
              <p className="font-encode-sans text-lg font-medium leading-[24px] tracking-[0.2px] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-2">
                  <path d="M17.5 9.16667H15.4167M13.3333 9.16667H15.4167M15.4167 9.16667V7.08333M15.4167 9.16667V11.25M6.66667 11.6667H10C12.3012 11.6667 14.1667 13.5321 14.1667 15.8333V16.6667C14.1667 17.1269 13.7936 17.5 13.3333 17.5H3.33333C2.8731 17.5 2.5 17.1269 2.5 16.6667V15.8333C2.5 13.5321 4.36548 11.6667 6.66667 11.6667ZM11.6667 5.83333C11.6667 7.67428 10.1743 9.16667 8.33333 9.16667C6.49238 9.16667 5 7.67428 5 5.83333C5 3.99238 6.49238 2.5 8.33333 2.5C10.1743 2.5 11.6667 3.99238 11.6667 5.83333Z" stroke="#666D80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Invite User
              </p>

              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#808897" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:border-[#3EBF0F] focus:outline-none"
                  placeholder="johndoe@mail.com"
                  required
                />
              </div>

              <div className="mt-3">
                <label >User Role</label>
                <select
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleChange}
                  className="w-full body-theme border border-gray-300 rounded-md p-2 mt-2 focus:outline-none"
                  required
                >
                  <option value="">Choose role</option>
                  <option value="manager">Manager</option>
                  <option value="agent">Agent</option>
                  <option value="team-member">Team Member</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-theme  rounded-md mr-2 border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        title="Success!"
        message="An invitation link has been sent to the user. Please ask them to check their email and follow the link to activate their account."
        buttonText="Okay, thank you"
        onClose={closeSuccessModal}
      />
    </>
  );
};

export default CreateUserModal;
