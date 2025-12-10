"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/app/components/Pagination/Pagination";
import CreateIVRDrawer from "./CreateIVRDrawer";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

const IVR = () => {
    const [ivrs, setIvrs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    // Fetch IVR data from API
    useEffect(() => {
        const fetchIVRs = async () => {
            try {
                const { data } = await axiosInstance.get("/call-center/ivrs/");
                setIvrs(data.results || []);
            } catch (error) {
                handleApiError(error);
            }
        };

        fetchIVRs();
    }, []);

    // Filter IVRs by search query
    const filteredIVRs = ivrs.filter(ivr =>
        ivr.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredIVRs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedIVRs = filteredIVRs.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const toggleIVRStatus = (uuid) => {
        // Optional: Add real update logic if needed
        const updated = ivrs.map(ivr =>
            ivr.uuid === uuid ? { ...ivr, status: ivr.status === "1" ? "0" : "1" } : ivr
        );
        setIvrs(updated);
    };

    return (
        <div className="ivr-page overflow-x-hidden flex flex-col px-10 min-h-[83vh] h-full !ml-0">
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

                    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:flex-nowrap">
                        <button 
                            onClick={() => setIsDrawerOpen(true)}
                            className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto">
                            + Create IVR
                        </button>
                    </div>
                </div>

                <div className="h-full overflow-auto">
                    <table className="min-w-full body-theme">
                        <thead className="bg-gray-100 dark:bg-neutral-900">
                            <tr>
                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Name</th>
                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Timeout</th>
                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Invalid Retries</th>
                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Status</th>
                                <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedIVRs.map((ivr, index) => (
                                <tr key={ivr.uuid || index} className="hover:dark:bg-neutral-900 hover:bg-gray-100">
                                    <td className="py-3 px-4 border-b">{ivr.name || "--"}</td>
                                    <td className="py-3 px-4 border-b">--</td>
                                    <td className="py-3 px-4 border-b">--</td>
                                    <td className="py-3 px-4 border-b">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={ivr.status === "1"}
                                                onChange={() => toggleIVRStatus(ivr.uuid)}
                                                className="sr-only peer"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors ${ivr.status === "1" ? "bg-[#3EBF0F]" : "bg-gray-300"}`}>
                                                <div className={`w-6 h-6 body-theme rounded-full transition-transform ${ivr.status === "1" ? "translate-x-5" : "translate-x-0"}`} />
                                            </div>
                                        </label>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <button className="text-gray-500 hover:text-gray-700">⋯</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-10">
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={setCurrentPage} 
                        onPageSizeChange={setPageSize}
                        pageSize={pageSize}
                    />
                    <div className="text-sm text-gray-500 mt-2">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
                    </div>
                </div>
            </div>

            <CreateIVRDrawer
                show={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default IVR;
