"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Pagination from "@/app/components/Pagination/Pagination";
import { useDebounce } from 'use-debounce';
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "@/app/components/UserAvatar";
import { getRoleStyle } from "@/utils/getRoleStyle";
import PlayRecordingDrawer from "./PlayRecordingDrawer";
import useWebSocket from "@/services/useWebsocket";

// Main LiveCalls component
const LiveCalls = () => {
    const { company, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { handleApiError } = useError();
    const { axiosInstance } = useApi();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [liveCalls, setLiveCalls] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCall, setSelectedCall] = useState(null);
    const searchParams = useSearchParams();

    // Create WebSocket URL based on company ID
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
	const wsUrl = company?.id ? `${protocol}://ws-staging.nativetalkcrm.com/ws/call/${company?.id}/` : null;

    // Only call useWebSocket when we have a valid URL
    const handleWebSocketMessage = (data) => {
        console.log('handleWebSocketMessage', data);
        // Validate if the data is relevant and correctly structured
        if (data.caller_id_number && data.date) {
            setLiveCalls(prev => [data, ...prev].slice(0, pageSize));
        }
        // Note: You'll need to import toast or handle notifications differently
        // toast.success(`New ${data.call_status} call from ${data.caller_id_number}`);
        console.log(`New ${data.call_status} call from ${data.caller_id_number}`);
    };

    // Use WebSocket hook conditionally
    const wsRef = useWebSocket(
        wsUrl, 
        handleWebSocketMessage,
        () => console.log('WebSocket opened successfully'),
        () => console.log('WebSocket closed'),
        (error) => console.error('WebSocket error:', error)
    )

    useEffect(() => {
        const interval = setInterval(() => {
            if (wsRef.current) {
                // console.log('WebSocket readyState:', wsRef.current.readyState);
                // 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [wsRef]);

    useEffect(() => {
        getLiveCalls(currentPage, pageSize, debouncedSearchQuery);
    }, [currentPage, pageSize, debouncedSearchQuery]);

    useEffect(() => {
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = parseInt(searchParams.get("page_size") || "10", 10);
    
        setCurrentPage(page);
        setPageSize(pageSize);
    }, [searchParams]);

    const formatDuration = (totalSeconds) => {
        const sec = parseInt(totalSeconds, 10);
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const seconds = sec % 60;
      
        if (hours > 0) {
          return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0'),
          ].join(':');
        }
      
        return [
          minutes.toString().padStart(2, '0'),
          seconds.toString().padStart(2, '0'),
        ].join(':');
    };

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 1);

        const options = {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };
        return date.toLocaleString("en-US", options).replace(',', '');
    };    
    
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 1);
    
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);
    
        if (diffSec < 60) return "Just now";
        if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
        if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    
        const weeks = Math.floor(diffDay / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    };

    const getLiveCalls = async (page = 1, page_size = 10, search = "") => {
        try {
            const { data } = await axiosInstance.get(`/call-center/live-calls?page_size=${page_size}&page=${page}&search=${search}`);
            setLiveCalls(data.results);
            setTotalPages(Math.ceil(data.count / page_size));
        } catch (error) {
            handleApiError(error);
        }
    };

    const getAssignedAgent = (call) => {    
        const agentNumber =
            call.direction === "inbound"
                ? call.callerIdNumber
                : call.destinationNumber;
    
        return agentNumber || "Unassigned";
    };

    const getCustomerInfo = (call) => {
        const contactNumber =
            call.direction === "outbound"
                ? call.destinationNumber
                : call.callerIdNumber;
    
        return contactNumber || "Unknown";
    };    

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="customers-page overflow-x-hidden flex flex-col px-10 min-h-[83vh] h-full !ml-0">
                <div className="relative body-theme flex-1 flex flex-col h-full">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4 sm:flex-nowrap">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="relative w-full sm:w-auto">
                                <input
                                    className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Search number or name"
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
                        </div>
                    </div>

                    <div className="h-full">
                        <div className="overflow-auto">
                            <table className="min-w-full body-theme">
                                <thead className="bg-gray-100 dark:bg-neutral-900">
                                    <tr>
                                        <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                            Customer
                                        </th>
                                        <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                            Time
                                        </th>
                                        <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                            Status
                                        </th>
                                        <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                            Assigned to
                                        </th>
                                        <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                            Duration
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {liveCalls.map((call, index) => (
                                        <tr key={index} onClick={() => {
                                                setSelectedCall(call);
                                                setIsDrawerOpen(true);
                                            }} className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer">
                                            <td className="py-3 px-4 border-b flex items-center space-x-3">
                                                <UserAvatar 
                                                    name={getCustomerInfo(call)} 
                                                    width="w-8" 
                                                    height="h-8" 
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{call.caller_id_number}</span>
                                                    <span className="text-sm text-gray-500">{getCustomerInfo(call)}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {getFormattedDate(call.date)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {getRelativeTime(call.date)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4 border-b">
                                                <span
                                                    className="px-2 py-1 rounded"
                                                    style={getRoleStyle(call.status || call.call_status)}
                                                >
                                                    {call.status || call.call_status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <div className="flex items-center space-x-2">
                                                    <UserAvatar 
                                                        name={getAssignedAgent(call)} 
                                                        width="w-6" 
                                                        height="h-6" 
                                                    />
                                                    <span style={{ color: "inherit", textDecoration: "none" }}>
                                                        {getAssignedAgent(call)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span style={{ color: "inherit", textDecoration: "none" }}>
                                                    {formatDuration(call.duration)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-10">
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={(page) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("page", page);
                                router.push(`${pathname}?${params.toString()}`, { scroll: false });
                            }}
                            onPageSizeChange={(size) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("page_size", size);
                                params.set("page", 1);
                                router.push(`${pathname}?${params.toString()}`, { scroll: false });
                            }}
                            pageSize={pageSize}
                        />
                    </div>
                </div>

                <PlayRecordingDrawer
                    show={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedCall(null);
                    }}
                    cdr={selectedCall}
                />
            </div>
        </Suspense>
    );
};

export default LiveCalls;