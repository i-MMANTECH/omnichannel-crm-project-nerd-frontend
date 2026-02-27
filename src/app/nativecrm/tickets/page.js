"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CreateTicketModal from "@/app/components/Ticket/CreateTicketModal";
import TicketDetailsModal from "@/app/components/Ticket/TicketDetailsModal";
import UpdateTicketModal from "@/app/components/Ticket/UpdateTicketModal";
import TicketsTable from "@/app/components/Ticket/TicketsTable";


const ModalController = ({ children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isCreateModalOpen = searchParams.get('action') === 'new-ticket';
  const isViewModalOpen = searchParams.get('action') === 'view-ticket';
  const isUpdateModalOpen = searchParams.get('action') === 'update-ticket';
  const ticketId = searchParams.get('ticketId');

  const openCreateModal = () => {
    const params = new URLSearchParams(searchParams);
    params.set('action', 'new-ticket');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeCreateModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('action');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const openViewModal = (ticketId) => {
    const params = new URLSearchParams(searchParams);
    params.set('action', 'view-ticket');
    params.set('ticketId', ticketId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeViewModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const params = new URLSearchParams(searchParams);
    params.delete('action');
    params.delete('ticketId');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const openUpdateModal = (ticketId) => {
    const params = new URLSearchParams(searchParams);
    params.set('action', 'update-ticket');
    params.set('ticketId', ticketId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeUpdateModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const params = new URLSearchParams(searchParams);
    params.delete('action');
    params.delete('ticketId');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return children({
    isCreateModalOpen,
    isViewModalOpen,
    isUpdateModalOpen,
    ticketId,
    openCreateModal,
    closeCreateModal,
    openViewModal,
    closeViewModal,
    openUpdateModal,
    closeUpdateModal
  });
};

const TicketsContent = () => {
  const [menuOpen, setMenuOpen] = useState(null);

  return (
    <ModalController>
      {({
        isCreateModalOpen,
        isViewModalOpen,
        isUpdateModalOpen,
        ticketId,
        openCreateModal,
        closeCreateModal,
        openViewModal,
        closeViewModal,
        openUpdateModal,
        closeUpdateModal
      }) => (
        <div className="w-full body-theme pl-10">
          {/* Top Controls */}
          <div className="flex justify-end items-center gap-2 mb-6">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-[#35a50d] flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              New Ticket
            </button>
          </div>

          {/* ✅ Shared Table Component - Agent Configuration */}
          <TicketsTable
            showExportButton={false}
            showDueDateColumn={false}
            enableStatusFiltering={false}
            openViewModal={openViewModal}
            openUpdateModal={openUpdateModal}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />

          {/* Modals */}
          {isCreateModalOpen && (
            <CreateTicketModal
              isOpen={isCreateModalOpen}
              onClose={closeCreateModal}
              onSubmit={() => { }}
            />
          )}

          {isViewModalOpen && ticketId && (
            <TicketDetailsModal
              isOpen={isViewModalOpen}
              onClose={closeViewModal}
              ticketId={ticketId}
              onUpdate={() => { }}
            />
          )}

          {isUpdateModalOpen && ticketId && (
            <UpdateTicketModal
              isOpen={isUpdateModalOpen}
              onClose={closeUpdateModal}
              ticketId={ticketId}
              onUpdate={() => { }}
            />
          )}
        </div>
      )}
    </ModalController>
  );
};

const Tickets = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
      </div>
    }>
      <TicketsContent />
    </Suspense>
  );
};

export default Tickets;