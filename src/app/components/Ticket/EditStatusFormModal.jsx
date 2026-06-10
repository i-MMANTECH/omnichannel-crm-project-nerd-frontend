import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Select from 'react-select';
import { selectStyles } from '../selectStyles';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { useTicketStatuses, CATEGORY_DOT_CLASSES } from '@/hooks/useTicketStatuses';
import { toast } from 'react-toastify';

const CATEGORY_OPTIONS = [
  { value: 'to_do', label: 'To Do', colour: 'red' },
  { value: 'in_progress', label: 'In Progress', colour: 'yellow' },
  { value: 'done', label: 'Done', colour: 'green' },
];

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

// Per-status edit modal. Backend warning flow for category changes is the
// only non-trivial bit:
//
//   1st PATCH (no confirm)   -> 200 { warning: true, message } on in-use
//                                 status changing category; show the dialog
//                                 with the backend's message VERBATIM.
//   2nd PATCH (confirm true) -> 200 success on Continue. Backend writes the
//                                 RECATEGORISE_STATUS activity log row.
//
// Pure renames (no category change) commit on the first PATCH and never
// trigger the warning even when the status is in use.
const EditStatusFormModal = ({ isOpen, onClose, status }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const { refetch } = useTicketStatuses();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');

  // The confirmation dialog state. `warningMessage` is the backend's string
  // rendered verbatim per the brief. `pendingPayload` is what we'll re-fire
  // with confirm_recategorise=true when the admin clicks Continue.
  const [warningMessage, setWarningMessage] = useState('');
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    if (isOpen && status) {
      setName(status.label || status.name || '');
      const matchingCategory = CATEGORY_OPTIONS.find((c) => c.value === status.category) || null;
      setCategory(matchingCategory);
      setNameError('');
      setWarningMessage('');
      setPendingPayload(null);
    }
  }, [isOpen, status]);

  const isFormValid = name.trim().length > 0 && category?.value;

  const handleClose = () => {
    setWarningMessage('');
    setPendingPayload(null);
    setSubmitting(false);
    onClose();
  };

  const sendPatch = async (payload) => {
    const response = await axiosInstance.patch(
      `/tickets/statuses/${status.id}/`,
      payload,
    );
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting || !status) return;
    setSubmitting(true);
    setNameError('');
    const trimmed = name.trim();
    const payload = {
      name: trimmed,
      label: trimmed,
      category: category.value,
    };
    try {
      const response = await sendPatch(payload);
      const data = response?.data || {};
      if (data.warning === true) {
        // Backend short-circuited because this is an in-use status whose
        // category is changing. Surface the message and stash the payload
        // so Continue can re-fire it with the confirm flag set.
        setWarningMessage(data.message || 'Changing the category may affect reporting and SLA calculations.');
        setPendingPayload(payload);
        setSubmitting(false);
        return;
      }
      // Either rename-only or category-change on a status with no tickets
      // attached. Backend committed; close + refetch.
      toast.success('Status updated');
      await refetch();
      handleClose();
    } catch (error) {
      const data = error?.response?.data;
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
      setSubmitting(false);
    }
  };

  const handleConfirmRecategorise = async () => {
    if (!pendingPayload) return;
    setSubmitting(true);
    try {
      // Re-fire with the confirm flag set. Backend commits this round.
      await sendPatch({ ...pendingPayload, confirm_recategorise: true });
      toast.success('Status updated');
      await refetch();
      handleClose();
    } catch (error) {
      handleApiError(error);
      setSubmitting(false);
    }
  };

  const handleCancelRecategorise = () => {
    setWarningMessage('');
    setPendingPayload(null);
    setSubmitting(false);
  };

  const footer = (
    <button
      type="submit"
      form="edit-status-form"
      disabled={!isFormValid || submitting}
      className="px-6 py-2 bg-[#3EBF0F] text-white rounded-md hover:bg-[#35a50d] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
    >
      {submitting ? 'Saving...' : 'Save'}
    </button>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={<>{documentIcon}Edit Status</>}
        width="440px"
        footer={footer}
      >
        <form id="edit-status-form" onSubmit={handleSubmit}>
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

      {/* Category-change confirmation dialog. Renders the backend's message
          verbatim per the brief — no client-side templating, no count
          override. Stacks on top of the form modal so the admin can still
          see what they were editing. */}
      <Modal
        isOpen={!!warningMessage}
        onClose={handleCancelRecategorise}
        title="Confirm category change"
        width="440px"
        footer={
          <>
            <button
              type="button"
              onClick={handleCancelRecategorise}
              disabled={submitting}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmRecategorise}
              disabled={submitting}
              className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md hover:bg-[#35a50d] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Saving...' : 'Continue'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-700 dark:text-gray-200">
          {warningMessage}
        </p>
      </Modal>
    </>
  );
};

export default EditStatusFormModal;
