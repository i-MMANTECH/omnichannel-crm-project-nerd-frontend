import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { useTicketStatuses } from '@/hooks/useTicketStatuses';
import StatusAuditPanel from './StatusAuditPanel';

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

const pencilSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M14.166 2.5C14.3849 2.28113 14.6447 2.10752 14.9307 1.98906C15.2167 1.87061 15.5232 1.80965 15.8327 1.80965C16.1422 1.80965 16.4487 1.87061 16.7347 1.98906C17.0207 2.10752 17.2805 2.28113 17.4993 2.5C17.7182 2.71887 17.8918 2.97871 18.0103 3.26469C18.1288 3.55066 18.1897 3.85717 18.1897 4.16667C18.1897 4.47617 18.1288 4.78268 18.0103 5.06865C17.8918 5.35463 17.7182 5.61447 17.4993 5.83333L6.24935 17.0833L1.66602 18.3333L2.91602 13.75L14.166 2.5Z"
      stroke="#E59500"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const trashSvg = (
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
);

// Edit Status modal — two tabs after NOCF-Epic-C:
//
//   Statuses (default)  — the NOCF-Epic-B list of custom (non-global)
//                          statuses with pencil + trash per row.
//   Audit History       — the Epic C panel reading the activity log of
//                          status admin actions.
//
// Globals (Open, New, Assigned, Investigating, In Progress, Resolved,
// Closed) are filtered out client-side on the Statuses tab via `is_global`
// — the PRD is explicit that system defaults can't be edited or deleted
// (only recoloured by moving them around, which the API forbids via the
// 403 on company IS NULL paths). Backend also enforces; the filter here
// is the UX half.
//
// Tab state + audit-panel mount state both reset every time the modal
// closes so the next open starts on the Statuses tab with no stale audit
// state. Within a single modal lifetime, switching from Audit back to
// Statuses preserves the audit panel's filters and loaded rows so the
// admin can flip between tabs without re-fetching.
const EditStatusListModal = ({ isOpen, onClose, onEdit, onDelete }) => {
  const { groupedStatuses } = useTicketStatuses();

  const [activeTab, setActiveTab] = useState('statuses');
  // The audit panel mounts lazily on first switch to the Audit tab so
  // simply opening the modal doesn't fire a GET /audit/ in the background.
  // Once mounted, we keep it mounted (hidden when not active) so the
  // admin's filter + page state survives a Statuses round-trip.
  const [hasAuditMounted, setHasAuditMounted] = useState(false);

  // Reset both pieces of tab state whenever the modal closes. Without
  // this, reopening the modal would land the admin back on whatever tab
  // they were last on with the previous audit panel state intact —
  // contradicts the brief's "next open starts fresh" rule.
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('statuses');
      setHasAuditMounted(false);
    }
  }, [isOpen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'audit') setHasAuditMounted(true);
  };

  // Flatten the grouped response, drop globals, preserve the category-order
  // the backend imposes so the list reads top-to-bottom: To Do → In Progress
  // → Done. Custom statuses inside a category keep the backend's label-sort.
  const customStatuses = (groupedStatuses || [])
    .flatMap((cat) => (cat.statuses || []).map((s) => ({ ...s })))
    .filter((s) => s.is_global === false);

  const tabButtonClasses = (tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-[#3EBF0F] text-[#3EBF0F]'
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<>{documentIcon}Edit Status</>}
      // Widened from Epic B's 440px to give the audit tab enough room for
      // avatar + description + relative time without wrapping. Statuses
      // tab just gets a bit more breathing room.
      width="600px"
      showFooter={false}
    >
      <div role="tablist" className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'statuses'}
          onClick={() => handleTabChange('statuses')}
          className={tabButtonClasses('statuses')}
        >
          Statuses
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'audit'}
          onClick={() => handleTabChange('audit')}
          className={tabButtonClasses('audit')}
        >
          Audit History
        </button>
      </div>

      <div className={activeTab === 'statuses' ? '' : 'hidden'}>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Created Status
        </h3>

        {customStatuses.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
            No custom statuses yet. Use the Custom Status menu item to
            create one.
          </p>
        ) : (
          <ul className="space-y-2">
            {customStatuses.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-md"
              >
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {s.label}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(s)}
                    aria-label={`Edit ${s.label}`}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {pencilSvg}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(s)}
                    aria-label={`Delete ${s.label}`}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {trashSvg}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasAuditMounted && (
        <div className={activeTab === 'audit' ? '' : 'hidden'}>
          <StatusAuditPanel />
        </div>
      )}
    </Modal>
  );
};

export default EditStatusListModal;
