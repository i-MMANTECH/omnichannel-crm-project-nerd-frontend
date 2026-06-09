import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Select from 'react-select';
import { selectStyles } from '../selectStyles';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import TextInput from '../TextInput';
import { useTicketStatuses, resolveDisplayStatus, buildGroupedSelectOptions } from '@/hooks/useTicketStatuses';
import StatusGroupHeader from './StatusGroupHeader';

// Stable reference for the "no SLA" option so react-select's value matching
// stays consistent across renders. Labelled "Detach SLA" here (rather than
// "None") because in the edit context it's an active choice, not a default.
const DETACH_SLA_OPTION = { value: null, label: 'Detach SLA' };

const UpdateTicketModal = ({ isOpen, onClose, ticketId, onUpdate }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  // effectiveStatuses (flat) is still needed for resolveDisplayStatus's
  // merged-Resolved fallback under simplification-on. groupedStatuses
  // drives the dropdown's UI shape.
  const { statuses: effectiveStatuses, groupedStatuses } = useTicketStatuses();

  // Editable fields
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [category, setCategory] = useState(null);
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [followers, setFollowers] = useState([]);

  // Dropdown options
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);

  // SLA dropdown state + the id at load time. initialSlaId is the change
  // baseline: handleSave only includes sla_id in the payload when the
  // current selection differs from this value, matching the NBS-194 "absent
  // means no change" contract.
  const [slas, setSlas] = useState([DETACH_SLA_OPTION]);
  const [sla, setSla] = useState(DETACH_SLA_OPTION);
  const [initialSlaId, setInitialSlaId] = useState(null);

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [dueDate, setDueDate] = useState("")
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);


  useEffect(() => {
    if (isOpen && ticketId) {
      initializeTicket();
    }
  }, [isOpen, ticketId]);

  const initializeTicket = async () => {
    try {
      setLoading(true);

      // Statuses come from useTicketStatuses (effective endpoint).
      // Priorities and categories stay inline pending a future
      // centralisation pass — out of scope for NOCF-214.
      // SLAs added in NOCF-220; .catch keeps the modal usable if the SLA
      // endpoint is down or empty — dropdown still renders with "Detach SLA".
      const [ticketRes, prioritiesRes, categoriesRes, agentsRes, slasRes] = await Promise.all([
        axiosInstance.get(`/tickets/${ticketId}/`),
        axiosInstance.get('/tickets/priorities/'),
        axiosInstance.get('/tickets/categories/'),
        axiosInstance.get('/users/'),
        axiosInstance.get('/sla/list/').catch(() => ({ data: { success: false } })),
      ]);

      // Set ticket data
      if (ticketRes.data.success) {
        const ticketData = ticketRes.data.ticket;
        setTicket(ticketData);
        setSubject(ticketData.subject || '');
        setDescription(ticketData.description || '');
        setCustomerName(ticketData.customer_name || '');
        setExistingAttachments(ticketData.attachments || []);
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

      // Build grouped status options from the NBS-195 /grouped/ response
      // (NOCF-222). Each top-level entry is a category group; nested options
      // are the selectable statuses. resolveDisplayStatus still operates on
      // the flat effective list so the merged-Resolved fallback under
      // simplification-on continues to work — when a Closed-backed ticket
      // is opened with simplification on, this finds the merged "Resolved"
      // option (which lives inside the Done group) and selects it.
      const groupedOptions = buildGroupedSelectOptions(groupedStatuses);
      setStatuses(groupedOptions);

      if (ticketRes.data.success && ticketRes.data.ticket.status) {
        const backingStatus = ticketRes.data.ticket.status;
        const displayStatus = resolveDisplayStatus(effectiveStatuses, backingStatus);
        const allOptions = groupedOptions.flatMap((g) => g.options || []);
        const currentStatus = allOptions.find((s) => s.value === displayStatus?.id);
        setStatus(currentStatus || null);
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

      // Map SLAs. "Detach SLA" is always the first option. Pre-select
      // whatever SLA is currently attached to the ticket via the read-side
      // `sla: {id, title}` field from NBS-193 / NOCF-219, or fall back to
      // "Detach SLA" when no SLA is attached. Track the baseline id so
      // handleSave can detect "unchanged" and omit sla_id from the payload.
      const slaList = (slasRes?.data?.success && Array.isArray(slasRes.data.slas))
        ? slasRes.data.slas
        : [];
      const slaOptions = [
        DETACH_SLA_OPTION,
        ...slaList.map((s) => ({ value: s.id, label: s.title })),
      ];
      setSlas(slaOptions);
      const attachedSlaId = ticketRes.data?.ticket?.sla?.id ?? null;
      const currentSlaOption = slaOptions.find((o) => o.value === attachedSlaId) || DETACH_SLA_OPTION;
      setSla(currentSlaOption);
      setInitialSlaId(attachedSlaId);

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
        } else {
          setAssignedAgents([]);
        }

        // Set current followers
        if (ticketRes.data.success && ticketRes.data.ticket.followers && ticketRes.data.ticket.followers.length > 0) {
          const currentFollowers = ticketRes.data.ticket.followers.map(follower =>
            agentOptions.find(a => a.value === follower.id)
          ).filter(Boolean);
          setFollowers(currentFollowers);
        } else {
          setFollowers([]);
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
    if (!priority?.value) {
      alert('Priority is required');
      return;
    }

    const isoDueDate = dueDate
    ? new Date(dueDate).toISOString()
    : null;

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
        assignee_ids: assignedAgents.map(a => a.value),
        followers: (followers || []).map(f => f.value),
        due_date: isoDueDate
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // SLA: only send sla_id when the user actually changed the selection.
      // Empty string == detach (DRF treats empty-string as null for nullable
      // FK fields on multipart). Numeric id == attach/change. Skipping
      // entirely == backend leaves the existing attachment untouched.
      const currentSlaId = sla?.value ?? null;
      if (currentSlaId !== initialSlaId) {
        formData.append('sla_id', currentSlaId == null ? '' : String(currentSlaId));
      }

      selectedImages.forEach((image) => formData.append('images', image));

      const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSelectedImages([]);
        if (onUpdate) onUpdate();
        onClose();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    setSelectedImages((prev) => [...prev, ...imageFiles]);
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
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
                formatGroupLabel={(group) => <StatusGroupHeader group={group} />}
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

            <div>
              <label className="block text-sm font-medium mb-1">
                Followers
              </label>
              <Select
                isMulti
                value={followers}
                onChange={(selectedOptions) => setFollowers(selectedOptions || [])}
                options={agents}
                styles={selectStyles}
                placeholder="Select followers..."
                isDisabled={saving}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Priority
                <span className="text-red-500"> *</span>
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

            {/* SLA */}
            <div>
              <label className="block text-sm font-medium mb-1">
                SLA
              </label>
              <Select
                value={sla}
                onChange={(opt) => setSla(opt || DETACH_SLA_OPTION)}
                options={slas}
                styles={selectStyles}
                isDisabled={saving}
                placeholder="Detach SLA"
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

            <TextInput
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

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

            <div>
              <label className="block text-sm font-medium mb-1">
                Existing Images
              </label>
              {existingAttachments.length === 0 ? (
                <p className="text-sm text-gray-500">No images attached.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {existingAttachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.image_url || attachment.image}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 underline"
                    >
                      Image {attachment.id}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Add Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme"
                disabled={saving}
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
                        onClick={() => removeNewImage(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              disabled={saving || !priority?.value}
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
