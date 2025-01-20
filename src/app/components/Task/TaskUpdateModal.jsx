import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const TaskUpdateModal = ({ isOpen, onClose, taskId }) => {
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
  }, [taskId]);


  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority.label || "High");
      setAgents(task.agents || []);
      setDueDate(task.due_date || "");
      setStatus(task.status.label || "Overdue");
    }
  }, [task]);

  const handleUpdate = async () => {
    const updatedTask = { taskTitle, description, priority, agents, dueDate, status };
    try {
      await axiosInstance.put(`tasks/${taskId}`, updatedTask);
      onClose();
    } catch (err) {
      handleApiError(err);
    }
  };

  if (!isOpen) return null;

  const footer = (
    <div className="col-span-2 flex justify-end mt-4">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 body-theme text-black rounded-md mr-2 border border-gray-300"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleUpdate}
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Task Title</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2 text-sm"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="w-full border rounded-lg p-2 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.label}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <select
          className="w-full border rounded-lg p-2 text-sm"
          value={agents[0] || ""}
          onChange={(e) => setAgents([e.target.value])}
        >
          <option value="" disabled>Select an agent</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            className="w-full border rounded-lg p-2 text-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full border rounded-lg p-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status.id} value={status.label}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default TaskUpdateModal;
