"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CreateTicketModal from "@/app/components/Ticket/CreateTicketModal";
import TicketDetailsModal from "@/app/components/Ticket/TicketDetailsModal";
import UpdateTicketModal from "@/app/components/Ticket/UpdateTicketModal";
import ExportModal from "@/app/components/ExportModal";
import TicketsTable from "@/app/components/Ticket/TicketsTable";
import { Download } from "lucide-react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

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
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [menuOpen, setMenuOpen] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExport = async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      params.append('start_date', startDate);
      params.append('end_date', endDate);

      const response = await axiosInstance.get(`/tickets/export/?${params.toString()}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tickets_export_${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      handleApiError(err);
      throw err;
    }
  };

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
              onClick={() => setIsExportModalOpen(true)}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
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

          {/* Shared Table Component */}
          <TicketsTable
            showExportButton={true}
            showDueDateColumn={false}
            enableStatusFiltering={true}
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

          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            onExport={handleExport}
            title="Export Tickets"
          />
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