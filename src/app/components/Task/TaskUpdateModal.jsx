import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const TaskUpdateModal = ({ isOpen, onClose, taskId, onUpdate }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");
  const [agents, setAgents] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Overdue");
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [sla, setSla] = useState("");
  
  const getAssigneesEndpoint = '/users/';
  const prioritiesEndpoint = 'tasks/priorities/';
  const statusesEndpoint = 'tasks/statuses/';

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

  useEffect(() => {
    if (!isOpen || !taskId) return;

    const fetchTask = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`tasks/${taskId}`);
        setTask(data.task);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, isOpen]);

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority.id || "High");
      setAgents(task.agents || []);
      setDueDate(task.due_date || "");
      setStatus(task.status.id || "Overdue");
      setSla(task.sla || "");
    }
  }, [task]);

  const handleUpdate = async () => {
    const updatedTask = {
      title: taskTitle,
      description: description,
      assignees: agents,
      status: parseInt(status),
      priority: parseInt(priority),
      sla: sla,
      due_date: dueDate
    };

    try {
      await axiosInstance.post(`tasks/${taskId}/update/`, updatedTask);
      onUpdate(taskId, updatedTask);
      onClose();
    } catch (err) {
      handleApiError(err);
    }
  };

  if (!isOpen) return null;

  const footer = (
    <div className="flex gap-3 w-7/12">
      <button
          type="button"
          onClick={onClose}
          className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30"
      >
          Cancel
      </button>
      <button
          type="submit"
          onClick={handleUpdate}
          className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md "
      >
          Save
      </button>
  </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      footer={footer}
      width="600px"
    >
      <form>
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 bg-gray-100 dark:bg-neutral-900 rounded-lg px-2 py-1 resize-none"
            rows="2"
            placeholder="Task Description"
          ></textarea>
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

        <p className="mb-3">Select Agents</p>
        <div className="mb-7">
          <select
            multiple
            value={agents}
            onChange={(e) => setAgents(Array.from(e.target.selectedOptions, option => option.value))}
            className="flex items-center h-10 px-2 gap-2 border border-gray-300 bg-gray-100 dark:bg-neutral-900 rounded-lg shadow-sm w-full"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id} className="text-[16px] font-medium tracking-[0.2px]">
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            className="w-full border rounded-lg p-2 text-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
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
};

export default TaskUpdateModal;
