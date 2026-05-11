"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import './style.css';
import TaskCompletionChart from './TaskCompletionChart';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import StatsCard from './StatsCard';
import ChatData from './ChatData';
import { useApi } from '@/services/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import { useError } from '@/context/ErrorContext';
import DateFilter from '@/app/components/admin/Reports/DateFilter';

ChartJS.register(ArcElement, Tooltip, Legend);

// Status codes counted toward "Total Pending Tickets". The set covers both
// ticket-style (open / in_progress) and task-style (todo / overdue / pending)
// codes so the metric stays correct regardless of which schema the analytics
// endpoint surfaces under tasks.status_distribution.
const PENDING_STATUS_CODES = new Set(['open', 'in_progress', 'todo', 'overdue', 'pending']);

const INITIAL_SUMMARY = {
    messages: 0,
    customers: 0,
    tasks: 0,
    users: 0,
    tickets: 0,
    leads: 0,
    totalTickets: 0,
    totalTicketsCreated: 0,
    totalPendingTickets: 0,
    newLeads: 0,
};

const toIsoDate = (d) => new Date(d).toISOString().split("T")[0];

const formatDayLabel = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const sumPending = (statusDistribution) => {
    if (!Array.isArray(statusDistribution)) return 0;
    return statusDistribution.reduce(
        (acc, entry) => acc + (PENDING_STATUS_CODES.has(entry?.code) ? (entry.count || 0) : 0),
        0
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('Admin') || user?.roles?.includes('admin');

    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    const [summary, setSummary] = useState(INITIAL_SUMMARY);
    const [isRotating, setIsRotating] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [showDateFilter, setShowDateFilter] = useState(false);

    const filterContainerRef = useRef(null);
    const hasDateRange = !!(dateRange?.startDate && dateRange?.endDate);

    const fetchSummary = useCallback(async () => {
        try {
            // Per the JIRA AC, "Total Tickets" and "Total Pending Tickets"
            // are all-time snapshots that ignore the date filter, while
            // "Total Tickets Created" and "New Leads" are scoped to the
            // active filter. Always fetch the all-time slice; when a filter
            // is active, fetch the scoped slice in parallel.
            const allTimePromise = axiosInstance.get('analytics/summary/');
            const scopedPromise = hasDateRange
                ? axiosInstance.get('analytics/summary/', {
                    params: {
                        start_date: toIsoDate(dateRange.startDate),
                        end_date: toIsoDate(dateRange.endDate),
                    },
                })
                : Promise.resolve(null);

            const [allTimeRes, scopedRes] = await Promise.all([allTimePromise, scopedPromise]);

            const allTime = allTimeRes?.data?.success ? (allTimeRes.data.data || {}) : {};
            const scoped = scopedRes?.data?.success ? (scopedRes.data.data || {}) : null;

            // Prefer scoped totals when a filter is active; fall back to
            // all-time so cards never blank out if the scoped slice is
            // missing a key.
            const pickScoped = (key) => {
                if (scoped && scoped[key]?.total != null) return scoped[key].total;
                return allTime[key]?.total || 0;
            };

            setSummary({
                messages: pickScoped('messages'),
                customers: pickScoped('customers'),
                tasks: pickScoped('tasks'),
                users: pickScoped('users'),
                tickets: pickScoped('tickets'),
                leads: pickScoped('leads'),
                // All-time by spec — not affected by the date filter.
                totalTickets: allTime.tasks?.total || 0,
                totalPendingTickets: sumPending(allTime.tasks?.status_distribution),
                // Scoped by spec — when filter active, use the scoped period
                // total; otherwise fall back to the last-24h count.
                totalTicketsCreated: scoped
                    ? (scoped.tasks?.total || 0)
                    : (allTime.tasks?.last_24_hours?.count || 0),
                newLeads: pickScoped('leads'),
            });

            const updatedDate = new Date();
            setLastUpdated(`Today, ${updatedDate.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true })}`);
        } catch (error) {
            handleApiError(error);
        }
    }, [axiosInstance, dateRange, hasDateRange, handleApiError]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const handleRefreshClick = async () => {
        setIsRotating(true);
        await fetchSummary();
        setIsRotating(false);
    };

    const handleDateChange = (newRange) => {
        const range = Array.isArray(newRange) ? newRange[0] : newRange;
        if (range?.startDate && range?.endDate) {
            setDateRange({ startDate: range.startDate, endDate: range.endDate });
        }
    };

    const clearDateRange = (e) => {
        e.stopPropagation();
        setDateRange(null);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex h-[40px] w-full sm:w-fit p-[8px_12px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5.33333 2.00016H4C2.89543 2.00016 2 2.89559 2 4.00016V6.00016M5.33333 2.00016V1.3335M5.33333 2.00016H10.6667M5.33333 2.00016V2.66683M10.6667 2.00016H12C13.1046 2.00016 14 2.89559 14 4.00016V6.00016M10.6667 2.00016V1.3335M10.6667 2.00016V2.66683M2 6.00016V12.6668C2 13.7714 2.89543 14.6668 4 14.6668H12C13.1046 14.6668 14 13.7714 14 12.6668V6.00016M2 6.00016H14" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round" />
                    </svg>

                    <span className="text-center font-[500] text-[12px] sm:text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px] truncate">
                        Last updated: {lastUpdated || 'Never'}
                    </span>

                    <svg
                        className={`cursor-pointer flex-shrink-0 ${isRotating ? 'rotate' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        onClick={handleRefreshClick}
                    >
                        <path d="M7.99984 2.66683C5.05432 2.66683 2.6665 5.05464 2.6665 8.00016C2.6665 9.97425 3.73903 11.6978 5.33317 12.62M7.99984 2.66683L6.6665 1.3335M7.99984 2.66683L6.99984 4.3335M7.99984 13.3335C10.9454 13.3335 13.3332 10.9457 13.3332 8.00016C13.3332 6.02608 12.2606 4.30249 10.6665 3.38033M7.99984 13.3335L9.33317 14.6668M7.99984 13.3335L8.99984 11.6668" stroke="#3EBF0F" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {isAdmin && (
                    <div ref={filterContainerRef} className="relative">
                        <div
                            onClick={() => setShowDateFilter((prev) => !prev)}
                            className={`hidden sm:flex h-[40px] p-[8px_12px_8px_14px] cursor-pointer justify-center items-center gap-2 rounded-[10px] border shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] transition-colors ${hasDateRange ? 'border-[#3EBF0F] bg-[#3EBF0F]/10' : 'border-[#DFE1E6] bg-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z" stroke={hasDateRange ? '#3EBF0F' : '#808897'} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <span className={`text-center font-[500] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px] ${hasDateRange ? 'text-[#3EBF0F]' : 'text-[#666D80]'}`}>
                                {hasDateRange
                                    ? `${formatDayLabel(dateRange.startDate)} – ${formatDayLabel(dateRange.endDate)}`
                                    : 'Filter by date'}
                            </span>

                            {hasDateRange && (
                                <button
                                    type="button"
                                    onClick={clearDateRange}
                                    aria-label="Clear date filter"
                                    className="ml-1 text-[#3EBF0F] hover:text-[#2a8a09] text-base leading-none"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {showDateFilter && (
                            <DateFilter
                                onDateChange={handleDateChange}
                                onClose={() => setShowDateFilter(false)}
                            />
                        )}
                    </div>
                )}
            </div>

            <StatsCard summary={summary} />
            <br />
            <TaskCompletionChart />
            <ChatData />
        </div>
    );
};

export default Dashboard;
