"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CustomerGrid from '@/app/components/Customers/CustomerGrid';
import CustomerTable from '@/app/components/Customers/CustomerTable/CustomerTable';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Image from 'next/image';
import table from '@/public/assets/table.svg';
import grid from '@/public/assets/grid.svg';
import sort from '@/public/assets/sort.svg';
import filter from '@/public/assets/filter.svg';
import NoDataFound from '@/app/components/NoDataFound';
import empty from '@/public/assets/empty.svg';
import CreateCustomerModal from '@/app/components/Customers/CreateCustomerModal';
import ImportCustomersModal from '@/app/components/Customers/ImportCustomersModal';
import SuccessModal from '@/app/components/SuccessModal';
import Pagination from '@/app/components/Pagination/Pagination';
import { Upload } from 'lucide-react';

const ModalController = ({ children }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isModalOpen = searchParams.get('action') === 'new-customer';

    const openModal = () => {
        const params = new URLSearchParams(searchParams);
        params.set('action', 'new-customer');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const closeModal = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('action');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return children({ isModalOpen, openModal, closeModal });
};

const CustomersContent = () => {
    const [customers, setCustomers] = useState([]);
    const [view, setView] = useState('table');
    const { handleApiError } = useError();
    const { axiosInstance, loading } = useApi();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const searchParams = useSearchParams();
    const selectedTags = searchParams.get("tags");

    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") || ""
    );
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    const router = useRouter();
    const pathname = usePathname();

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    useEffect(() => {
        const page = Number(searchParams.get('page')) || 1;
        const size = Number(searchParams.get('page_size')) || 10;

        setCurrentPage(page);
        setPageSize(size);
    }, [searchParams]);


    useEffect(() => {
        fetchCustomers();
    }, [isSuccessModalOpen, currentPage, pageSize, debouncedSearch, selectedTags]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedView = localStorage.getItem("view");
            if (storedView) {
                setView(storedView);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedSearch !== searchParams.get("search")) {
            const params = new URLSearchParams(searchParams);

            if (debouncedSearch) {
                params.set("search", debouncedSearch);
            } else {
                params.delete("search");
            }

            params.set("page", "1"); // reset pagination
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
            setCurrentPage(1);
        }
    }, [debouncedSearch]);

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const fetchCustomers = async () => {
        try {
            const params = new URLSearchParams();

            params.set("page", currentPage.toString());
            params.set("page_size", pageSize.toString());

            if (debouncedSearch) {
                params.set("search", debouncedSearch);
            }

            if (selectedTags) {
                params.set("tags", selectedTags); // pass-through
            }

            const { data } = await axiosInstance.get(
                `/customers/?${params.toString()}`
            );

            setCustomers(data.results || []);
            setTotalPages(Math.ceil(data.count / pageSize));
        } catch (error) {
            handleApiError(error);
        }
    };


    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handlePageSizeChange = (newSize) => {
        const params = new URLSearchParams(searchParams);
        params.set('size', newSize.toString());
        params.set('page', '1'); // Reset to first page when changing page size
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const toggleView = () => {
        if (typeof window !== 'undefined') {
            const newView = view === 'grid' ? 'table' : 'grid';
            setView(newView);
            localStorage.setItem('view', newView);
        }
    };

    const handleImportSuccess = () => {
        fetchCustomers();
        setIsImportModalOpen(false);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ModalController>
                {({ isModalOpen, openModal, closeModal }) => (
                    <div className="overflow-x-hidden flex flex-row body-theme min-h-[83vh] pl-10">
                        <div className='relative body-theme flex-1 flex flex-col'>
                            <div className="w-[100%] max-w-[1200px] sm:max-w-full flex items-center gap-4 mb-6 mx-auto">

                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={toggleView}
                                        className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 hover:dark:bg-neutral-900 hover:bg-gray-100"
                                    >
                                        {view === 'table' ?
                                            <Image src={table} alt='tbl' className='mr-2' width={15} height={15} /> :
                                            <Image src={grid} alt='grd' className='mr-2' width={15} height={15} />
                                        }
                                        <span className="text-sm font-medium">
                                            {view === 'table' ? 'Table View' : 'Grid View'}
                                        </span>
                                    </button>
                                    <button className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                                        <Image src={sort} alt='sort' className='mr-2' width={15} height={15} />
                                        <span className="text-sm font-medium">Sort by</span>
                                    </button>
                                    <button className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                                        <Image src={filter} alt='filter' className='mr-2' width={15} height={15} />
                                        <span className="text-sm font-medium">Filter</span>
                                    </button>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center border border-gray-300 rounded-lg shadow-sm bg-white px-3 py-1.5">
                                        <input
                                            type="text"
                                            placeholder="Search customers..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="outline-none bg-transparent text-sm w-48"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setDebouncedSearch("");
                                                }}
                                                className="ml-2 text-gray-400 hover:text-gray-600"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>


                                <div className="flex items-center space-x-3 ml-auto">
                                    <button
                                        onClick={() => setIsImportModalOpen(true)}
                                        className="flex items-center border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <Upload size={16} className="mr-2" />
                                        Import
                                    </button>
                                    <button
                                        onClick={openModal}
                                        className="whitespace-nowrap bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#35a509] transition-colors"
                                    >
                                        + New Customer
                                    </button>
                                </div>
                            </div>

                            <div className="w-[90%] mx-auto sm:w-full">

                                {customers.length > 0 ? (
                                    view === 'table' ? (
                                        <CustomerTable customers={customers} />
                                    ) : (
                                        <CustomerGrid customers={customers} />
                                    )
                                ) : (
                                    <div className="min-h-86 flex items-center justify-center">
                                        <NoDataFound message='You do not have any customers' icon={empty} />
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

                        <CreateCustomerModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            setIsSuccessModalOpen={setIsSuccessModalOpen}
                        />

                        <ImportCustomersModal
                            isOpen={isImportModalOpen}
                            onClose={() => setIsImportModalOpen(false)}
                            onSuccess={handleImportSuccess}
                        />

                        <SuccessModal
                            isOpen={isSuccessModalOpen}
                            title="Success!"
                            message="You have successfully added a new Customer"
                            buttonText="Okay, thank you"
                            onClose={closeSuccessModal}
                        />
                    </div>
                )}
            </ModalController>
        </Suspense>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CustomersContent />
        </Suspense>
    );
};

export default Page;
