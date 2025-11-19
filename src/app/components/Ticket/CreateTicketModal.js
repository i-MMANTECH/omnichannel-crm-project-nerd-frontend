import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Select from "react-select";
import { selectStyles } from "../selectStyles";

const CreateTicketModal = ({ isOpen, onClose, onSubmit, customerId = null, customerName = null }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(null);
  const [category, setCategory] = useState(null);
  const [assignedTo, setAssignedTo] = useState(null);
  const [customer, setCustomer] = useState(null);

  const [agents, setAgents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const categoryOptions = [
    { value: "billing", label: "Billing" },
    { value: "technical", label: "Technical" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
      if (!customerId) {
        fetchCustomers();
      } else {
        // Pre-fill customer if provided
        setCustomer({ value: customerId, label: customerName });
      }
    }
  }, [isOpen, customerId, customerName]);

  const fetchAgents = async () => {
    try {
      setLoadingAgents(true);
      // TODO: Replace with actual API endpoint when ready
      // const response = await axiosInstance.get('/users/');
      
      // Mock data for now
      const mockAgents = [
        { id: 1, first_name: "Marylin", last_name: "Bassey" },
        { id: 2, first_name: "John", last_name: "Doe" },
        { id: 3, first_name: "Jane", last_name: "Smith" },
      ];
      setAgents(
        mockAgents.map((agent) => ({
          value: agent.id,
          label: `${agent.first_name} ${agent.last_name}`,
        }))
      );
      setLoadingAgents(false);
    } catch (error) {
      handleApiError(error);
      setLoadingAgents(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      // TODO: Replace with actual API endpoint when ready
      // const response = await axiosInstance.get('/customers/');
      
      // Mock data for now
      const mockCustomers = [
        { id: 1, name: "Joseph Olorunmeyan" },
        { id: 2, name: "Sarah Williams" },
        { id: 3, name: "Michael Brown" },
      ];
      setCustomers(
        mockCustomers.map((cust) => ({
          value: cust.id,
          label: cust.name,
        }))
      );
      setLoadingCustomers(false);
    } catch (error) {
      handleApiError(error);
      setLoadingCustomers(false);
    }
  };

  const handlePriorityChange = (selectedOption) => {
    setPriority(selectedOption);
  };

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
  };

  const handleAgentChange = (selectedOption) => {
    setAssignedTo(selectedOption);
  };

  const handleCustomerChange = (selectedOption) => {
    setCustomer(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketData = {
      customer_id: customer?.value,
      customer_name: customer?.label,
      subject: subject,
      description: description,
      priority: priority?.value,
      category: category?.value,
      assigned_to: assignedTo?.value,
    };

    try {
      await onSubmit(ticketData);
      
      // Reset form
      setSubject("");
      setDescription("");
      setPriority(null);
      setCategory(null);
      setAssignedTo(null);
      if (!customerId) {
        setCustomer(null);
      }
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const isFormValid = customer && subject;

  const modalFooter = (
    <button
      type="submit"
      form="ticketForm"
      className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md disabled:opacity-50"
      disabled={!isFormValid}
    >
      Create Ticket
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Ticket"
      width="500px"
      footer={modalFooter}
    >
      <form id="ticketForm" onSubmit={handleSubmit}>
        {/* Customer Name */}
        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">
            Customer Name <span className="text-red-500">*</span>
          </label>
          {customerId ? (
            <input
              type="text"
              value={customer?.label || customerName}
              disabled
              className="w-full border border-gray-300 rounded-lg px-2 py-3 bg-gray-100 dark:bg-neutral-900 opacity-75"
            />
          ) : loadingCustomers ? (
            <div className="w-full border border-gray-300 rounded-lg px-2 py-3">
              Loading customers...
            </div>
          ) : (
            <Select
              options={customers}
              value={customer}
              onChange={handleCustomerChange}
              styles={selectStyles}
              placeholder="Select a customer"
              isDisabled={!!customerId}
            />
          )}
        </div>

        {/* Subject */}
        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 py-3"
            placeholder="Brief description of the issue"
            required
          />
        </div>

        {/* Priority */}
        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Select
            options={priorityOptions}
            value={priority}
            onChange={handlePriorityChange}
            styles={selectStyles}
            placeholder="Select priority"
          />
        </div>

        {/* Category */}
        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            options={categoryOptions}
            value={category}
            onChange={handleCategoryChange}
            styles={selectStyles}
            placeholder="Select category"
          />
        </div>

        {/* Assign To */}
        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">Assign To (Optional)</label>
          {loadingAgents ? (
            <div className="w-full border border-gray-300 rounded-lg px-2 py-3">
              Loading agents...
            </div>
          ) : (
            <Select
              options={agents}
              value={assignedTo}
              onChange={handleAgentChange}
              styles={selectStyles}
              placeholder="Select an agent"
            />
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 bg-gray-100 dark:bg-neutral-900 rounded-lg px-2 py-1 resize-none"
            rows="3"
            placeholder="Monthly Product Discussion by Design and Marketing Teams with CEO to Plan our future products sales and reports"
          ></textarea>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTicketModal;