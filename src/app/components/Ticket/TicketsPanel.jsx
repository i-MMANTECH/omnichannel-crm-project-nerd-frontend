import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import UserAvatar from "../UserAvatar";
import { useRouter } from "next/navigation";
import { getCategoryPillClasses } from "@/hooks/useTicketStatuses";

const TicketsPanel = ({ isOpen, onClose, conversationId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchTickets();
    }
  }, [isOpen, conversationId]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/tickets/conversation/${conversationId}/`,
        { showLoader: false }
      );

      if (res?.data?.success) {
        setTickets(res.data.tickets || []);
      }
    } catch (err) {
      handleApiError(err, "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const priorityName = priority?.name?.toLowerCase() || priority?.label?.toLowerCase();
    switch (priorityName) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Pill colour now derives from status `category` per the new ticket
  // status overhaul PRD. Status names are flexible labels; category drives
  // every system-level visual cue. The shared mapping lives in
  // useTicketStatuses (CATEGORY_PILL_CLASSES) so every consumer agrees.
  //
  // Visible behaviour change vs the previous name-keyed mapping:
  //   Open    was green → now red    (to_do)
  //   Closed  was gray  → now green  (done)
  //   "pending" name special-case is gone (no longer in the model)
  // These align this panel with TicketsTable's pill colours under the new
  // category model.
  const getStatusColor = (status) =>
    getCategoryPillClasses(status?.category);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tickets
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No tickets linked to this conversation
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/admin/tickets/?action=view-ticket&ticketId=${ticket.id}`)}
                >
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      #{ticket.ticket_number || ticket.id}
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FontAwesomeIcon icon={faChevronDown} rotation={270} />
                    </button>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        size="xs"
                      />
                      {ticket.status?.label || ticket.status?.name || "Open"}
                    </span>

                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority?.label || ticket.priority?.name || "Medium"}
                    </span>

                    {/* Date */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(ticket.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsPanel;