import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Select from "react-select";
import { selectStyles } from "../selectStyles";
import UserAvatar from "../UserAvatar";

const TicketDetailsModal = ({ isOpen, onClose, ticket, onUpdate }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [activeTab, setActiveTab] = useState("details");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(ticket);
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);

  const statusOptions = [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  useEffect(() => {
    if (isOpen && ticket) {
      fetchComments();
      setTicketData(ticket);
      
      // Set initial status and priority for react-select
      setStatus(
        statusOptions.find((opt) => opt.value === ticket.status) || null
      );
      setPriority(
        priorityOptions.find((opt) => opt.value === ticket.priority) || null
      );
    }
  }, [isOpen, ticket]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when ready
      // const response = await axiosInstance.get(`/tickets/${ticket.id}/comments/`);
      
      // Mock data for now
      const mockComments = [
        {
          id: 1,
          user: {
            first_name: "Marylin",
            last_name: "Bassey",
            initials: "MB",
            color: "#86efac",
          },
          comment: "Investigating the billing issue. Found duplicate charge on invoice INV-2024-0589.",
          created_at: "10:00AM",
        },
        {
          id: 2,
          user: {
            first_name: "Chizzy",
            last_name: "Dominic",
            initials: "CD",
            color: "#bef264",
          },
          comment: "Investigating the billing issue. Found duplicate charge on invoice INV-2024-0589.",
          created_at: "10:00AM",
        },
      ];
      setComments(mockComments);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // TODO: Replace with actual API endpoint when ready
      // await axiosInstance.post(`/tickets/${ticket.id}/comments/`, { comment: newComment });
      
      console.log("Adding comment:", newComment);
      setNewComment("");
      fetchComments();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleStatusChange = async (selectedOption) => {
    try {
      // TODO: Replace with actual API endpoint when ready
      // await axiosInstance.patch(`/tickets/${ticket.id}/`, { status: selectedOption.value });
      
      console.log("Changing status to:", selectedOption.value);
      setStatus(selectedOption);
      setTicketData((prev) => ({ ...prev, status: selectedOption.value }));
      onUpdate?.();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handlePriorityChange = async (selectedOption) => {
    try {
      // TODO: Replace with actual API endpoint when ready
      // await axiosInstance.patch(`/tickets/${ticket.id}/`, { priority: selectedOption.value });
      
      console.log("Changing priority to:", selectedOption.value);
      setPriority(selectedOption);
      setTicketData((prev) => ({ ...prev, priority: selectedOption.value }));
      onUpdate?.();
    } catch (error) {
      handleApiError(error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-500",
      medium: "text-yellow-500",
      low: "text-green-500",
    };
    return colors[priority] || colors.medium;
  };

  if (!ticket) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`#${ticket.ticket_number}`}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "details"
              ? "border-[#3EBF0F] text-[#3EBF0F]"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "comments"
              ? "border-[#3EBF0F] text-[#3EBF0F]"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Comments ({comments.length})
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "details" ? (
          <div className="space-y-6">
            {/* Status */}
            <div className="mb-7">
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                options={statusOptions}
                value={status}
                onChange={handleStatusChange}
                styles={selectStyles}
              />
            </div>

            {/* Assigned Agent */}
            <div className="mb-7">
              <label className="block text-sm font-medium mb-1">Assigned Agent</label>
              <div className="flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={`${ticketData.assigned_agent?.first_name} ${ticketData.assigned_agent?.last_name}`}
                    className="w-8 h-8 rounded-full"
                    width="w-8"
                    height="h-8"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {ticketData.assigned_agent?.first_name} {ticketData.assigned_agent?.last_name}
                  </span>
                </div>
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  Reassign
                </button>
              </div>
            </div>

            {/* Priority */}
            <div className="mb-7">
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Select
                options={priorityOptions}
                value={priority}
                onChange={handlePriorityChange}
                styles={selectStyles}
              />
            </div>

            {/* Category */}
            <div className="mb-7">
              <label className="block text-sm font-medium mb-1">Category</label>
              <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg body-theme">
                <span className="text-sm text-gray-900 dark:text-white">Billing</span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span>Ticket created • Oct 24, 2:45 PM</span>
              <span>Ticket last updated • Oct 24, 2:45 PM</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Comments List */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No comments yet
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                      style={{ backgroundColor: comment.user.color }}
                    >
                      {comment.user.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.user.first_name} {comment.user.last_name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.created_at}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Comment"
                rows={3}
                className="w-full border border-gray-300 bg-gray-100 dark:bg-neutral-900 rounded-lg px-2 py-1 resize-none mb-3"
              />
              <button
                onClick={handleAddComment}
                className="w-full px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-[#35a50d] flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Comment
              </button>
            </div>

            {/* Timestamps */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span>Ticket created • Oct 24, 2:45 PM</span>
              <span>Ticket last updated • Oct 24, 2:45 PM</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TicketDetailsModal;