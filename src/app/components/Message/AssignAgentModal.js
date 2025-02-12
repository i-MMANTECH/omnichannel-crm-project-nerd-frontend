import React, { useState } from "react";
import Modal from "../Modal";

const AssignAgentModal = ({ isOpen, onClose }) => {
  const [selectedAgent, setSelectedAgent] = useState("");

  const handleAgentChange = (e) => {
    setSelectedAgent(e.target.value);
  };

  const handleAssignAgent = () => {
    console.log("Agent assigned:", selectedAgent);
    onClose();
  };

  const footerContent = (
    <>
        <button
            onClick={onClose}
            className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30">
            Cancel
        </button>
        <button
            className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md">
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
        <label htmlFor="agent-select" className="block text-sm font-medium ">
          Select an Agent
        </label>
        <select
          id="agent-select"
          value={selectedAgent}
          onChange={handleAgentChange}
          className="mt-2 body-theme block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose an agent</option>
          {/* Add agent options dynamically here */}
        </select>
      </div>
    </Modal>
  );
};

export default AssignAgentModal;
