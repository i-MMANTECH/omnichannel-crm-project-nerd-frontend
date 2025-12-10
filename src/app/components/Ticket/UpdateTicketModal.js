import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Select from 'react-select';
import { selectStyles } from '../selectStyles';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';

const UpdateTicketModal = ({ isOpen, onClose, ticketId, onUpdate }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  // Editable fields
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [category, setCategory] = useState(null);
  const [assignedAgents, setAssignedAgents] = useState([]);

  // Dropdown options
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (isOpen && ticketId) {
      initializeTicket();
    }
  }, [isOpen, ticketId]);

  const initializeTicket = async () => {
    try {
      setLoading(true);

      // Fetch ticket data and dropdown data
      const [ticketRes, prioritiesRes, statusesRes, categoriesRes, agentsRes] = await Promise.all([
        axiosInstance.get(`/tickets/${ticketId}/`),
        axiosInstance.get('/tickets/priorities/'),
        axiosInstance.get('/tickets/statuses/'),
        axiosInstance.get('/tickets/categories/'),
        axiosInstance.get('/users/'),
      ]);

      // Set ticket data
      if (ticketRes.data.success) {
        const ticketData = ticketRes.data.ticket;
        setTicket(ticketData);
        setSubject(ticketData.subject || '');
        setDescription(ticketData.description || '');
        setCustomerName(ticketData.customer_name || '');
      }

      // Map priorities
      if (prioritiesRes.data.success) {
        const priorityOptions = prioritiesRes.data.priorities.map(p => ({
          value: p.id,
          label: p.label
        }));
        setPriorities(priorityOptions);
        
        // Set current priority
        if (ticketRes.data.success && ticketRes.data.ticket.priority) {
          const currentPriority = priorityOptions.find(p => p.value === ticketRes.data.ticket.priority.id);
          setPriority(currentPriority);
        }
      }

      // Map statuses
      if (statusesRes.data.success) {
        const statusOptions = statusesRes.data.statuses.map(s => ({
          value: s.id,
          label: s.label
        }));
        setStatuses(statusOptions);
        
        // Set current status
        if (ticketRes.data.success && ticketRes.data.ticket.status) {
          const currentStatus = statusOptions.find(s => s.value === ticketRes.data.ticket.status.id);
          setStatus(currentStatus);
        }
      }

      // Map categories
      if (categoriesRes.data.success && categoriesRes.data.categories) {
        const categoryOptions = categoriesRes.data.categories.map(c => ({
          value: c.id,
          label: c.label
        }));
        setCategories(categoryOptions);
        
        // Set current category
        if (ticketRes.data.success && ticketRes.data.ticket.category) {
          const currentCategory = categoryOptions.find(c => c.value === ticketRes.data.ticket.category.id);
          setCategory(currentCategory);
        }
      }

      // Map agents
      if (agentsRes.data.results) {
        const agentOptions = agentsRes.data.results.map(agent => ({
          value: agent.id,
          label: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || agent.email,
          ...agent
        }));
        setAgents(agentOptions);
        
        // Set current assigned agents
        if (ticketRes.data.success && ticketRes.data.ticket.assignees && ticketRes.data.ticket.assignees.length > 0) {
          const currentAgents = ticketRes.data.ticket.assignees.map(assignee => 
            agentOptions.find(a => a.value === assignee.id)
          ).filter(Boolean);
          setAssignedAgents(currentAgents);
        }
      }
      
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!subject.trim()) {
      alert('Subject cannot be empty');
      return;
    }

    if (!description.trim()) {
      alert('Description cannot be empty');
      return;
    }

    try {
      setSaving(true);

      // Build payload with all fields
      const payload = {
        subject: subject.trim(),
        description: description.trim(),
        customer_name: customerName.trim() || null,
        status_id: status?.value || null,
        priority_id: priority?.value || null,
        category_id: category?.value || null,
        assignee_ids: assignedAgents.map(a => a.value)
      };

      const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, payload);

      if (response.data.success) {
        if (onUpdate) onUpdate();
        onClose();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Ticket ${ticket?.ticket_number || ''}`}
      width="700px"
      showFooter={false}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#3EBF0F]"></div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter ticket subject"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
                disabled={saving}
              />
            </div>

            {/* Customer */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
                disabled={saving}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Status
              </label>
              <Select
                value={status}
                onChange={setStatus}
                options={statuses}
                styles={selectStyles}
                isDisabled={saving}
                placeholder="Select status..."
              />
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Assigned To
              </label>
              <Select
                isMulti
                value={assignedAgents}
                onChange={setAssignedAgents}
                options={agents}
                styles={selectStyles}
                placeholder="Select agents..."
                isDisabled={saving}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Priority
              </label>
              <Select
                value={priority}
                onChange={setPriority}
                options={priorities}
                styles={selectStyles}
                isDisabled={saving}
                placeholder="Select priority..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <Select
                isClearable
                value={category}
                onChange={setCategory}
                options={categories}
                styles={selectStyles}
                placeholder="Select category..."
                isDisabled={saving}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Enter ticket description"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]"
                disabled={saving}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-[#35a50d] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default UpdateTicketModal;