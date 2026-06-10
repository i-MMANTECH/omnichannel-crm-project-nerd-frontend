import React, { useState } from 'react';
import Modal from '../Modal';
import Select from 'react-select';
import { selectStyles } from '../selectStyles';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { useTicketStatuses, CATEGORY_DOT_CLASSES } from '@/hooks/useTicketStatuses';
import { toast } from 'react-toastify';

// Three system-defined category options. Hardcoded by PRD §3.2 — no edits
// allowed, the system enforces exactly these three. Colour strings mirror
// the backend's grouped-endpoint contract (red / yellow / green).
const CATEGORY_OPTIONS = [
  { value: 'to_do', label: 'To Do', colour: 'red' },
  { value: 'in_progress', label: 'In Progress', colour: 'yellow' },
  { value: 'done', label: 'Done', colour: 'green' },
];

// react-select's formatOptionLabel hook. Renders a coloured dot before the
// category label, matching the figma's Category dropdown indicators.
const formatCategoryOption = (option) => {
  const dotClass = CATEGORY_DOT_CLASSES[option.colour] || 'bg-gray-400';
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`inline-block w-2.5 h-2.5 rounded-full ${dotClass}`}
      />
      <span>{option.label}</span>
    </div>
  );
};

const documentIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="mr-2"
    aria-hidden="true"
  >
    <path
      d="M12.5 2.5H5.83333C5.39131 2.5 4.96738 2.67559 4.65482 2.98816C4.34226 3.30072 4.16667 3.72464 4.16667 4.16667V15.8333C4.16667 16.2754 4.34226 16.6993 4.65482 17.0118C4.96738 17.3244 5.39131 17.5 5.83333 17.5H14.1667C14.6087 17.5 15.0326 17.3244 15.3452 17.0118C15.6577 16.6993 15.8333 16.2754 15.8333 15.8333V5.83333L12.5 2.5Z"
      stroke="#666D80"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 2.5V5.83333H15.8333"
      stroke="#666D80"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CustomStatusModal = ({ isOpen, onClose }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const { refetch } = useTicketStatuses();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // Inline error rendered under the Status Name input when the backend
  // rejects the payload as a duplicate. Cleared on next keystroke.
  const [nameError, setNameError] = useState('');

  const isFormValid = name.trim().length > 0 && category?.value;

  const resetState = () => {
    setName('');
    setCategory(null);
    setNameError('');
    setSubmitting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    setNameError('');
    try {
      const trimmed = name.trim();
      const response = await axiosInstance.post('/tickets/statuses/', {
        // Send both name (machine slug) and label (display) so the rendered
        // status preserves whatever casing/spacing the admin typed. Backend
        // falls back to a title-cased label if `label` is omitted, but we
        // don't want spaces normalised to underscores at display time.
        name: trimmed,
        label: trimmed,
        category: category.value,
      });
      if (response.status === 201 || response.data?.success) {
        toast.success('Status created');
        // Bust the module-level cache so the new status appears in every
        // dropdown on the page immediately. The grouped endpoint is what
        // every consumer reads from after NOCF-222.
        await refetch();
        handleClose();
      }
    } catch (error) {
      const data = error?.response?.data;
      // Detect DRF's field-error shape ({name: ["..."]} or {error: {name: ...}})
      // as well as a plain { error: "..." } string with "name" / "unique" /
      // "duplicate" wording. Render inline on duplicate-name; toast everything
      // else through the project's standard handler.
      const fieldErrors = data?.name || data?.error?.name;
      const message =
        (Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors)
        || (typeof data?.error === 'string' ? data.error : null)
        || (typeof data?.message === 'string' ? data.message : null);
      const looksLikeNameCollision =
        !!fieldErrors
        || (typeof message === 'string'
            && /unique|exist|duplicat|already/i.test(message));
      if (looksLikeNameCollision && error?.response?.status === 400) {
        setNameError(message || 'A status with this name already exists.');
      } else {
        handleApiError(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <button
      type="submit"
      form="custom-status-form"
      disabled={!isFormValid || submitting}
      className="px-6 py-2 bg-[#3EBF0F] text-white rounded-md hover:bg-[#35a50d] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
    >
      {submitting ? 'Saving...' : 'Save'}
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={<>{documentIcon}Custom Status</>}
      width="440px"
      footer={footer}
    >
      <form id="custom-status-form" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Status Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="Enter status Name"
            required
            disabled={submitting}
            className={`w-full px-3 py-2 border rounded-md body-theme focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] ${
              nameError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-500" role="alert">
              {nameError}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
            styles={selectStyles}
            placeholder="Category"
            isDisabled={submitting}
            formatOptionLabel={formatCategoryOption}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CustomStatusModal;
