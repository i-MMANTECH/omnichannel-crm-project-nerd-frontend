"use client";

import React, { useEffect, useState, Suspense } from "react";
import CreateUserModal from "@/app/components/Users/CreateUserModal";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import table from "/public/assets/table.svg";
import grid from "/public/assets/grid.svg";
import sort from "/public/assets/sort.svg";
import filter from "/public/assets/filter.svg";
import NoDataFound from "@/app/components/NoDataFound";
import empty from "/public/assets/empty.svg";
import Pagination from "@/app/components/Pagination/Pagination";
import { useDebounce } from 'use-debounce';
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "../UserAvatar";
import { getRoleStyle } from "@/utils/getRoleStyle";
import PlayRecordingDrawer from "./PlayRecordingDrawer";
import CallTester from "./CallTester";

// Main CDRs component
const CallDetailRecords = () => {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { handleApiError } = useError();
    const { axiosInstance } = useApi();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [crds, setCdrs] = useState([]);
    const [view, setView] = useState("table");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCDR, setSelectedCDR] = useState(null);
    const searchParams = useSearchParams();


    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
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


    useEffect(() => {
        getCDRs(currentPage, pageSize, debouncedSearchQuery);
    }, [currentPage, pageSize, debouncedSearchQuery]);

    useEffect(() => {
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = parseInt(searchParams.get("page_size") || "10", 10);
    
        setCurrentPage(page);
        setPageSize(pageSize);
    }, [searchParams]);

    const getCDRs = async (page = 1, page_size = 10, search = "") => {
        try {
            const { data } = await axiosInstance.get(`/call-center/cdrs/search?page_size=${page_size}&page=${page}&search=${search}`);
            setCdrs(data.results);
            setTotalPages(Math.ceil(data.count / page_size));
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
                <div className="customers-page overflow-x-hidden flex flex-col px-10 min-h-[83vh] h-full !ml-0">
                    {/* <CallTester /> */}
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
                                </div>
                            </div>

                            {/* Search CDR */}
                            <div className="hidden flex flex-wrap items-center gap-4 w-full sm:w-auto sm:flex-nowrap">
                                <button 
                                    className=" bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto">
                                    Export
                                </button>
                                <div className="flex h-[40px] p-[8px_12px_8px_14px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] bg-white shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    
                                    <span className=" text-[#666D80] text-center font-[500] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
                                        Filter
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-full">
                            <div >
                                <div className="overflow-auto ">
                                    <table className="min-w-full body-theme ">
                                        <thead className="bg-gray-100 dark:bg-neutral-900">
                                            <tr>
                                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                                    Agent
                                                </th>
                                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                                    Call Status
                                                </th>
                                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                                    Direction
                                                </th>
                                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                                    Hangup Cause
                                                </th>
                                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                                    Number/Contact
                                                </th>
                                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                                    Time
                                                </th>
                                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                                    Duration
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {crds.map((cdr, index) => (
                                                <tr key={index} onClick={() => {
                                                        setSelectedCDR(cdr);
                                                        setIsDrawerOpen(true);
                                                    }} className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer">
                                                    <td className="py-3 px-4 border-b flex items-center space-x-3">
                                                        <UserAvatar 
                                                        name={
                                                            cdr.direction === "outbound"
                                                                ? cdr.caller_id_number
                                                                : cdr.destination_number || "--"
                                                        } 
                                                        width="w-8" 
                                                        height="h-8" 
                                                        />
                                                        <span style={{ color: "inherit", textDecoration: "none" }}>
                                                            {cdr.direction === "outbound"
                                                            ? cdr.caller_id_number
                                                            : cdr.destination_number || "--"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <span
                                                            key={cdr.call_status}
                                                            className="px-2 py-1 rounded ml-1"
                                                            style={getRoleStyle(cdr.call_status)}
                                                        >
                                                            {cdr.call_status || '-'}
                                                        </span>

                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <span style={{ color: "inherit", textDecoration: "none" }}>
                                                            {cdr.direction}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <span style={{ color: "inherit", textDecoration: "none" }}>
                                                            {cdr.hangup_cause}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <span style={{ color: "inherit", textDecoration: "none" }}>
                                                            {cdr.direction === "outbound"
                                                            ? cdr.destination_number
                                                            : cdr.caller_id_number || "--"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {getFormattedDate(cdr.converted_date)}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {getRelativeTime(cdr.converted_date)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 border-b">
                                                        <span style={{ color: "inherit", textDecoration: "none" }}>
                                                            {formatDuration(cdr.total_duration)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

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
                            setSelectedCDR(null);
                        }}
                        cdr={selectedCDR}
                    />
                </div>
        </Suspense>
    );
};

export default CallDetailRecords;
