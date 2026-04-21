"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { Ticket as TicketIcon, Filter, X } from "lucide-react";
import StatCard from "@/app/components/StatCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import truncateText from "@/utils/truncateText";
import UserAvatar from "@/app/components/UserAvatar";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import TicketsFiltersPanel, { EMPTY_FILTERS } from "@/app/components/Ticket/TicketsFiltersPanel";

const TicketsTable = ({
    showExportButton = true,
    showDueDateColumn = true,
    enableStatusFiltering = true,
    actionButtons = null,
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
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [showMoreUsers, setShowMoreUsers] = useState(false);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);

    const filterableUsers = users.filter(user => {
        const email = user?.email || '';
        return !email.match(/^system_user_\d+@nativetalk\.com$/i);
    });

    const activeStatusName = allStatuses.find(s => s.id === statusFilterId)?.name || null;

    useEffect(() => {
        fetchDropdownData();
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [currentPage, searchQuery, pageSize, filters, statusFilterId, selectedUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMoreUsers && !event.target.closest('.relative')) {
                setShowMoreUsers(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMoreUsers]);

    const fetchUsers = async () => {
        try {
            const { data } = await axiosInstance.get('/users');
            setUsers(data.results || []);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleAssigneeClick = (userId) => {
        if (selectedUser === userId) {
            setSelectedUser(null);
            setIsFilterActive(false);
        } else {
            setSelectedUser(userId);
            setIsFilterActive(true);
        }
        setCurrentPage(1);
    };

    const clearFilter = () => {
        setSelectedUser(null);
        setIsFilterActive(false);
        setCurrentPage(1);
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

    const applyFilters = (next) => {
        setFilters(next);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters(EMPTY_FILTERS);
        setCurrentPage(1);
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;
        count += filters.statusIds.length;
        count += filters.priorityIds.length;
        count += filters.categoryIds.length;
        count += filters.assigneeIds.length;
        count += filters.followerIds.length;
        if (filters.createdAfter) count += 1;
        if (filters.createdBefore) count += 1;
        if (filters.dueAfter) count += 1;
        if (filters.dueBefore) count += 1;
        return count;
    }, [filters]);

    const removeFilter = (patch) => {
        setFilters((prev) => ({ ...prev, ...patch }));
        setCurrentPage(1);
    };

    const lookupLabel = (list, id) => {
        const item = list.find((i) => i.id === id);
        return item?.label || item?.name || `#${id}`;
    };

    const lookupUserLabel = (id) => {
        const user = users.find((u) => u.id === id);
        if (!user) return `User ${id}`;
        const full = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
        return full || user.email || `User ${id}`;
    };

    const filterChips = useMemo(() => {
        const chips = [];
        filters.statusIds.forEach((id) => chips.push({
            key: `status-${id}`,
            label: `Status: ${lookupLabel(allStatuses, id)}`,
            onRemove: () => removeFilter({ statusIds: filters.statusIds.filter((v) => v !== id) }),
        }));
        filters.priorityIds.forEach((id) => chips.push({
            key: `priority-${id}`,
            label: `Priority: ${lookupLabel(allPriorities, id)}`,
            onRemove: () => removeFilter({ priorityIds: filters.priorityIds.filter((v) => v !== id) }),
        }));
        filters.categoryIds.forEach((id) => chips.push({
            key: `category-${id}`,
            label: `Category: ${lookupLabel(allCategories, id)}`,
            onRemove: () => removeFilter({ categoryIds: filters.categoryIds.filter((v) => v !== id) }),
        }));
        filters.assigneeIds.forEach((id) => chips.push({
            key: `assignee-${id}`,
            label: `Assignee: ${lookupUserLabel(id)}`,
            onRemove: () => removeFilter({ assigneeIds: filters.assigneeIds.filter((v) => v !== id) }),
        }));
        filters.followerIds.forEach((id) => chips.push({
            key: `follower-${id}`,
            label: `Follower: ${lookupUserLabel(id)}`,
            onRemove: () => removeFilter({ followerIds: filters.followerIds.filter((v) => v !== id) }),
        }));
        if (filters.createdAfter) chips.push({
            key: 'created-after',
            label: `Created ≥ ${filters.createdAfter}`,
            onRemove: () => removeFilter({ createdAfter: '' }),
        });
        if (filters.createdBefore) chips.push({
            key: 'created-before',
            label: `Created ≤ ${filters.createdBefore}`,
            onRemove: () => removeFilter({ createdBefore: '' }),
        });
        if (filters.dueAfter) chips.push({
            key: 'due-after',
            label: `Due ≥ ${filters.dueAfter}`,
            onRemove: () => removeFilter({ dueAfter: '' }),
        });
        if (filters.dueBefore) chips.push({
            key: 'due-before',
            label: `Due ≤ ${filters.dueBefore}`,
            onRemove: () => removeFilter({ dueBefore: '' }),
        });
        return chips;
    }, [filters, allStatuses, allPriorities, allCategories, users]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                page_size: pageSize,
                search: searchQuery || undefined,
            };

            const statusIds = new Set(filters.statusIds.map(String));
            if (enableStatusFiltering && statusFilterId) statusIds.add(String(statusFilterId));
            if (statusIds.size) params.status = Array.from(statusIds).join(',');

            const assigneeIds = new Set(filters.assigneeIds.map(String));
            if (selectedUser) assigneeIds.add(String(selectedUser));
            if (assigneeIds.size) params.assignee = Array.from(assigneeIds).join(',');

            if (filters.priorityIds.length) params.priority = filters.priorityIds.join(',');
            if (filters.categoryIds.length) params.category = filters.categoryIds.join(',');
            if (filters.followerIds.length) params.follower = filters.followerIds.join(',');
            if (filters.createdAfter) params.created_after = filters.createdAfter;
            if (filters.createdBefore) params.created_before = filters.createdBefore;
            if (filters.dueAfter) params.due_after = filters.dueAfter;
            if (filters.dueBefore) params.due_before = filters.dueBefore;
            if (filters.sort) params.sort = filters.sort;
            if (filters.order) params.order = filters.order;

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

            {/* Search + Filters Toolbar */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-md">
                    <input
                        className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow dark:text-slate-200"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <div className="absolute top-1 right-1 flex items-center py-1 px-2.5 text-sm pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400">
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* User Avatars */}
                <div className="relative ms-2">
                    <div className="relative flex items-center">
                        {filterableUsers.slice(0, 8).map((assignee, index) => {
                            const tooltipName = `${assignee?.first_name || ''} ${assignee?.last_name || ''}`.trim() || assignee?.email || 'User';
                            return (
                                <div
                                    key={assignee.id}
                                    className={`cursor-pointer rounded-full transition-all duration-300 flex-shrink-0
                                        ${selectedUser === assignee.id ? 'ring-2 dark:ring-white ring-gray-500 z-10' : ''}`}
                                    style={{ marginLeft: index !== 0 ? '-7px' : '0px' }}
                                    onClick={() => handleAssigneeClick(assignee.id)}
                                    onMouseEnter={(e) => e.currentTarget.classList.add('z-10')}
                                    onMouseLeave={(e) => e.currentTarget.classList.remove('z-10')}
                                    data-tooltip-id={`ticket-tooltip-${assignee.id}`}
                                >
                                    {assignee?.image ? (
                                        <Image
                                            alt="profile pic"
                                            className="w-8 h-8 rounded-full border-2 border-white"
                                            src={assignee.image}
                                            width={32}
                                            height={32}
                                        />
                                    ) : (
                                        <UserAvatar
                                            name={assignee?.first_name ? `${assignee.first_name} ${assignee?.last_name || ''}` : assignee?.email || '--'}
                                            width="w-8"
                                            height="h-8"
                                        />
                                    )}
                                    <Tooltip className="mt-1" id={`ticket-tooltip-${assignee.id}`} place="top">
                                        {tooltipName}
                                    </Tooltip>
                                </div>
                            );
                        })}

                        {filterableUsers.length > 8 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMoreUsers(!showMoreUsers)}
                                    className="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                                >
                                    +{filterableUsers.length - 8}
                                </button>
                                {showMoreUsers && (
                                    <div className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                        <div className="p-2">
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                                                More Users ({filterableUsers.length - 8})
                                            </div>
                                            {filterableUsers.slice(8).map((assignee) => {
                                                const tooltipName = `${assignee?.first_name || ''} ${assignee?.last_name || ''}`.trim() || assignee?.email || 'User';
                                                return (
                                                    <div
                                                        key={assignee.id}
                                                        onClick={() => { handleAssigneeClick(assignee.id); setShowMoreUsers(false); }}
                                                        className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition
                                                            ${selectedUser === assignee.id ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                                                    >
                                                        {assignee?.image ? (
                                                            <Image alt="profile pic" className="w-8 h-8 rounded-full" src={assignee.image} width={32} height={32} />
                                                        ) : (
                                                            <UserAvatar name={tooltipName} width="w-8" height="h-8" />
                                                        )}
                                                        <span className="text-sm flex-1 truncate">{tooltipName}</span>
                                                        {selectedUser === assignee.id && <span className="text-green-600 text-xs">✓</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowFiltersPanel(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Filter className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium bg-[#3EBF0F] text-white rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                <div className="flex items-center gap-3 ml-auto">
                    {actionButtons}
                    {isFilterActive && (
                        <button
                            className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-neutral-700 transition whitespace-nowrap"
                            onClick={clearFilter}
                        >
                            Clear Assignee
                        </button>
                    )}
                </div>
            </div>

            {/* Active Filter Chips */}
            {filterChips.length > 0 && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {filterChips.map((chip) => (
                        <span
                            key={chip.key}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full"
                        >
                            {chip.label}
                            <button
                                type="button"
                                onClick={chip.onRemove}
                                className="hover:text-red-500"
                                aria-label={`Remove ${chip.label}`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs text-gray-600 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-white ml-1"
                    >
                        Clear all
                    </button>
                </div>
            )}

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
                                    Assignee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Followers
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
                                    <td colSpan={showDueDateColumn ? "10" : "9"} className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={showDueDateColumn ? "10" : "9"} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {ticket.assignees && ticket.assignees.length > 0 ? (
                                                <div className="flex flex-col gap-0.5">
                                                    {ticket.assignees.map((a) => (
                                                        <span key={a.id} className="text-xs">
                                                            {a.first_name && a.last_name
                                                                ? `${a.first_name} ${a.last_name}`
                                                                : a.email}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {ticket.followers && ticket.followers.length > 0 ? (
                                                <div className="flex flex-col gap-0.5">
                                                    {ticket.followers.map((f, idx) => (
                                                        <span key={f.id || idx} className="text-xs">
                                                            {f.first_name && f.last_name
                                                                ? `${f.first_name} ${f.last_name}`
                                                                : f.email}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
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

            <TicketsFiltersPanel
                show={showFiltersPanel}
                onClose={() => setShowFiltersPanel(false)}
                filters={filters}
                onApply={applyFilters}
                onReset={resetFilters}
                statuses={allStatuses}
                priorities={allPriorities}
                categories={allCategories}
                users={users}
            />
        </div>
    );
};

export default TicketsTable;
