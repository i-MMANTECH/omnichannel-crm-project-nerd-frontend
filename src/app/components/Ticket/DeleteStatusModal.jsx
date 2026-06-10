import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Select from 'react-select';
import { selectStyles } from '../selectStyles';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { useTicketStatuses } from '@/hooks/useTicketStatuses';
import { toast } from 'react-toastify';

const trashIcon = (
  <span
    aria-hidden="true"
    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 mr-3"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M2.5 5H17.5M8.33333 9.16667V14.1667M11.6667 9.16667V14.1667M3.33333 5L4.16667 15C4.16667 15.442 4.34226 15.866 4.65482 16.1785C4.96738 16.4911 5.39131 16.6667 5.83333 16.6667H14.1667C14.6087 16.6667 15.0326 16.4911 15.3452 16.1785C15.6577 15.866 15.8333 15.442 15.8333 15L16.6667 5M7.5 5V2.5C7.5 2.27899 7.5878 2.06702 7.74408 1.91074C7.90036 1.75446 8.11232 1.66667 8.33333 1.66667H11.6667C11.8877 1.66667 12.0996 1.75446 12.2559 1.91074C12.4122 2.06702 12.5 2.27899 12.5 2.5V5"
        stroke="#E5484D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const successCheck = (
  <span
    aria-hidden="true"
    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

// Three-state delete modal per the figma. State transitions:
//
//   'loading'  -> querying ticket count for this status on open
//   'unused'   -> ticket_count === 0; single-screen confirm + Delete
//   'select'   -> ticket_count > 0; Screen 1, pick replacement, Next
//   'confirm'  -> ticket_count > 0; Screen 2, aspirational "reassigned"
//                  copy + Back + Delete. The DELETE call fires on Delete
//                  ONLY — backend handles reassignment + deletion in one
//                  atomic transaction.
//   'success'  -> success modal post-DELETE, Close button.
//
// Critical contract: backend is hit at most twice over the modal's life —
// once on open (GET /tickets/list/ for the count) and once on the Delete
// button (DELETE /tickets/statuses/<id>/). Closing the modal at any other
// point fires zero side-effect calls. Next is pure FE state transition.
const DeleteStatusModal = ({ isOpen, onClose, status }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const { groupedStatuses, refetch } = useTicketStatuses();

  const [step, setStep] = useState('loading');
  const [ticketCount, setTicketCount] = useState(0);
  const [replacement, setReplacement] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // The label of the replacement status at submit time, captured so the
  // success message can echo it back even after refetch refreshes the
  // grouped data.
  const [reassignedToLabel, setReassignedToLabel] = useState('');

  useEffect(() => {
    if (!isOpen || !status) return;
    let cancelled = false;
    const loadCount = async () => {
      setStep('loading');
      setReplacement(null);
      setReassignedToLabel('');
      try {
        // Count by hitting the list endpoint with page_size=1; total lives
        // on data.pagination.count (same shape TicketsTable already reads).
        const res = await axiosInstance.get('/tickets/list/', {
          params: { status: status.id, page_size: 1 },
        });
        if (cancelled) return;
        const count = res?.data?.pagination?.count ?? 0;
        setTicketCount(count);
        setStep(count === 0 ? 'unused' : 'select');
      } catch (error) {
        if (cancelled) return;
        handleApiError(error);
        // Don't leave the modal in 'loading' — kick it back to the caller.
        onClose();
      }
    };
    loadCount();
    return () => {
      cancelled = true;
    };
    // status is the trigger; intentionally not depending on axios/handlers
    // which change identity per-render without changing behaviour.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, status]);

  // Replacement candidates: same category as the status being deleted,
  // excluding the status itself. Backend's grouped endpoint already filters
  // to (this company custom + globals), so a client-side flat scan suffices.
  const replacementOptions = (() => {
    if (!status) return [];
    const sameCategory = groupedStatuses.find((cat) => cat.key === status.category);
    if (!sameCategory) return [];
    return (sameCategory.statuses || [])
      .filter((s) => s.id !== status.id)
      .map((s) => ({ value: s.id, label: s.label, name: s.name }));
  })();

  const handleClose = () => {
    // Reset every piece of internal state so a re-open lands clean.
    setStep('loading');
    setTicketCount(0);
    setReplacement(null);
    setSubmitting(false);
    setReassignedToLabel('');
    onClose();
  };

  const handleSuccessClose = () => {
    handleClose();
  };

  // Fired by the Delete button on Screen 2 (in-use) or the single Delete
  // button on the unused screen. Always exactly one DELETE call.
  const handleDelete = async () => {
    if (!status || submitting) return;
    setSubmitting(true);
    try {
      const body = step === 'confirm' && replacement
        ? { replacement_status_id: replacement.value }
        : undefined;
      await axiosInstance.delete(
        `/tickets/statuses/${status.id}/`,
        body ? { data: body } : undefined,
      );
      if (step === 'confirm' && replacement) {
        setReassignedToLabel(replacement.label);
      }
      // Refetch immediately so the dropdown and any row that was on the
      // deleted status reflect the change before the admin dismisses the
      // success modal. The success modal stays mounted over the top while
      // the refetch is in flight, so there's no visible mid-state flash.
      setStep('success');
      refetch();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !status) return null;

  // Loading screen — minimal placeholder so the modal frame is visible
  // while the count query is in flight. Avoids a "flash" between open and
  // the real screen.
  if (step === 'loading') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={<span className="text-red-500 font-medium">Delete Status</span>}
        width="440px"
        showFooter={false}
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500" />
        </div>
      </Modal>
    );
  }

  if (step === 'unused') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={<span className="text-red-500 font-medium">Delete Status</span>}
        width="440px"
        footer={
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="px-6 py-2 bg-[#E5484D] text-white rounded-md hover:bg-[#d13c41] disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        }
      >
        <div className="flex items-start mb-4">
          {trashIcon}
          <div>
            <p className="font-semibold text-base">{status.label}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          Are you sure you want to <span className="font-semibold">delete</span> this status?
        </p>
      </Modal>
    );
  }

  if (step === 'select') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={<span className="text-red-500 font-medium">Delete Status</span>}
        width="440px"
        footer={
          <button
            type="button"
            onClick={() => setStep('confirm')}
            disabled={!replacement}
            // Next is PURE FE STATE TRANSITION. No backend call here.
            // See module comment.
            className="px-6 py-2 bg-[#E5484D] text-white rounded-md hover:bg-[#d13c41] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        }
      >
        <div className="flex items-start mb-3">
          {trashIcon}
          <div>
            <p className="font-semibold text-base">{status.label}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200 mb-5">
          This status is currently assigned to{' '}
          <span className="text-red-500 font-medium">
            {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}
          </span>
          . Select a replacement status before continuing.
        </p>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Replace status</label>
          <Select
            value={replacement}
            onChange={setReplacement}
            options={replacementOptions}
            styles={selectStyles}
            placeholder="select replacement"
            isDisabled={submitting}
            noOptionsMessage={() => 'No other statuses in this category. Create one first.'}
          />
        </div>
      </Modal>
    );
  }

  if (step === 'confirm') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={<span className="text-red-500 font-medium">Delete Status</span>}
        width="440px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setStep('select')}
              disabled={submitting}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="px-6 py-2 bg-[#E5484D] text-white rounded-md hover:bg-[#d13c41] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <div className="flex items-start mb-3">
          {trashIcon}
          <div>
            <p className="font-semibold text-base">{status.label}</p>
          </div>
        </div>
        <p className="text-sm text-red-500">
          {/* Aspirational copy per the figma + v2 plan §9.5. The actual
              reassignment happens server-side when Delete fires below —
              this line tells the admin what's ABOUT to happen, not what
              already happened. */}
          {ticketCount} {ticketCount === 1 ? 'ticket has' : 'tickets has'} been reassigned.
          you are good to delete now.
        </p>
      </Modal>
    );
  }

  // step === 'success'
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSuccessClose}
      title=""
      width="400px"
      showBorder={false}
      footer={
        <button
          type="button"
          onClick={handleSuccessClose}
          className="w-full px-6 py-3 bg-[#3EBF0F] text-white rounded-md hover:bg-[#35a50d] transition-colors"
        >
          Close
        </button>
      }
    >
      <div className="text-center py-2">
        {successCheck}
        <h2 className="text-xl font-semibold mb-3">Success!</h2>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          status has been{' '}
          <span className="font-semibold">deleted successfully</span>
          {reassignedToLabel ? (
            <>
              {' and '}
              <span className="text-red-500 font-medium">
                {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}
              </span>
              {' has been assigned to '}
              <span className="font-semibold">{reassignedToLabel}</span>
            </>
          ) : null}
          .
        </p>
      </div>
    </Modal>
  );
};

export default DeleteStatusModal;
