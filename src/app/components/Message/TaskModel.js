import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import TextInput from "../TextInput";

function TaskModel({ isOpen, onClose, conversationId, setIsSuccessModalOpen, setSuccessModalMessage }) {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: null,
    status: null,
    assignees: [],
    due_date: "",
    sla_id: null,
    tags: [],
  });

  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [slas, setSlas] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const prioritiesEndpoint = "tasks/priorities/";
  const statusesEndpoint = "tasks/statuses/";
  const createTaskEndpoint = `communication/conversations/${conversationId}/task/`;
  const getAssigneesEndpoint = "/users/";
  const getSlasEndpoint = "/sla/";

  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#ccc",
      borderRadius: "6px",
      minHeight: "38px",
      backgroundColor: darkMode ? "#1f2937" : "#fff",
      color: darkMode ? "#fff" : "#000",
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? "#fff" : "#000",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? "#1f2937" : "#fff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? darkMode
          ? "#374151"
          : "#eee"
        : darkMode
        ? "#1f2937"
        : "#fff",
      color: darkMode ? "#fff" : "#000",
    }),
  };

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [prioritiesRes, statusesRes, assigneesRes, slasRes] = await Promise.all([
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
              label: user.email,
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
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen) {
      const fetchTags = async () => {
        try {
          const tagsRes = await axiosInstance.get("/tags/");
          setTags(
            tagsRes.data.tags.map((tag) => ({
              value: tag.id,
              label: tag.name,
            }))
          );
        } catch (error) {
          handleApiError(error)
        }
      };
  
      fetchTags();
    }
  }, [isOpen]);
  

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (submitting) return;
    setSubmitting(true);
  
    const isoDueDate = formData.due_date
      ? new Date(formData.due_date).toISOString()
      : null;
  
    const taskPayload = {
      title: formData.title,
      description: formData.description,
      assignees: formData.assignees.map((user) => user.value),
      status: formData.status.value,
      priority: formData.priority.value,
      due_date: isoDueDate,
      tags: formData.tags.map((tag) => tag.label),
      sla_id: formData.sla_id?.value,
    };
  
    try {
      const response = await axiosInstance.post(createTaskEndpoint, taskPayload);
      if (response.status === 201) {
        setFormData({
          title: "",
          description: "",
          priority: null,
          status: null,
          assignees: [],
          due_date: "",
          sla_id: null,
          tags: [],
        });
        setSuccessModalMessage('Task created successfully.');
        setIsSuccessModalOpen(true);
        onClose();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCreateTag = (inputValue) => {
    const newTag = { value: inputValue, label: inputValue };
    setTags((prev) => [...prev, newTag]);
    handleChange("tags", [...formData.tags, newTag]);
  };

  const isFormValid =
    formData.title.trim() &&
    formData.priority &&
    formData.status;

  const modalFooter = (
    <button
      type="submit"
      form="taskForm"
      className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md disabled:opacity-50"
      disabled={!isFormValid || submitting}
    >
      {submitting ? "Creating..." : "Create Task"}
    </button>
  );    


  return (
    <>
      {isLoading ? (
         <div className="flex items-center justify-center">
         <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-gray-400"></div>
       </div>
      ) : (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="New Task"
          width="500px"
          footer={modalFooter}
        >
          <form className="body-theme space-y-4" id="taskForm" onSubmit={handleSubmit}>
            <TextInput
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Task Title"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:text-white"
                rows="3"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Task description..."
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Select
                options={priorities.map((p) => ({
                  value: p.id,
                  label: p.label,
                }))}
                value={formData.priority}
                onChange={(value) => handleChange("priority", value)}
                styles={selectStyles}
                placeholder="Select priority"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                options={statuses.map((s) => ({
                  value: s.id,
                  label: s.label,
                }))}
                value={formData.status}
                onChange={(value) => handleChange("status", value)}
                styles={selectStyles}
                placeholder="Select status"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Assignees</label>
              <Select
                isMulti
                options={users}
                value={formData.assignees}
                onChange={(value) => handleChange("assignees", value)}
                styles={selectStyles}
                placeholder="Select assignees"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">SLA</label>
              <Select
                options={slas}
                value={formData.sla_id}
                onChange={(value) => handleChange("sla_id", value)}
                styles={selectStyles}
                placeholder="Select SLA"
              />
            </div>
  
            <div>
              <label className="text-sm">Tags</label>
              <CreatableSelect
                isMulti
                options={tags}
                value={formData.tags}
                onChange={(value) => handleChange("tags", value)}
                onCreateOption={handleCreateTag}
                styles={selectStyles}
                placeholder="Select or create tags"
              />
            </div>
  
            <TextInput
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleChange("due_date", e.target.value)}
            />
          </form>
        </Modal>
      )}
    </>
  );  
}

export default TaskModel;
