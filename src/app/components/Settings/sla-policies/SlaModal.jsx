import React, { useState } from "react";
import Modal from "../../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const SlaModal = ({ isOpen, onClose }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    not_started_hours: 0,
    not_started_minutes: 0,
    not_started_staff_1: "",
    not_started_staff_2: "",
    not_started_staff_3: "",
    overdue_hours: 0,
    overdue_minutes: 0,
    overdue_staff_1: "",
    overdue_staff_2: "",
    overdue_staff_3: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/sla", formData);
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  function footer() {
    return (
      <div className="flex justify-between w-full">
        <button
          className="flex w-[110px] h-[44px] px-3 py-2 justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="flex w-[110px] h-[44px] px-3 py-2 justify-center items-center gap-2 rounded-[10px] bg-[#3EBF0F] shadow-sm text-white"
          onClick={handleSubmit}
        >
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
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Give your SLA policy a name"
        className="w-full p-3 border rounded-[10px] mb-3 bg-white dark:bg-gray-700 dark:text-white shadow-sm border-[#DFE1E6]"
      />

      <h3 className="font-medium text-gray-900 dark:text-white mb-2">CRITERIA</h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
      <select className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white">
          <option>Select tags</option>
        </select>
        
        <select name="department" value={formData.department} onChange={handleChange} className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white">
          <option value="">Select department</option>
          <option value="Support">Support</option>
          <option value="IT">IT</option>
        </select>
      </div>

      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Escalation Matrix</h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
        {[
          { label: "Tasked not started escalation", hourKey: "not_started_hours", minKey: "not_started_minutes" },
          { label: "Tasked overdue escalation", hourKey: "overdue_hours", minKey: "overdue_minutes" },
        ].map((item, index) => (
          <div key={index}>
            <p className="text-gray-700 dark:text-gray-300 mb-1">{item.label}</p>
            <div className="flex gap-2">
              <input
                type="number"
                name={item.hourKey}
                value={formData[item.hourKey]}
                onChange={handleChange}
                className="w-[90px] h-[42px] p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white"
                placeholder="0 hrs"
                min="0"
              />
              <input
                type="number"
                name={item.minKey}
                value={formData[item.minKey]}
                onChange={handleChange}
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
            <select
              name={`not_started_staff_${level}`}
              value={formData[`not_started_staff_${level}`]}
              onChange={handleChange}
              className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="">{`Select Level ${level} Staff (Not Started)`}</option>
              <option value="1">Staff 1</option>
              <option value="2">Staff 2</option>
              <option value="3">Staff 3</option>
            </select>
            <select
              name={`overdue_staff_${level}`}
              value={formData[`overdue_staff_${level}`]}
              onChange={handleChange}
              className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white shadow-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="">{`Select Level ${level} Staff (Overdue)`}</option>
              <option value="1">Staff 1</option>
              <option value="2">Staff 2</option>
              <option value="3">Staff 3</option>
            </select>
          </React.Fragment>
        ))}
      </div>
    </Modal>
  );
};

export default SlaModal;
