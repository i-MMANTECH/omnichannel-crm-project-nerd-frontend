import React, { useState, useEffect, useRef } from 'react';
import Modal from '../Modal';
import Select from 'react-select';
import { selectStyles } from '../selectStyles';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { toast } from 'react-toastify';
import TextInput from '../TextInput';

const CreateTicketModal = ({
  isOpen,
  onClose,
  onSubmit,
  customerId = null,
  customerName = null,
  conversationId = null
}) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [customer, setCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerOptions, setCustomerOptions] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [searchingCustomers, setSearchingCustomers] = useState(false);
  const customerInputRef = useRef(null);
  const customerDropdownRef = useRef(null);

  const [priority, setPriority] = useState(null);
  const [status, setStatus] = useState(null);
  const [category, setCategory] = useState(null);
  const [assignedTo, setAssignedTo] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dueDate, setDueDate] = useState("")
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();

      // Pre-fill customer if provided
      if (customerName) {
        setCustomer(customerName);
      }

      // Pre-select customer if customerId is provided
      if (customerId && customerName) {
        setSelectedCustomer({
          id: customerId,
          name: customerName
        });
      }
    }
  }, [isOpen, customerId, customerName]);

  // Handle click outside for customer dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target) &&
        customerInputRef.current &&
        !customerInputRef.current.contains(event.target)
      ) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search customers when user types
  useEffect(() => {
    const searchCustomers = async () => {
      if (customerSearchQuery.length < 2) {
        setCustomerOptions([]);
        return;
      }

      try {
        setSearchingCustomers(true);
        const response = await axiosInstance.get('/customers/', {
          params: { search: customerSearchQuery }
        });

        if (response.data.results) {
          const options = response.data.results.map(cust => ({
            id: cust.id,
            name: `${cust.first_name || ''} ${cust.last_name || ''}`.trim() || cust.username || cust.email,
            email: cust.email,
            phone: cust.phone_number
          }));
          setCustomerOptions(options);
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setSearchingCustomers(false);
      }
    };

    const debounceTimer = setTimeout(searchCustomers, 300);
    return () => clearTimeout(debounceTimer);
  }, [customerSearchQuery]);

  const fetchDropdownData = async () => {
    try {
      setLoading(true);

      // Fetch all dropdown data in parallel
      const [prioritiesRes, statusesRes, categoriesRes, agentsRes] = await Promise.all([
        axiosInstance.get('/tickets/priorities/'),
        axiosInstance.get('/tickets/statuses/'),
        axiosInstance.get('/tickets/categories/'),
        axiosInstance.get('/users/')
      ]);

      // Map priorities
      if (prioritiesRes.data.success) {
        setPriorities(
          prioritiesRes.data.priorities.map(p => ({
            value: p.id,
            label: p.label
          }))
        );
      }

      // Map statuses
      if (statusesRes.data.success) {
        setStatuses(
          statusesRes.data.statuses.map(s => ({
            value: s.id,
            label: s.label
          }))
        );
      }

      // Map categories
      if (categoriesRes.data.success && categoriesRes.data.categories) {
        setCategories(
          categoriesRes.data.categories.map(c => ({
            value: c.id,
            label: c.label
          }))
        );
      }

      // Map agents
      if (agentsRes.data.results) {
        setAgents(
          agentsRes.data.results.map(agent => ({
            value: agent.id,
            label: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || agent.email
          }))
        );
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerInputChange = (e) => {
    const value = e.target.value;
    setCustomer(value);
    setCustomerSearchQuery(value);
    setShowCustomerDropdown(true);
    setSelectedCustomer(null); // Clear selection when typing
  };

  const handleCustomerSelect = (customerOption) => {
    setCustomer(customerOption.name);
    setSelectedCustomer(customerOption);
    setShowCustomerDropdown(false);
    setCustomerSearchQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.warning('Please enter a subject');
      return;
    }
    if (!description.trim()) {
      toast.warning('Please enter a description');
      return;
    }


    if (!priority?.value) {
      toast.warning('Please select a priority');
      return;
    }

    const isoDueDate = dueDate
    ? new Date(dueDate).toISOString()
    : null;

    try {
      setSubmitting(true);
      const payload = {
        subject: subject.trim(),
        description: description.trim(),
        ...(selectedCustomer
          ? { customer_name: selectedCustomer.name }
          : customer.trim()
            ? { customer_name: customer.trim() }
            : {}
        ),
        assignee_ids: assignedTo.length > 0 ? assignedTo.map(a => a.value) : undefined,
        followers: followers.length > 0 ? followers.map(f => f.value) : undefined,
        status_id: status?.value || undefined,
        priority_id: priority?.value || undefined,
        category_id: category?.value || undefined,
        due_date: isoDueDate
      };

      // Remove undefined values
      Object.keys(payload).forEach((key) =>
        payload[key] === undefined && delete payload[key]
      );

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });
      selectedImages.forEach((image) => formData.append('images', image));

      // Use different endpoint based on whether conversationId exists
      const endpoint = conversationId
        ? `/communication/conversations/${conversationId}/ticket/`
        : '/tickets/create/';

      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success('Ticket created successfully');

        // Reset form
        setSubject('');
        setDescription('');
        setCustomer('');
        setSelectedCustomer(null);
        setCustomerSearchQuery('');
        setPriority(null);
        setStatus(null);
        setCategory(null);
        setAssignedTo([]);
        setFollowers([]);
        setSelectedImages([]);

        // Call parent callback
        if (onSubmit) {
          onSubmit(response.data.ticket);
        }

        onClose();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    setSelectedImages((prev) => [...prev, ...imageFiles]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid = subject.trim() && description.trim() && priority?.value;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Ticket"
      width="600px"
      footer={
        <button
          type="submit"
          form="create-ticket-form"
          disabled={!isFormValid || submitting}
          className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-[#35a50d] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Creating...' : 'Create Ticket'}
        </button>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#3EBF0F]"></div>
        </div>
      ) : (
        <form id="create-ticket-form" onSubmit={handleSubmit}>
          {/* Conversation Link Indicator */}
          {conversationId && (
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <div>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Linked to Conversation
                </span>
                <span className="text-sm text-blue-700 dark:text-blue-300 ml-2">
                  ID: {conversationId}
                </span>
              </div>
            </div>
          )}

          {/* Customer Name with Searchable Dropdown */}

          {!conversationId ? (
            <div className="mb-7 relative">
              <label className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                ref={customerInputRef}
                type="text"
                value={customer}
                onChange={handleCustomerInputChange}
                onFocus={() => setShowCustomerDropdown(true)}
                placeholder="Search or enter customer name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
              />

              {/* Dropdown Results */}
              {showCustomerDropdown && customerSearchQuery.length >= 2 && (
                <div
                  ref={customerDropdownRef}
                  className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {searchingCustomers ? (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Searching...
                    </div>
                  ) : customerOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No customers found. You can still enter a name manually.
                    </div>
                  ) : (
                    customerOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => handleCustomerSelect(option)}
                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="font-medium text-sm">{option.name}</div>
                        {option.email && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {option.email}
                          </div>
                        )}
                        {option.phone && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {option.phone}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedCustomer && (
                <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                  ✓ Customer selected: {selectedCustomer.name}
                </div>
              )}
            </div>
          ) : (
            <></>
          )}

          {/* Subject */}
          <div className="mb-7">
            <label className="block text-sm font-medium mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter ticket subject"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
            />
          </div>

          {/* Priority */}
          <div className="mb-7">
            <label className="block text-sm font-medium mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <Select
              value={priority}
              onChange={setPriority}
              options={priorities}
              styles={selectStyles}
              placeholder="Select priority"
              isClearable
            />
          </div>

          {/* Status */}
          <div className="mb-7">
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <Select
              value={status}
              onChange={setStatus}
              options={statuses}
              styles={selectStyles}
              placeholder="Select status"
              isClearable
            />
          </div>

          {/* Category */}
          <div className="mb-7">
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <Select
              value={category}
              onChange={setCategory}
              options={categories}
              styles={selectStyles}
              placeholder="Select category"
              isClearable
            />
          </div>

          {/* Assign To */}
          <div className="mb-7">
            <label className="block text-sm font-medium mb-1">
              Assign To
            </label>
            <Select
              value={assignedTo}
              onChange={setAssignedTo}
              options={agents}
              styles={selectStyles}
              placeholder="Select agents"
              isMulti
              isClearable
            />
          </div>

          <div className="mb-7">
            <label className="block text-sm font-medium mb-1">
              Followers
            </label>
            <Select
              value={followers}
              onChange={setFollowers}
              options={agents}
              styles={selectStyles}
              placeholder="Select followers"
              isMulti
              isClearable
            />
          </div>

          <TextInput
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

          {/* Description */}
          <div className="mb-7">
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter ticket description"
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] resize-none"
            />
          </div>

          <div className="mb-7">
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme"
            />
            {selectedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedImages.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 flex items-center gap-2"
                  >
                    <span className="max-w-[160px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateTicketModal;
