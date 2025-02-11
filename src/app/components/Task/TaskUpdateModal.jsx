import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Select from "react-select";
import { selectStyles } from "../selectStyles";


const TaskUpdateModal = ({ isOpen, onClose, taskId, onUpdate }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(null);
  const [agents, setAgents] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [sla, setSla] = useState("");

  const getAssigneesEndpoint = "/users/";
  const prioritiesEndpoint = "tasks/priorities/";
  const statusesEndpoint = "tasks/statuses/";

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
        console.log("data is ", data);
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
      setDueDate(task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "");
      setSla(task.sla || "");
      setAgents(task.assignees.map((assignee) => assignee.id));
  
      setPriority(
        priorities.find((p) => p.id === task.priority.id) || null
      );
      setStatus(
        statuses.find((s) => s.id === task.status.id) || null
      );
    }
  }, [task, priorities, statuses]);
  

  const priorityOptions = priorities.map((p) => ({
    value: p.id,
    label: p.label,
  }));

  const statusOptions = statuses.map((s) => ({
    value: s.id,
    label: s.label,
  }));

  const agentOptions = users.map((user) => ({
    value: user.id,
    label: user.email,
  }));

  const handlePriorityChange = (selectedOption) => {
    setPriority(selectedOption);
  };

  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption);
  };

  const handleAgentChange = (selectedOptions) => {
    setAgents(selectedOptions.map((option) => option.value));
  };

  const handleUpdate = async () => {
    if (!task) return;
  
    const updatedFields = {};
  
    if (taskTitle !== task.title) updatedFields.title = taskTitle;
    if (description !== task.description) updatedFields.description = description;
    if (priority?.value !== task.priority.id) updatedFields.priority = priority?.value;
    if (status?.value !== task.status.id) updatedFields.status = status?.value;
  
    const formattedDueDate = new Date(dueDate).toISOString().split("T")[0];
    const originalDueDate = new Date(task.due_date).toISOString().split("T")[0];
  
    if (formattedDueDate !== originalDueDate) updatedFields.due_date = dueDate;
    if (sla !== task.sla) updatedFields.sla = sla;
  
    // Fix: Ensure Assignees are included if changed
    const originalAgentIds = task.assignees.map((a) => a.id).sort((a, b) => a - b);
    const selectedAgentIds = agents.map((id) => parseInt(id)).sort((a, b) => a - b);

    console.log(selectedAgentIds)
  
    if (JSON.stringify(originalAgentIds) !== JSON.stringify(selectedAgentIds)) {
      updatedFields.assignees = selectedAgentIds.length > 0 ? selectedAgentIds : [];
    }
  
    // Prevent sending an empty request if no fields were updated
    if (Object.keys(updatedFields).length === 0) {
      onClose();
      return;
    }
  
    try {
      await axiosInstance.post(`tasks/${taskId}/update/`, updatedFields);
      onUpdate(taskId, updatedFields);
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
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Select
            options={priorityOptions}
            value={priority}
            onChange={handlePriorityChange}
            styles={selectStyles}
          />
        </div>

        <p className="mb-3">Select Agents</p>
        <div className="mb-7">
          <Select
            isMulti
            options={agentOptions}
            value={agentOptions.filter((option) => agents.includes(option.value))}
            onChange={handleAgentChange}
            styles={selectStyles}
          />
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
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            options={statusOptions}
            value={status}
            onChange={handleStatusChange}
            styles={selectStyles}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TaskUpdateModal;
