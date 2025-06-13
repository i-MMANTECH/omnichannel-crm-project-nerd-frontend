"use client";

import React, { useState } from "react";
import Pagination from "@/app/components/Pagination/Pagination";
import CreateIVRDrawer from "./CreateIVRDrawer";

const IVR = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Demo data that matches your screenshot
    const demoIVRs = [
        { id: 1, name: "Promo '25", timeout: 20, invalid_retries: 0, status: false },
        { id: 2, name: "Promo '26", timeout: 30, invalid_retries: 5, status: false },
        { id: 3, name: "Promo '27", timeout: 15, invalid_retries: 10, status: false },
        { id: 4, name: "Promo '28", timeout: 25, invalid_retries: 20, status: false },
        { id: 5, name: "Promo '29", timeout: 45, invalid_retries: 15, status: false },
        { id: 6, name: "Promo '30", timeout: 50, invalid_retries: 25, status: false },
        { id: 7, name: "Promo '31", timeout: 35, invalid_retries: 30, status: false },
        { id: 8, name: "Promo '32", timeout: 40, invalid_retries: 35, status: false },
    ];

    // Filter based on search query
    const filteredIVRs = demoIVRs.filter(ivr => 
        ivr.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalItems = filteredIVRs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedIVRs = filteredIVRs.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const toggleIVRStatus = (ivrId) => {
        // This is just for demo - in a real app you would update the backend
        const updatedIVRs = demoIVRs.map(ivr => 
            ivr.id === ivrId ? { ...ivr, status: !ivr.status } : ivr
        );
        // In a real app, you would set the state here
        // setIvrs(updatedIVRs);
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

                    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:flex-nowrap">
                        <button 
                            onClick={() => setIsDrawerOpen(true)}
                            className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto">
                            + Create IVR
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
                    <div className="overflow-auto">
                        <table className="min-w-full body-theme">
                            <thead className="bg-gray-100 dark:bg-neutral-900">
                                <tr>
                                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                        Name
                                    </th>
                                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                        Timeout
                                    </th>
                                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                        Invalid Retries
                                    </th>
                                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                        Status
                                    </th>
                                    <th className="styled-th text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedIVRs.map((ivr, index) => (
                                    <tr key={index} className="hover:dark:bg-neutral-900 hover:bg-gray-100">
                                        <td className="py-3 px-4 border-b">
                                            {ivr.name}
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            {ivr.timeout} sec
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            {ivr.invalid_retries}
                                        </td>
                                        {/* <td className="py-3 px-4 border-b">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={ivr.status}
                                                    onChange={() => toggleIVRStatus(ivr.id)}
                                                    className="sr-only peer"
                                                />
                                                <div
                                                    className={`w-11 h-6 rounded-full transition-colors ${
                                                        ivr.status ? "bg-[#3EBF0F]" : "bg-gray-300"
                                                    }`}
                                                >
                                                <div
                                                    className={`w-6 h-6 body-theme rounded-full transition-transform ${
                                                        ivr.status ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                                />
                                                </div>
                                            </label>
                                        </td> */}
                                        <td className="py-3 px-4 border-b">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={ivr.status}
                                                    onChange={() => toggleIVRStatus(ivr.id)}
                                                    className="sr-only peer"
                                                />
                                                <div
                                                    className={`w-11 h-6 rounded-full transition-colors ${
                                                        ivr.status ? "bg-[#3EBF0F]" : "bg-gray-300"
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-6 h-6 body-theme rounded-full transition-transform ${
                                                            ivr.status ? "translate-x-5" : "translate-x-0"
                                                        }`}
                                                    />
                                                </div>
                                            </label>
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            <button className="text-gray-500 hover:text-gray-700">
                                                ⋯
                                            </button>
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
            onClose={() => {
                setIsDrawerOpen(false);
            }} 
            />
        </div>
    );
};

export default IVR;