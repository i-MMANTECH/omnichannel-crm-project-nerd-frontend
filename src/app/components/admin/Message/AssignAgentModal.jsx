import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import Select from "react-select"; // ✅ Import react-select
import { selectStyles } from "../../selectStyles";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const AssignAgentModal = ({ isOpen, onClose, conversationId, setIsSuccessModalOpen, setSuccessModalMessage}) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [users, setUsers] = useState([]);
  const { handleApiError } = useError();
  const { axiosInstance } = useApi();

  useEffect(() => {
    console.log('conversation id is ', conversationId)
    if (isOpen) {
      fetchAssignees();
    }
  }, [isOpen]);

  const fetchAssignees = async () => {
    try {
      const response = await axiosInstance.get("/users/");
      const formattedUsers = response.data.results.map((user) => ({
        value: user.id,
        label: user.email,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAgentChange = (selectedOption) => {
    setSelectedAgent(selectedOption);
  };

  const handleSubmit = async () => {
    try {
      console.log('selected agent', selectedAgent)
      await axiosInstance.post(`communication/conversations/${conversationId}/assign/`, {
        "agent_id": selectedAgent.value
      });
      setSuccessModalMessage(`Conversation has been successfully assigned to ${selectedAgent.label}.`)
      setIsSuccessModalOpen(true)
      onClose()
    } catch (error) {
      handleApiError(error);
    }
  }

  const footerContent = (
    <>
      <button
        onClick={onClose}
        className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-300"
      >
        Cancel
      </button>
      <button onClick={handleSubmit} className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md">
        Save
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign to Agent"
      showFooter={true}
      footer={footerContent}
      width="500px"
    >
      <div className="modal-body">
        <label htmlFor="agent-select" className="block text-sm font-medium mb-3">
          Select an Agent
        </label>
        <div className="mb-7" id="agent-select">
          <Select
            options={users}
            value={selectedAgent}
            onChange={handleAgentChange}
            styles={selectStyles}
            isClearable
          />
        </div>
      </div>
    </Modal>
  );
};

export default AssignAgentModal;
