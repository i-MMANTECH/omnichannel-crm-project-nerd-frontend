"use client";
import React, { useState, useEffect } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { Ticket as TicketIcon } from "lucide-react";
import StatCard from "@/app/components/StatCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { Download } from "lucide-react";
import truncateText from "@/utils/truncateText";

const TicketsTable = ({
    showExportButton = true,
    showDueDateColumn = true,
    enableStatusFiltering = true,
    openViewModal,
    openUpdateModal,
    menuOpen,
    setMenuOpen
}) => {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
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
    const [allStatuses, setAllStatuses] = useState([]);
    const [allPriorities, setAllPriorities] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [statusFilterId, setStatusFilterId] = useState(null);

    const activeStatusName = allStatuses.find(s => s.id === statusFilterId)?.name || null;

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [currentPage, searchQuery, pageSize, statusFilterId]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                page_size: pageSize,
                search: searchQuery || undefined,
            };

            if (enableStatusFiltering && statusFilterId) {
                params.status = statusFilterId;
            }

            const response = await axiosInstance.get('/tickets/list/', { params });

            if (response.data.success) {
                setTickets(response.data.tickets);
                setPagination(response.data.pagination);
                setLastUpdated(new Date());

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
        e.stopPropagation();
        try {
            const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, {
                status_id: parseInt(newStatusId)
            });

            if (response.data.success) {
                setTickets(prevTickets =>
                    prevTickets.map(ticket =>
                        ticket.id === ticketId
                            ? { ...ticket, status: response.data.ticket.status }
                            : ticket
                    )
                );
                fetchTickets();
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handlePriorityChange = async (ticketId, newPriorityId, e) => {
        e.stopPropagation();
        try {
            const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, {
                priority_id: parseInt(newPriorityId)
            });

            if (response.data.success) {
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
        e.stopPropagation();
        try {
            const response = await axiosInstance.patch(`/tickets/${ticketId}/update/`, {
                category_id: parseInt(newCategoryId)
            });

            if (response.data.success) {
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

    const handleStatusCardClick = (statusName) => {
        if (!enableStatusFiltering || !allStatuses.length) return;

        const current = allStatuses.find(s => s.id === statusFilterId);
        if (current && current.name === statusName) {
            setStatusFilterId(null);
            setCurrentPage(1);
            return;
        }

        const match = allStatuses.find(s => s.name === statusName);
        if (!match) return;

        setStatusFilterId(match.id);
        setCurrentPage(1);
    };

    const statsData = [
        {
            key: "open",
            title: "Open",
            value: statusCounts.open,
            icon: <TicketIcon className="text-white" size={20} />,
            bgColor: "red",
            borderColor: "black",
        },
        {
            key: "in_progress",
            title: "In Progress",
            value: statusCounts.in_progress,
            icon: <TicketIcon className="text-white" size={20} />,
            bgColor: "#1485fe",
            borderColor: "black",
        },
        {
            key: "resolved",
            title: "Resolved",
            value: statusCounts.resolved,
            icon: <TicketIcon className="text-white" size={20} />,
            bgColor: "#10B981",
            borderColor: "black",
        },
        {
            key: "closed",
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
        <div className="w-full">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                {statsData.map((stat) => (
                    <div
                        key={stat.key}
                        onClick={() => handleStatusCardClick(stat.key)}
                        className={`rounded-xl ${enableStatusFiltering ? 'cursor-pointer' : ''} transition 
              ${enableStatusFiltering && activeStatusName === stat.key ? "ring-2 ring-[#3EBF0F]" : ""}`}
                    >
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-end gap-4 mb-6">
                <div className="relative w-full sm:w-auto">
                    <input
                        className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow dark:text-slate-200"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
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
                                    <td colSpan={showDueDateColumn ? "9" : "8"} className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={showDueDateColumn ? "9" : "8"} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No tickets found
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                        onClick={() => openViewModal(ticket.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3EBF0F]">
                                            {ticket.ticket_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {ticket?.contact?.name || ticket?.customer_name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                                            {truncateText(ticket.subject)}
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
                                                className={`px-2 py-1 text-sm rounded font-medium cursor-pointer ${ticket.status?.name === "open"
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
                                                className={`px-2 py-1 text-sm rounded font-medium cursor-pointer ${ticket.priority?.name === "low"
                                                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                    : ticket.priority?.name === "medium"
                                                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-800/30 dark:text-yellow-400"
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
                                        {showDueDateColumn && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(ticket.due_date)}
                                            </td>
                                        )}
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
                                                                    openViewModal(ticket.id);
                                                                    setMenuOpen(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openUpdateModal(ticket.id);
                                                                    setMenuOpen(null);
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
                                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

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
                                        className={`px-3 py-1 rounded-md ${currentPage === pageNum
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
                                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    );
};

export default TicketsTable;