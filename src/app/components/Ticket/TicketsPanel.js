import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const TicketsPanel = ({ isOpen, onClose, conversationId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchTickets();
    }
  }, [isOpen, conversationId]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/communication/conversations/${conversationId}/tickets/`,
        { showLoader: false }
      );

      if (res?.data?.success) {
        setTickets(res.data.data || []);
      }
    } catch (err) {
      handleApiError(err, "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "text-blue-600 bg-blue-50";
      case "open":
        return "text-green-600 bg-green-50";
      case "closed":
        return "text-gray-600 bg-gray-100";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(`/admin/tickets/${ticket.id}`, "_blank")}
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
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={
                          ticket.status?.toLowerCase() === "in progress"
                            ? faChevronDown
                            : faChevronDown
                        }
                        size="xs"
                      />
                      {ticket.status || "Open"}
                    </span>

                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority || "Medium"}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ticket.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  {/* Subject/Title if available */}
                  {ticket.subject && (
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                      {ticket.subject}
                    </div>
                  )}
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