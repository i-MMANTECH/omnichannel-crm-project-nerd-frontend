"use client";

import React, { useState, useEffect } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import CreateTicketModal from "@/app/components/Ticket/CreateTicketModal";
import TicketDetailsModal from "@/app/components/Ticket/TicketDetailsModal";
import { Ticket as TicketIcon } from "lucide-react";
import StatCard from "@/app/components/StatCard";

const Tickets = () => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusCounts, setStatusCounts] = useState({
    not_started: 0,
    in_progress: 0,
    completed: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, searchQuery]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when ready
      // const response = await axiosInstance.get(`/tickets/?page=${currentPage}&search=${searchQuery}`);
      
      // Mock data for now
      const mockTickets = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        ticket_number: `ID234526612`,
        subject: "Competitive Targeting",
        department: "Support",
        service: "Competitive Targeting",
        status: i % 3 === 0 ? "not_started" : i % 3 === 1 ? "in_progress" : "completed",
        priority: i % 2 === 0 ? "high" : "medium",
        date_created: "Oct 23",
        assigned_agent: {
          id: 1,
          first_name: "Marylin",
          last_name: "Bassey",
        },
        customer: {
          id: 1,
          name: "Joseph Olorunmeyan",
        },
      }));

      setTickets(mockTickets);
      
      // Calculate status counts
      const counts = {
        not_started: 18,
        in_progress: 400,
        completed: 10,
      };
      setStatusCounts(counts);
      
      setTotalPages(Math.ceil(mockTickets.length / pageSize));
      setLoading(false);
    } catch (error) {
      handleApiError(error);
      setLoading(false);
    }
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      // TODO: Replace with actual API endpoint when ready
      // await axiosInstance.post('/tickets/', ticketData);
      console.log("Creating ticket:", ticketData);
      setIsCreateModalOpen(false);
      fetchTickets();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const getStatusIcon = (status) => {
    const icons = {
      not_started: (
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
      completed: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2"/>
          <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    };
    return icons[status] || icons.not_started;
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: "bg-red-100 dark:bg-red-900/20",
      in_progress: "bg-blue-100 dark:bg-blue-900/20",
      completed: "bg-green-100 dark:bg-green-900/20",
    };
    return colors[status] || colors.not_started;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-500",
      medium: "text-yellow-500",
      low: "text-green-500",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusLabel = (status) => {
    const labels = {
      not_started: "Not Started",
      in_progress: "In Progress",
      completed: "Completed",
    };
    return labels[status] || status;
  };

  const handleRefreshClick = () => {
  };

  const statsData = [
    {
      title: "Not Started",
      value: 18,
      icon: <TicketIcon className="text-white" size={20} />,
      bgColor: "red",
      borderColor: "black",
    },
    {
      title: "In Progress",
      value: 400,
      icon: <TicketIcon className="text-white" size={20} />,
      bgColor: "#1485fe",
      borderColor: "black",
    },
    {
      title: "Completed",
      value: 10,
      icon: <TicketIcon className="text-white" size={20} />,
      bgColor: "#3EBF0F",
      borderColor: "black",
    }
  ];

  return (
    <div className="h-screen body-theme">
      <div className="p-1">
        <div className="flex mb-7 mt-3 items-center justify-between gap-2 text-sm text-gray-500">
            <div className="flex h-[40px] w-fit p-[8px_12px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                <path d="M5.333 2H4A2 2 0 0 0 2 4v2M5.333 2v-.667M5.333 2h5.334M5.333 2v.667M10.667 2H12A2 2 0 0 1 14 4v2M10.667 2v-.667M10.667 2v.667M2 6v6.667A2 2 0 0 0 4 14.667h8A2 2 0 0 0 14 12.667V6H2Z" stroke="#808897" strokeWidth="1.333" strokeLinecap="round"/>
                </svg>
                <span className="text-[14px] font-medium leading-[150%] tracking-[0.2px]">
                    Last updated: {'Never'}
                </span>
                <svg
                className={`cursor-pointer`}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
            ))}
        </div>

        {/* Search and New Ticket Button */}
        <div className="flex items-center justify-end gap-4 mb-6 mt-6">
            <div className="relative w-full sm:w-auto">
                <input
                    className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Search Users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

            <div className="flex items-center gap-3">
                <button 
                    className=" bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto">
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
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
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
                      onClick={() => handleTicketClick(ticket)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {ticket.ticket_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ticket.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ticket.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-blue-700 dark:text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {getStatusLabel(ticket.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ticket.date_created}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing 1 to 8 of 10 entries
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
              
              {[1, 2, 3, "...", 10].map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-[#3EBF0F] text-white"
                      : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } ${typeof page !== 'number' ? "cursor-default" : ""}`}
                  disabled={typeof page !== 'number'}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="ml-4 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md body-theme"
              >
                <option value={8}>Show 8</option>
                <option value={16}>Show 16</option>
                <option value={24}>Show 24</option>
              </select>
            </div>
          </div>
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
          ticket={selectedTicket}
          onUpdate={fetchTickets}
        />
      )}
    </div>
  );
};

export default Tickets;