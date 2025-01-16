import React, { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import Modal from "../Modal";

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

  const modalFooter = (
    <button
      type="submit"
      form="taskForm"
      className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md disabled:opacity-50"
      disabled={!isFormValid}
    >
      Create Task
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Task"
      width="500px"
      footer={modalFooter}
    >
      <form id="taskForm" onSubmit={handleSubmit}>
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
        <div className="mb-7">
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
            className="w-full border border-gray-300 rounded-lg px-2 py-3"
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
            <option value="" className="text-[16px] font-medium tracking-[0.2px]">Status</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id} className="text-[16px] font-medium tracking-[0.2px]">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
}

export default TaskModal;