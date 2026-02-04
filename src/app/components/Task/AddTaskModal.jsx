import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Select from "react-select";
import { selectStyles } from "../selectStyles";

const TaskModal = ({ isOpen, onClose, setIsSuccessModalOpen }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [sla, setSla] = useState(null);
  const [priority, setPriority] = useState(null);
  const [status, setStatus] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [slas, setSlas] = useState([]);

  const prioritiesEndpoint = "tasks/priorities/";
  const statusesEndpoint = "tasks/statuses/";
  const createTaskEndpoint = "tasks/create/";
  const getAssigneesEndpoint = "/users/";
  const getSlasEndpoint = "/sla/";

  const getUserLabel = (user) => {
    const first = user.first_name?.trim();
    const last = user.last_name?.trim();
    const fullName = [first, last].filter(Boolean).join(" ");

    if (fullName) {
      return `${fullName} <${user.email}>`;
    }

    return user.email;
  };


  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [prioritiesRes, statusesRes, assigneesRes, slasRes] =
            await Promise.all([
              axiosInstance.get(prioritiesEndpoint),
              axiosInstance.get(statusesEndpoint),
              axiosInstance.get(getAssigneesEndpoint),
              axiosInstance.get(getSlasEndpoint),
            ]);

          setPriorities(prioritiesRes.data.priorities || []);
          setStatuses(statusesRes.data.statuses || []);
          setUsers(
            assigneesRes.data.results.map((user) => ({
              value: user.id,
              label: (() => {
                const first = user.first_name?.trim();
                const last = user.last_name?.trim();
                const fullName = [first, last].filter(Boolean).join(" ");

                return fullName
                  ? `${fullName} <${user.email}>`
                  : user.email;
              })(),
            }))
          );

          setSlas(
            slasRes.data.results.map((sla) => ({
              value: sla.id,
              label: sla.title,
            }))
          );
        } catch (error) {
          handleApiError(error);
        }
      };

      fetchData();
    }
  }, [isOpen]);


  const handlePriorityChange = (selectedOption) => {
    setPriority(selectedOption);
  };

  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption);
  };

  const handleAgentChange = (selectedOptions) => {
    setAssignees(selectedOptions || []);
  };

  const handleSlaChange = (selectedOption) => {
    setSla(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      assignees: assignees.map((agent) => agent.value),
      due_date: dueDate,
      sla_id: sla?.value,
      priority: priority?.value,
      status: status?.value,
    };


    try {
      const response = await axiosInstance.post(createTaskEndpoint, taskData);
      if (response.status === 201) {
        setTaskTitle("");
        setTaskDescription("");
        setAssignees([]);
        setDueDate("");
        setSla("");
        setPriority(null);
        setStatus(null);
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

        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Select
            options={priorities.map((p) => ({
              value: p.id,
              label: p.label,
            }))}
            value={priority}
            onChange={handlePriorityChange}
            styles={selectStyles}
          />
        </div>

        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            options={statuses.map((s) => ({
              value: s.id,
              label: s.label,
            }))}
            value={status}
            onChange={handleStatusChange}
            styles={selectStyles}
          />
        </div>

        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">Select Agents</label>
          <Select
            isMulti
            options={users}
            value={assignees} // Now correctly stores full objects { value, label }
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
          <label className="block text-sm font-medium mb-1">SLA</label>
          <Select
            options={slas}
            value={sla}
            onChange={handleSlaChange}
            styles={selectStyles}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
