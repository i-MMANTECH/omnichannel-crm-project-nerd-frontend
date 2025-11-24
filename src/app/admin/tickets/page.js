"use client";

import React, { useState, useEffect } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import CreateTicketModal from "@/app/components/Ticket/CreateTicketModal";
import TicketDetailsModal from "@/app/components/Ticket/TicketDetailsModal";
import UpdateTicketModal from "@/app/components/Ticket/UpdateTicketModal";
import { Ticket as TicketIcon } from "lucide-react";
import StatCard from "@/app/components/StatCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

const Tickets = () => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [ticketToUpdate, setTicketToUpdate] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 1,
    current_page: 1,
    next: null,
    previous: null
  });
  const [pageSize, setPageSize] = useState(8);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Dropdowns data
  const [allStatuses, setAllStatuses] = useState([]);
  const [allPriorities, setAllPriorities] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, searchQuery, pageSize]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.get('/tickets/list/', {
        params: {
          page: currentPage,
          page_size: pageSize,
          search: searchQuery || undefined
        }
      });

      if (response.data.success) {
        setTickets(response.data.tickets);
        setPagination(response.data.pagination);
        setLastUpdated(new Date());
        
        // Calculate status counts from API data
        const counts = response.data.tickets.reduce((acc, ticket) => {
          const statusName = ticket.status?.name || 'open';
          acc[statusName] = (acc[statusName] || 0) + 1;
          return acc;
        }, { open: 0, in_progress: 0, resolved: 0, closed: 0 });
        
        setStatusCounts(counts);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [statusesRes, prioritiesRes, categoriesRes] = await Promise.all([
        axiosInstance.get('/tickets/statuses/'),
        axiosInstance.get('/tickets/priorities/'),
        axiosInstance.get('/tickets/categories/')
      ]);

      if (statusesRes.data.success) {
        setAllStatuses(statusesRes.data.statuses);
      }
      if (prioritiesRes.data.success) {
        setAllPriorities(prioritiesRes.data.priorities);
      }
      if (categoriesRes.data.success && categoriesRes.data.categories) {
        setAllCategories(categoriesRes.data.categories);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleStatusChange = async (ticketId, newStatusId, e) => {
    e.stopPropagation(); // Prevent row click
    try {
      const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, {
        status_id: parseInt(newStatusId)
      });

      if (response.data.success) {
        // Update the ticket in the local state
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, status: response.data.ticket.status }
              : ticket
          )
        );
        // Refresh to update counts
        fetchTickets();
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handlePriorityChange = async (ticketId, newPriorityId, e) => {
    e.stopPropagation(); // Prevent row click
    try {
      const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, {
        priority_id: parseInt(newPriorityId)
      });

      if (response.data.success) {
        // Update the ticket in the local state
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, priority: response.data.ticket.priority }
              : ticket
          )
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCategoryChange = async (ticketId, newCategoryId, e) => {
    e.stopPropagation(); // Prevent row click
    try {
      const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, {
        category_id: parseInt(newCategoryId)
      });

      if (response.data.success) {
        // Update the ticket in the local state
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, category: response.data.ticket.category }
              : ticket
          )
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateTicket = async (ticketData) => {
    // CreateTicketModal handles the API call internally
    setIsCreateModalOpen(false);
    fetchTickets(); // Refresh the list
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleUpdateTicket = () => {
    fetchTickets(); // Refresh when ticket is updated
  };

  const handleOpenUpdateModal = (ticket) => {
    setTicketToUpdate(ticket);
    setIsUpdateModalOpen(true);
    setMenuOpen(null);
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#EF4444" strokeWidth="2"/>
        </svg>
      ),
      in_progress: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#3B82F6" strokeWidth="2"/>
          <path d="M12 6v6l4 2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      resolved: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2"/>
          <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      closed: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2"/>
          <path d="M9 12l2 2 4-4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    };
    return icons[status] || icons.open;
  };

  const getStatusColor = (statusName) => {
    const colors = {
      open: "text-red-700 dark:text-red-400",
      in_progress: "text-blue-700 dark:text-blue-400",
      resolved: "text-green-700 dark:text-green-400",
      closed: "text-gray-700 dark:text-gray-400",
    };
    return colors[statusName] || colors.open;
  };

  const getPriorityColor = (priorityName) => {
    const colors = {
      low: "text-green-500",
      medium: "text-yellow-500",
      high: "text-orange-500",
      urgent: "text-red-500",
    };
    return colors[priorityName] || colors.medium;
  };

  const getStatusLabel = (status) => {
    return status?.label || status?.name || 'Open';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleString();
  };

  const handleRefreshClick = () => {
    fetchTickets();
  };

  // Stats data using real counts
  const statsData = [
    {
      title: "Open",
      value: statusCounts.open,
      icon: <TicketIcon className="text-white" size={20} />,
      bgColor: "red",
      borderColor: "black",
    },
    {
      title: "In Progress",
      value: statusCounts.in_progress,
      icon: <TicketIcon className="text-white" size={20} />,
      bgColor: "#1485fe",
      borderColor: "black",
    },
    {
      title: "Resolved",
      value: statusCounts.resolved,
      icon: <TicketIcon className="text-white" size={20} />,
      bgColor: "#10B981",
      borderColor: "black",
    },
    {
      title: "Closed",
      value: statusCounts.closed,
      icon: <TicketIcon className="text-white" size={20} />,
      bgColor: "#6B7280",
      borderColor: "black",
    }
  ];

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, pagination.count);

  return (
    <div className="h-screen body-theme">
      <div className="p-1">
        <div className="flex mb-7 mt-3 items-center justify-between gap-2 text-sm text-gray-500">
            <div className="flex h-[40px] w-fit p-[8px_12px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                <path d="M5.333 2H4A2 2 0 0 0 2 4v2M5.333 2v-.667M5.333 2h5.334M5.333 2v.667M10.667 2H12A2 2 0 0 1 14 4v2M10.667 2v-.667M10.667 2v.667M2 6v6.667A2 2 0 0 0 4 14.667h8A2 2 0 0 0 14 12.667V6H2Z" stroke="#808897" strokeWidth="1.333" strokeLinecap="round"/>
                </svg>
                <span className="text-[14px] font-medium leading-[150%] tracking-[0.2px]">
                    Last updated: {formatLastUpdated(lastUpdated)}
                </span>
                <svg
                className={`cursor-pointer ${loading ? 'animate-spin' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                onClick={handleRefreshClick}
                >
                <path d="M8 2.667A5.333 5.333 0 1 0 13.333 8M8 2.667 6.667 1.333M8 2.667 7 4.333M8 13.333a5.333 5.333 0 1 0-5.333-5.333M8 13.333l1.333 1.334M8 13.333l1-1.667" stroke="#3EBF0F" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-[#35a50d] flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Ticket
            </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
            ))}
        </div>

        {/* Search and Export Button */}
        <div className="flex items-center justify-end gap-4 mb-6 mt-6">
            <div className="relative w-full sm:w-auto">
                <input
                    className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                />
                <button
                    className="absolute top-1 right-1 flex items-center rounded py-1 px-2.5 text-sm text-white transition-all shadow-sm hover:shadow active:bg-gray-400 dark:active:bg-black hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center gap-3 hidden">
                <button 
                    className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto hover:bg-[#35a50d]">
                    Export
                </button>
            </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ticket Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                      </div>
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3EBF0F]">
                        {ticket.ticket_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {ticket.customer_name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <select
                          className="px-2 py-1 text-sm rounded font-medium cursor-pointer bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border-none"
                          value={ticket.category?.id || ''}
                          onChange={(e) => handleCategoryChange(ticket.id, e.target.value, e)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="">No Category</option>
                          {allCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`px-2 py-1 text-sm rounded font-medium cursor-pointer ${
                            ticket.status?.name === "open"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : ticket.status?.name === "in_progress"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : ticket.status?.name === "resolved"
                              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                              : ticket.status?.name === "closed"
                              ? "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400"
                              : "bg-gray-100 text-gray-600"
                          }`}
                          value={ticket.status?.id || ''}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value, e)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {allStatuses.map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`px-2 py-1 text-sm rounded font-medium cursor-pointer ${
                            ticket.priority?.name === "low"
                              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                              : ticket.priority?.name === "medium"
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : ticket.priority?.name === "high"
                              ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                              : ticket.priority?.name === "urgent"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-gray-100 text-gray-600"
                          }`}
                          value={ticket.priority?.id || ''}
                          onChange={(e) => handlePriorityChange(ticket.id, e.target.value, e)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {allPriorities.map((priority) => (
                            <option key={priority.id} value={priority.id}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(ticket.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === ticket.id ? null : ticket.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                          >
                            <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600 dark:text-gray-400" />
                          </button>
                          {menuOpen === ticket.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                              <div className="py-1 flex flex-col">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTicketClick(ticket);
                                    setMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenUpdateModal(ticket);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  Update Ticket
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && tickets.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {startIndex} to {endIndex} of {pagination.count} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Show page numbers dynamically */}
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-[#3EBF0F] text-white"
                          : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {pagination.total_pages > 5 && currentPage < pagination.total_pages - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => setCurrentPage(pagination.total_pages)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {pagination.total_pages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                  disabled={currentPage === pagination.total_pages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-4 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md body-theme"
                >
                  <option value={8}>Show 8</option>
                  <option value={16}>Show 16</option>
                  <option value={24}>Show 24</option>
                  <option value={50}>Show 50</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      )}

      {selectedTicket && (
        <TicketDetailsModal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          ticketId={selectedTicket.id}
          onUpdate={handleUpdateTicket}
        />
      )}

      {isUpdateModalOpen && ticketToUpdate && (
        <UpdateTicketModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setTicketToUpdate(null);
          }}
          ticket={ticketToUpdate}
          onUpdate={handleUpdateTicket}
        />
      )}
    </div>
  );
};

export default Tickets;