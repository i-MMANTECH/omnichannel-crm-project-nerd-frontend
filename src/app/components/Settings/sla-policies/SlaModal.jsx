import React from "react";
import Modal from "../../Modal";

const SlaModal = ({ isOpen, onClose }) => {
  function footer() {
    return (
      <div className="flex justify-between w-full">
        <button
          className="flex w-[110px] h-[44px] px-3 py-2 justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme"
          onClick={onClose}
        >
          Cancel
        </button>

        <button className="flex w-[110px] h-[44px] px-3 py-2 justify-center items-center gap-2 rounded-[10px] bg-[#3EBF0F] shadow-sm text-white">
          Create SLA
        </button>
      </div>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New SLA" footer={footer()}>
      <h3 className="font-medium text-gray-900 dark:text-white mb-2">SLA Title</h3>
      <input
        type="text"
        placeholder="Give your SLA policy a name"
        className="w-full p-3 border rounded-[10px] mb-3 bg-white dark:bg-gray-700 dark:text-white shadow-sm border-[#DFE1E6]"
      />

      <h3 className="font-medium text-gray-900 dark:text-white mb-2">CRITERIA</h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <select className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white">
          <option>Select tags</option>
        </select>
        <select className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white">
          <option>Select department</option>
        </select>
      </div>

      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Escalation Matrix</h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
        {[
          { label: "Tasked not started escalation" },
          { label: "Tasked overdue escalation" },
        ].map((item, index) => (
          <div key={index}>
            <p className="text-gray-700 dark:text-gray-300 mb-1">{item.label}</p>
            <div className="flex gap-2">
              <input
                type="number"
                className="w-[90px] h-[42px] p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white"
                placeholder="0 hrs"
                min="0"
              />
              <input
                type="number"
                className="w-[90px] h-[42px] p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white"
                placeholder="0 mins"
                min="0"
                max="59"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Staff Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[1, 2, 3].map((level) => (
          <React.Fragment key={level}>
            <select className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white">
              <option>{`Select Level ${level} Staff`}</option>
            </select>
            <select className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white">
              <option>{`Select Level ${level} Staff`}</option>
            </select>
          </React.Fragment>
        ))}
      </div>
    </Modal>
  );
};

export default SlaModal;
