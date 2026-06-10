import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import CustomStatusModal from './CustomStatusModal';
import EditStatusListModal from './EditStatusListModal';
import EditStatusFormModal from './EditStatusFormModal';
import DeleteStatusModal from './DeleteStatusModal';

// Header overflow button (the ⋮ to the right of "+ New Ticket") that owns
// all four status-admin modals + the inter-modal transitions:
//
//     Menu → Custom Status                  → (refetch, close)
//     Menu → Edit Status (list)
//             → pencil → Edit Status Form   → (refetch, close)
//             → trash  → Delete Status      → (refetch, close)
//
// Mounted ONLY on /admin/tickets/page.jsx — the admin/agent split is what
// gates this feature to admin users. /nativecrm/tickets/page.jsx never
// includes this component, so non-admins never see the menu. The backend
// also enforces via permission gating; this is the UX half.
//
// Inter-modal transitions: when the admin clicks pencil or trash in the
// list, the list closes and the per-status modal opens. After the per-
// status modal closes (success or cancel), the list re-opens so the admin
// can chain edits. Pattern keeps the admin in the editing flow without
// having to re-traverse the overflow menu between every row.
const StatusAdminOverflow = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [customStatusOpen, setCustomStatusOpen] = useState(false);
  const [editListOpen, setEditListOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(null);

  const wrapperRef = useRef(null);

  // Close the menu on outside click. Same pattern the row-level overflow
  // menu in TicketsTable uses, kept inline to avoid coupling to any global
  // popover primitive — the codebase doesn't have one in shared use.
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const openCustomStatus = () => {
    setMenuOpen(false);
    setCustomStatusOpen(true);
  };

  const openEditList = () => {
    setMenuOpen(false);
    setEditListOpen(true);
  };

  // From the list, pencil/trash close the list and open the per-status
  // modal. The list re-opens when the per-status modal closes (see the
  // close handlers below) so the admin can chain operations without
  // re-traversing the overflow menu.
  const handleEditStatus = (s) => {
    setEditListOpen(false);
    setEditingStatus(s);
  };

  const handleDeleteStatus = (s) => {
    setEditListOpen(false);
    setDeletingStatus(s);
  };

  const closeEditingStatus = () => {
    setEditingStatus(null);
    setEditListOpen(true);
  };

  const closeDeletingStatus = () => {
    setDeletingStatus(null);
    setEditListOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Status admin menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <FontAwesomeIcon icon={faEllipsisH} />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1 flex flex-col">
            <button
              type="button"
              role="menuitem"
              onClick={openCustomStatus}
              className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Custom Status
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={openEditList}
              className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Edit Status
            </button>
          </div>
        </div>
      )}

      <CustomStatusModal
        isOpen={customStatusOpen}
        onClose={() => setCustomStatusOpen(false)}
      />

      <EditStatusListModal
        isOpen={editListOpen}
        onClose={() => setEditListOpen(false)}
        onEdit={handleEditStatus}
        onDelete={handleDeleteStatus}
      />

      <EditStatusFormModal
        isOpen={!!editingStatus}
        onClose={closeEditingStatus}
        status={editingStatus}
      />

      <DeleteStatusModal
        isOpen={!!deletingStatus}
        onClose={closeDeletingStatus}
        status={deletingStatus}
      />
    </div>
  );
};

export default StatusAdminOverflow;
