import React, { useEffect, useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import SuccessModal from "../SuccessModal";
import { selectStyles } from "../selectStyles";
import Select from "react-select";
import Modal from "../../Modal";

const CreateUserModal2 = ({ isModalOpen, closeModal }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role_id: "",
  });

  useEffect(() => {
    if (isModalOpen) {
      fetchRoles();
    }
  }, [isModalOpen]);

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get("/users/roles/");
      setRoles(response.data.results || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUserRoleChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      role_id: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("", formData);
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

  const modalFooter = (
    <div className="flex gap-3 w-7/12">
      <button
        type="button"
        onClick={closeModal}
        className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="create-user-form"
        className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
      >
        Save
      </button>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="mr-2"
            >
              <path
                d="M17.5 9.16667H15.4167M13.3333 9.16667H15.4167M15.4167 9.16667V7.08333M15.4167 9.16667V11.25M6.66667 11.6667H10C12.3012 11.6667 14.1667 13.5321 14.1667 15.8333V16.6667C14.1667 17.1269 13.7936 17.5 13.3333 17.5H3.33333C2.8731 17.5 2.5 17.1269 2.5 16.6667V15.8333C2.5 13.5321 4.36548 11.6667 6.66667 11.6667ZM11.6667 5.83333C11.6667 7.67428 10.1743 9.16667 8.33333 9.16667C6.49238 9.16667 5 7.67428 5 5.83333C5 3.99238 6.49238 2.5 8.33333 2.5C10.1743 2.5 11.6667 3.99238 11.6667 5.83333Z"
                stroke="#666D80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Create User
          </>
        }
        footer={modalFooter}
        width="500px"
      >
        <form id="create-user-form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              placeholder="John"
              required
            />
          </div>

          <div className="mb-4">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              placeholder="Doe"
              required
            />
          </div>

          <div className="mb-4">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              placeholder="johndoe"
              required
            />
          </div>

          <div className="mb-4">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              placeholder="johndoe@mail.com"
              required
            />
          </div>

          <div className="mb-4">
            <label>User Role</label>
            <Select
              name="userRole"
              options={roles.map((role) => ({
                value: role.id,
                label: role.name,
              }))}
              classNamePrefix="select"
              onChange={handleUserRoleChange}
              value={
                formData.role_id
                  ? {
                    value: formData.role_id,
                    label: roles.find((role) => role.id === formData.role_id)?.name,
                  }
                  : null
              }
              placeholder="Select Role"
              styles={selectStyles}
              required
            />
          </div>
        </form>
      </Modal>

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

export default CreateUserModal2;
