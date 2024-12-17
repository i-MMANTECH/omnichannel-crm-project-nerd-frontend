import React, { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";

function TaskModal({ isOpen, onClose, setIsSuccessModalOpen }) {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [sla, setSla] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);

  const prioritiesEndpoint = 'tasks/priorities/';
  const statusesEndpoint = 'tasks/statuses/';
  const createTaskEndpoint = 'tasks/create/';
  const getAssigneesEndpoint = '/users/';
 
  useEffect(() => {
    if (isOpen) {
      const fetchPriorities = async () => {
        try {
          const response = await axiosInstance.get(prioritiesEndpoint);
          setPriorities(response.data.priorities || []);
        } catch (error) {
          handleApiError(error);
        }
      };

      const fetchStatuses = async () => {
        try {
          const response = await axiosInstance.get(statusesEndpoint);
          setStatuses(response.data.statuses || []);
        } catch (error) {
          handleApiError(error);
        }
      };

      const fetchAssignees = async () => {
        try {
          const response = await axiosInstance.get(getAssigneesEndpoint);
          setUsers(response.data.results || []);
        } catch (error) {
          handleApiError(error);
        }
      };

      fetchPriorities();
      fetchStatuses();
      fetchAssignees();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      assignees: assignees.map(id => parseInt(id, 10)),
      due_date: new Date(dueDate).toISOString(),
      sla,
      priority: parseInt(priority, 10),
      status: parseInt(status, 10),
    };

    try {
      const response = await axiosInstance.post(createTaskEndpoint, taskData);
      
      if (response.status === 201) {
        setTaskTitle("");
        setTaskDescription("");
        setAssignees([]);
        setDueDate("");
        setSla("");
        setPriority("");
        setStatus("");
        onClose();
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const isFormValid = taskTitle && assignees.length > 0;

  if (!isOpen) return null;

  return (
    <div className="mt-16 fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50">
      <div className="bg-gray-100 dark:bg-neutral-900 w-[500px]  rounded-lg shadow-lg">
        <div className="flex mb-3 justify-between items-center self-stretch border-b border-[#DFE1E6] bg-gray-100 dark:bg-neutral-900 px-6 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ width: '20px', height: '20px' }}>
              <path d="M6.25 10.4167L8.75 12.9167L13.75 7.91667M15 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5C17.5 3.61929 16.3807 2.5 15 2.5Z" stroke="#808897" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-lg font-semibold ">
              New Task
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 4H20M20 4V8M20 4L14 10M8 20H4M4 20V16M4 20L10 14" stroke="#808897" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg onClick={onClose} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="#808897" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-7">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-3"
                placeholder="Task Title"
                required
              />
            </div>

            <div className="mb-7">
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full border border-gray-300 bg-gray-100 dark:bg-neutral-900 rounded-lg px-2 py-1 resize-none"
                rows="2"
                placeholder="Task Description"
              ></textarea>
            </div>

            <hr className="mb-8" />
            <p className="mb-3">Select User</p>
            <div className="mb-7 ">
              <select
                multiple
                value={assignees}
                onChange={(e) => setAssignees(Array.from(e.target.selectedOptions, option => option.value))}
                className="flex items-center h-10 px-2 gap-2 border border-gray-300 bg-gray-100 dark:bg-neutral-900 rounded-lg shadow-sm w-full"
                
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id} className="text-[16px] font-medium tracking-[0.2px]">
                    {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-7">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-3"
              />
            </div>

            <div className="mb-7">
              <input
                type="number"
                value={sla}
                onChange={(e) => setSla(e.target.value)}
                placeholder="SLA"
                className="w-full border border-gray-300 rounded-lg px-2 py-3 "
              />
            </div>

            <div className="mb-7">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex items-center h-14 px-2 gap-2 border border-gray-300 bg-gray-100 dark:bg-neutral-900 rounded-lg shadow-sm w-full"
              >
                <option value="" className="text-[16px] font-medium tracking-[0.2px]">Select Priority</option>
                {priorities.map((p) => (
                  <option key={p.id} value={p.id} className="text-[16px] font-medium tracking-[0.2px]">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-7">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex items-center h-14 px-2 gap-2 border border-gray-300 bg-gray-100 dark:bg-neutral-900 rounded-lg shadow-sm w-full"
              >
                <option value="" className=" text-[16px] font-medium tracking-[0.2px]">Status</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id} className=" text-[16px] font-medium tracking-[0.2px]">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
                  disabled={!isFormValid}
                >
                  Create Task
                </button>                
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
