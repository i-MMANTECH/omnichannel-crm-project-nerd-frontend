"use client";

import React, { useState, useEffect } from 'react';
import CustomerGrid from '@/app/components/Customers/CustomerGrid/CustomerGrid';
import CustomerTable from '@/app/components/Customers/CustomerTable/CustomerTable';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import table from '/public/assets/table.svg';
import grid from '/public/assets/grid.svg';
import sort from '/public/assets/sort.svg';
import filter from '/public/assets/filter.svg';
import NoDataFound from '@/app/components/NoDataFound';
import empty from '/public/assets/empty.svg'
import Image from 'next/image';
import CreateCustomerModal from '@/app/components/Customers/CustomerGrid/CreateCustomerModal';



const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [customers, setCustomers] = useState([]);
    const [view, setView] = useState('list');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const { handleApiError } = useError()
    const { axiosInstance, loading } = useApi()

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data } = await axiosInstance.get('/customers');
                const customers = data.results || [];

                console.log('customers are', customers)
                setCustomers(customers);
            } catch (error) {
                handleApiError(error);
            }
        };
    
        fetchCustomers();

        const storedView = localStorage.getItem('view');
        console.log('stored view is ', storedView)
        if (storedView) {
            setView(storedView);
        }
    }, [isModalOpen]);

    const toggleView = () => {
        const newView = view === 'grid' ? 'list' : 'grid';
        setView(newView);

        localStorage.setItem('view', newView);
    };

    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">
            <div className='relative body-theme flex-1 flex flex-col '>  
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleView}
                        className="flex items-center border border-gray-300 px-3 py-1.5 
                        rounded-lg shadow-sm  hover:bg-gray-50 hover:dark:bg-neutral-900 hover:bg-gray-100"
                    >
                        {view === 'grid' ? 
                            <Image src={table} className='mr-2' width={15} height={15}  /> : 
                            <Image src={grid} className='mr-2' width={15} height={15} />
                            }
                        <span className="text-sm font-medium">
                            {view === 'grid' ? 'List View' : 'Grid View'}
                        </span>
                    </button>
                    <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg 
                    shadow-sm hover:dark:bg-neutral-900 hover:bg-gray-100">
                        <Image src={sort} className='mr-2' width={15} height={15} />
                        <span className="text-sm font-medium">Sort by</span>
                    </button>
                    <button className="flex items-center border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm 
                    hover:dark:bg-neutral-900 hover:bg-gray-100">
                        <Image src={filter} className='mr-2' width={15} height={15} />
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
                        ): (
                        <div className="min-h-96 flex items-center justify-center">
                            <NoDataFound message='You do not have any customers' icon={empty} />
                        </div>
                    )
                }
            </div>

            <CreateCustomerModal isModalOpen={isModalOpen} closeModal={closeModal}/>
        </div>
    );
};
export default Page;
