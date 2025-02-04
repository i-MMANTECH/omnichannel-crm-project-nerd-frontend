'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CustomerGrid from '@/app/components/Customers/CustomerGrid/CustomerGrid';
import CustomerTable from '@/app/components/Customers/CustomerTable/CustomerTable';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Image from 'next/image';
import table from '/public/assets/table.svg';
import grid from '/public/assets/grid.svg';
import sort from '/public/assets/sort.svg';
import filter from '/public/assets/filter.svg';
import NoDataFound from '@/app/components/NoDataFound';
import empty from '/public/assets/empty.svg';
import CreateCustomerModal from '@/app/components/Customers/CreateCustomerModal';
import SuccessModal from '@/app/components/SuccessModal';


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

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [customers, setCustomers] = useState([]);
    const [view, setView] = useState('list');
    const { handleApiError } = useError();
    const { axiosInstance, loading } = useApi();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, [isSuccessModalOpen]);

    useEffect(() => {    
        fetchCustomers();

        const storedView = localStorage.getItem('view');
        if (storedView) {
            setView(storedView);
        }
    }, []);

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const fetchCustomers = async () => {
        try {
            const { data } = await axiosInstance.get('/customers');
            const customers = data.results || [];
            setCustomers(customers);
        } catch (error) {
            handleApiError(error);
        }
    };
    
    const toggleView = () => {
        const newView = view === 'grid' ? 'list' : 'grid';
        setView(newView);
        localStorage.setItem('view', newView);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>    
            <ModalController>
                {({ isModalOpen, openModal, closeModal }) => (
                    <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">
                        <div className='relative body-theme flex-1 flex flex-col'>  
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={toggleView}
                                        className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 hover:dark:bg-neutral-900 hover:bg-gray-100"
                                    >
                                        {view === 'grid' ? 
                                            <Image src={table} alt='tbl' className='mr-2' width={15} height={15}  /> : 
                                            <Image src={grid} alt='grd'  className='mr-2' width={15} height={15} />
                                        }
                                        <span className="text-sm font-medium">
                                            {view === 'grid' ? 'List View' : 'Grid View'}
                                        </span>
                                    </button>
                                    <button className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                                        <Image src={sort} alt='sort' className='mr-2' width={15} height={15}  />
                                        <span className="text-sm font-medium">Sort by</span>
                                    </button>
                                    <button className="hidden flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                                        <Image src={filter} alt='filter' className='mr-2' width={15} height={15} />
                                        <span className="text-sm font-medium">Filter</span>
                                    </button>
                                </div>
                                <button 
                                    onClick={openModal}
                                    className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm">
                                    New Customer
                                </button>
                            </div>

                            {customers.length > 0 ? (
                                view === 'list' ? (
                                    <CustomerTable searchQuery={searchQuery} customers={customers} />
                                ) : (
                                    <CustomerGrid searchQuery={searchQuery} customers={customers} />
                                )
                            ) : (
                                <div className="min-h-96 flex items-center justify-center">
                                    <NoDataFound message='You do not have any customers' icon={empty} />
                                </div>
                            )}
                        </div>

                        <CreateCustomerModal 
                            isOpen={isModalOpen} 
                            onClose={closeModal}
                            setIsSuccessModalOpen={setIsSuccessModalOpen}
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

export default Page;