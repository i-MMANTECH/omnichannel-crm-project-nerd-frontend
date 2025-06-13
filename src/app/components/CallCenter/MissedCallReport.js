"use client";

import React, { useEffect, useState, Suspense } from "react";
import UserGrid from "@/app/components/Users/UserGrid";
import UserTable from "@/app/components/Users/UserTable";
import CreateUserModal from "@/app/components/Users/CreateUserModal";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
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
import { FolderUp } from "lucide-react";


const ModalController = ({ children }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const isModalOpen = searchParams.get("action") === "invite-user";

    const openModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("action", "invite-user");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("action");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return children({ isModalOpen, openModal, closeModal });
};

// Main Users component
const MissedCallReport = () => {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { handleApiError } = useError();
    const { axiosInstance } = useApi();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [users, setUsers] = useState([]);
    const [view, setView] = useState("table");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
    const [isCreateUser, setIsCreateUser] = useState(false)

    useEffect(() => {
        fetchUsers(currentPage, pageSize, debouncedSearchQuery);

        const storedView = localStorage.getItem("view");
        if (storedView) setView(storedView);
    }, [currentPage, pageSize, debouncedSearchQuery]);

    const fetchUsers = async (page = 1, limit = 10, search = "") => {
        try {
            const { data } = await axiosInstance.get(`/users?limit=${limit}&page=${page}&search=${search}`);
            setUsers(data.results.filter(u => u.id !== Number(user.user_id)));
            setTotalPages(Math.ceil(data.count / limit));
        } catch (error) {
            handleApiError(error);
        }
    };

    const toggleView = () => {
        const newView = view === "grid" ? "table" : "grid";
        setView(newView);
        localStorage.setItem("view", newView);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handlePageSizeChange = (limit) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", limit);
        params.set("page", 1); // Reset to first page when limit changes
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ModalController>
                {({ isModalOpen, openModal, closeModal }) => (
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

                            {/* Search and Invite User */}
                            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:flex-nowrap">
                                <button 
                                    onClick={openModal}
                                    className="hidden bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto">
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
                                            Number/Contact
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
                                            Action
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index} onClick={() => router.push(`users/${user.id}`)} className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer">
                                            <td className="py-3 px-4 border-b flex items-center space-x-3">
                                                <UserAvatar 
                                                name={user.first_name ? 
                                                    `${user.first_name} ${user.last_name}` : 
                                                    user.email || '--'
                                                } 
                                                width="w-8" 
                                                height="h-8" 
                                                />
                                                <span>{user.first_name ? 
                                                    `${user.first_name} ${user.last_name}` : 
                                                    '--'
                                                } </span>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                {user.roles.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className="px-2 py-1 rounded ml-1"
                                                    style={getRoleStyle(role.name)}
                                                >
                                                    {role.name}
                                                </span>
                                                ))}
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span style={{ color: "inherit", textDecoration: "none" }}>
                                                    {user.email}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span style={{ color: "inherit", textDecoration: "none" }}>
                                                    {user.phone_number}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                                <span style={{ color: "inherit", textDecoration: "none" }}>
                                                    {user.lastActive || "--"}
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
                                    onPageChange={setCurrentPage} 
                                    onPageSizeChange={setPageSize}
                                    pageSize={pageSize}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </ModalController>
        </Suspense>
    );
};

export default MissedCallReport;
