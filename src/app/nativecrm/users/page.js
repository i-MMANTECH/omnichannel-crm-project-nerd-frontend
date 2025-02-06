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

const ModalController = ({ children }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const isModalOpen = searchParams.get("action") === "invite-user";

    const openModal = () => {
        const params = new URLSearchParams(searchParams);
        params.set("action", "invite-user");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const closeModal = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("action");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return children({ isModalOpen, openModal, closeModal });
};

// Main Users component
const Users = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { handleApiError } = useError();
    const { axiosInstance } = useApi();

    // ✅ Extract pagination params from the URL
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("limit")) || 10;

    // ✅ Pagination states
    const [totalPages, setTotalPages] = useState(1);
    const [users, setUsers] = useState([]);
    const [view, setView] = useState("table");

    useEffect(() => {
        fetchUsers(currentPage, pageSize);

        const storedView = localStorage.getItem("view");
        if (storedView) setView(storedView);
    }, [currentPage, pageSize]);

    const fetchUsers = async (page = 1, limit = 10) => {
        try {
            const { data } = await axiosInstance.get(`/users?limit=${limit}&page=${page}`);
            setUsers(data.results || []);
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
                    <div className="overflow-x-hidden flex flex-col  px-10 min-h-[83vh] h-full">
                        <div className="relative body-theme flex-1 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={toggleView}
                                        className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 hover:dark:bg-neutral-900 hover:bg-gray-100"
                                    >
                                        {view === "grid" ? 
                                            <Image src={table} alt="table" className="mr-2" width={15} height={15} /> : 
                                            <Image src={grid} alt="grid" className="mr-2" width={15} height={15} />
                                        }
                                        <span className="text-sm font-medium">
                                            {view === "grid" ? "Grid View" : "Table View"}
                                        </span>
                                    </button>
                                    <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                                        <Image src={sort} alt="sort" className="mr-2" width={15} height={15} />
                                        <span className="text-sm font-medium">Sort by</span>
                                    </button>
                                    <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                                        <Image src={filter} alt="filter" className="mr-2" width={15} height={15} />
                                        <span className="text-sm font-medium">Filter</span>
                                    </button>
                                </div>
                                <button 
                                    onClick={openModal}
                                    className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm">
                                    + Invite User
                                </button>
                            </div>

                            <div className="h-full">
                                {users.length > 0 ? (
                                    view === "table" ? (
                                        <UserTable searchQuery="" users={users} />
                                    ) : (
                                        <UserGrid searchQuery="" users={users} />
                                    )
                                ) : (
                                    <div className="min-h-96 flex items-center justify-center">
                                        <NoDataFound message="You do not have any users" icon={empty} />
                                    </div>
                                )}
                            </div>

                            <div className="mt-10">
                                <Pagination 
                                    currentPage={currentPage} 
                                    totalPages={totalPages} 
                                    onPageChange={handlePageChange} 
                                    onPageSizeChange={handlePageSizeChange}
                                    pageSize={pageSize}
                                />
                            </div>
                        </div>

                        <CreateUserModal isModalOpen={isModalOpen} closeModal={closeModal} />
                    </div>
                )}
            </ModalController>
        </Suspense>
    );
};

export default Users;
