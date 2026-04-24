import React, { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import SuccessModal from "@/app/components/SuccessModal";

const SlaModal = ({ isOpen, onClose, fetchSlaPolicies }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [showSuccess, setShowSuccess] = useState(false);
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users/");
        setUsers(res.data.results);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getUserLabel = (user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    return fullName || user.email || `User #${user.id}`;
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/sla/", formData);
      setShowSuccess(true);
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    fetchSlaPolicies();
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
    <>
      <Modal isOpen={isOpen} onClose={onClose} footer={footer()} title="New SLA">
        <form onSubmit={handleSubmit}>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">SLA Title</h3>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Give your SLA policy a name"
            className="w-full p-3 border rounded-[10px] mb-3 bg-white dark:bg-gray-700 dark:text-white shadow-sm border-[#DFE1E6]"
          />

          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Escalation Matrix</h3>
          <div className="grid grid-cols-2 gap-4 mb-3">
            {[
              { label: "Task not started escalation", hourKey: "not_started_hours", minKey: "not_started_minutes" },
              { label: "Task overdue escalation", hourKey: "overdue_hours", minKey: "overdue_minutes" },
            ].map((item, index) => (
              <div key={index}>
                <p className="text-gray-700 dark:text-gray-300 mb-1">{item.label}</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name={item.hourKey}
                    value={formData[item.hourKey] === 0 ? "" : formData[item.hourKey]}
                    onChange={handleChange}
                    className="w-[90px] h-[42px] p-3 rounded-[10px] border border-[#DFE1E6] bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    placeholder="0 hrs"
                    min="0"
                  />
                  <input
                    type="number"
                    name={item.minKey}
                    value={formData[item.minKey] === 0 ? "" : formData[item.minKey]}
                    onChange={handleChange}
                    className="w-[90px] h-[42px] p-3 rounded-[10px] border border-[#DFE1E6] bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    placeholder="0 mins"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Not Started Staff</h3>
              <select name="not_started_staff_1" value={formData.not_started_staff_1} onChange={handleChange} className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">
                <option value="" className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">Select Level 1 Staff</option>
                {users.map(user => <option key={user.id} value={user.id} className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">{getUserLabel(user)}</option>)}
              </select>
              <select name="not_started_staff_2" value={formData.not_started_staff_2} onChange={handleChange} className="mt-2 w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">
                <option value="" className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">Select Level 2 Staff</option>
                {users.map(user => <option key={user.id} value={user.id} className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">{getUserLabel(user)}</option>)}
              </select>
              <select name="not_started_staff_3" value={formData.not_started_staff_3} onChange={handleChange} className="mt-2 w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">
                <option value="" className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">Select Level 3 Staff</option>
                {users.map(user => <option key={user.id} value={user.id} className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">{getUserLabel(user)}</option>)}
              </select>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Overdue Staff</h3>
              <select name="overdue_staff_1" value={formData.overdue_staff_1} onChange={handleChange} className="w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">
                <option value="" className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">Select Level 1 Staff</option>
                {users.map(user => <option key={user.id} value={user.id} className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">{getUserLabel(user)}</option>)}
              </select>
              <select name="overdue_staff_2" value={formData.overdue_staff_2} onChange={handleChange} className="mt-2 w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">
                <option value="" className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">Select Level 2 Staff</option>
                {users.map(user => <option key={user.id} value={user.id} className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">{getUserLabel(user)}</option>)}
              </select>
              <select name="overdue_staff_3" value={formData.overdue_staff_3} onChange={handleChange} className="mt-2 w-full p-3 rounded-[10px] border border-[#DFE1E6] bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">
                <option value="" className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">Select Level 3 Staff</option>
                {users.map(user => <option key={user.id} value={user.id} className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">{getUserLabel(user)}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
      <SuccessModal 
          isOpen={showSuccess} 
          title="Success" 
          message="SLA policy created successfully!" 
          buttonText="Okay, thank you." 
          onClose={handleSuccessClose} 
        />
    </>
  );
};

export default SlaModal;
