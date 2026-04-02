"use client";

import React, { useEffect, useState, Suspense } from "react";
import UserGrid from "@/app/components/Users/UserGrid";
import UserTable from "@/app/components/Users/UserTable";
import CreateUserModal from "@/app/components/Users/CreateUserModal";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import table from "@/public/assets/table.svg";
import grid from "@/public/assets/grid.svg";
import sort from "@/public/assets/sort.svg";
import filter from "@/public/assets/filter.svg";
import NoDataFound from "@/app/components/NoDataFound";
import empty from "@/public/assets/empty.svg";
import Pagination from "@/app/components/Pagination/Pagination";
import { useDebounce } from 'use-debounce';
import { useAuth } from "@/context/AuthContext";
import CreateUserModal2 from "@/app/components/Users/CreateUserModal2";

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
const Users = () => {
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
            setUsers(data.results);
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
                                    <button
                                        onClick={toggleView}
                                        className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-neutral-900"
                                    >
                                        {view === "table" ?
                                            <Image src={table} alt="tbl" className="mr-2" width={15} height={15} /> :
                                            <Image src={grid} alt="grd" className="mr-2" width={15} height={15} />
                                        }
                                        <span className="text-sm font-medium">
                                            {view === "table" ? "Table View" : "Grid View"}
                                        </span>
                                    </button>

                                    {/* Hidden Sort & Filter Buttons */}
                                    <button className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-neutral-900">
                                        <Image src={sort} alt="sort" className="mr-2" width={15} height={15} />
                                        <span className="text-sm font-medium">Sort by</span>
                                    </button>
                                    <button className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-neutral-900">
                                        <Image src={filter} alt="filter" className="mr-2" width={15} height={15} />
                                        <span className="text-sm font-medium">Filter</span>
                                    </button>
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
                                </div>

                                {/* Search and Invite User */}
                                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:flex-nowrap sm:ml-auto">
                                    <button
                                        onClick={openModal}
                                        className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto">
                                        + Invite User
                                    </button>
                                    <button
                                        onClick={() => setIsCreateUser(true)}
                                        className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm w-full sm:w-auto">
                                        + Create User
                                    </button>
                                </div>
                            </div>

                            <div className="h-full">
                                {users.length > 0 ? (
                                    view === "table" ? (
                                        <UserTable searchQuery="" users={users} />
                                    ) : (
                                        <UserGrid searchQuery="" users={users} />
                                    )
                                ) : (
                                    <div className="min-h-86 flex items-center justify-center">
                                        <NoDataFound message="No users found." icon={empty} />
                                    </div>
                                )}
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

                        <CreateUserModal isModalOpen={isModalOpen} closeModal={closeModal} />
                        <CreateUserModal2 isModalOpen={isCreateUser} closeModal={() => setIsCreateUser(false)} />
                    </div>
                )}
            </ModalController>
        </Suspense>
    );
};

export default Users;
