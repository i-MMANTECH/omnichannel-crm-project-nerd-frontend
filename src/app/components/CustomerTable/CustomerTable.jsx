import React, { useState, useMemo } from 'react';
import Pagination from '../../components/pagination/Pagination';
import './style.css';

const CustomerTable = ({ searchQuery, customers }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); 
    const totalPages = Math.ceil(customers.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); 
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, customers]);

    const displayedCustomers = filteredCustomers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getChannelIcon = (channel) => {
        switch (channel) {
            case "WhatsApp":
                return "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";
            case "Facebook":
                return "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg";
            case "Instagram":
                return "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png";
            default:
                return "https://via.placeholder.com/24/000000/FFFFFF?text=?"; // Placeholder for unknown channels
        }
    };
    

    return (
        <div className="p-6 body-theme min-h-screen border-l">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14 6V4C14 2.89543 13.1046 2 12 2L8 2M14 6H8M14 6V10M2 6L2 4C2 2.89543 2.89543 2 4 2L8 2M2 6L8 6M2 6L2 10M8 6L8 2M8 6V10M8 14H12C13.1046 14 14 13.1046 14 12V10M8 14H4C2.89543 14 2 13.1046 2 12L2 10M8 14V10M8 10L14 10M8 10H2" stroke="#F36F4A" strokeWidth="1.33333" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-600">Table View</span>
                            <span className="text-gray-500">&#x25BC;</span>
                        </button>

                        <span className="h-6 border-l border-gray-300 mx-2"></span>

                        <button className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4.99984 4L2.6665 6.33333M4.99984 4L7.33317 6.33333M4.99984 4V12M10.9998 12L8.6665 9.66667M10.9998 12L13.3332 9.66667M10.9998 12V4" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-600">Sort by</span>
                        </button>

                        <button className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-600">Filter</span>
                        </button>
                        </div>
                    </div>

                <button className="px-4 py-2 rounded-md shadow-sm" style={{ backgroundColor: '#3EBF0F' }}>
                    + New Customers
                </button>
                </div>


                {/* Table */}
                <div className="overflow-auto">
                    <table className="min-w-full body-theme">
                        <thead className="bg-gray-100 dark:bg-neutral-900">
                            <tr>
                                <th className="styled-th">Customer Name</th>
                                <th className="styled-th">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                            <path d="M4 5.3335L6.80743 6.73721C7.55817 7.11258 8.44183 7.11258 9.19257 6.73721L12 5.3335M4 12.6668H12C13.1046 12.6668 14 11.7714 14 10.6668V5.3335C14 4.22893 13.1046 3.3335 12 3.3335H4C2.89543 3.3335 2 4.22893 2 5.3335V10.6668C2 11.7714 2.89543 12.6668 4 12.6668Z" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="ml-1">Email</span>
                                    </div>
                                </th>
                                <th className="styled-th">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                            <path d="M7.86164 9.82798L6.16797 8.13712C5.62282 7.59287 5.62282 6.71048 6.16797 6.16623C6.65516 5.67985 6.71403 4.91134 6.30658 4.35665L4.9159 2.46343C4.50421 1.90296 3.68898 1.84072 3.19671 2.33217C2.44724 3.08039 1.94543 4.07059 2.00475 5.12706C2.29456 10.2884 6.33224 13.7386 10.8984 13.9953C11.9455 14.0542 12.9207 13.5486 13.6623 12.8082C14.1619 12.3094 14.0986 11.4834 13.5289 11.0663L11.6484 9.68959C11.0928 9.28282 10.323 9.34159 9.83581 9.82798C9.29066 10.3722 8.4068 10.3722 7.86164 9.82798Z" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="ml-1">Phone</span>
                                    </div>
                                </th>
                                <th className="styled-th">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" style={{ flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
                                            <path d="M6.66675 8.81966C6.76115 8.97426 6.87321 9.12059 7.00288 9.25553C7.80788 10.0933 9.03488 10.2243 9.97181 9.64846C10.1454 9.54173 10.309 9.41079 10.4582 9.25553L12.6178 7.00793C13.5719 6.01489 13.5719 4.40483 12.6178 3.41178C11.6636 2.41873 10.1166 2.41873 9.16241 3.41178L8.68675 3.90685" stroke="#808897" strokeLinecap="round" />
                                            <path d="M7.31362 12.0933L6.83775 12.5885C5.88359 13.5816 4.33656 13.5816 3.38238 12.5885C2.4282 11.5955 2.4282 9.98546 3.38238 8.9924L5.542 6.7448C6.49617 5.75174 8.04322 5.75173 8.99735 6.7448C9.12702 6.87966 9.23902 7.026 9.33342 7.18053" stroke="#808897" strokeLinecap="round" />
                                        </svg>
                                        <span className="ml-1">Channel</span>
                                    </div>
                                </th>
                                <th className="styled-th">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" style={{ flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
                                            <path d="M8.66658 2.66699H4.15629C2.52941 2.66699 1.71597 2.66699 1.42951 3.17799C1.42078 3.19355 1.41247 3.20935 1.40459 3.22535C1.14587 3.75094 1.6068 4.42119 2.52865 5.76169C3.264 6.83099 3.63167 7.36566 3.64065 7.97066C3.64095 7.99046 3.64095 8.01019 3.64065 8.02999C3.63167 8.63499 3.264 9.16966 2.52865 10.239C1.6068 11.5795 1.14587 12.2497 1.40459 12.7753C1.41247 12.7913 1.42078 12.8071 1.42951 12.8227C1.71597 13.3337 2.52941 13.3337 4.15629 13.3337H8.66658C9.97512 13.3337 10.6295 13.3337 11.1925 13.0521C11.7555 12.7706 12.1481 12.2472 12.9333 11.2003C14.0888 9.65959 14.6666 8.88919 14.6666 8.00033C14.6666 7.11146 14.0888 6.34107 12.9333 4.80033C12.1481 3.75347 11.7555 3.23005 11.1925 2.94852C10.6295 2.66699 9.97512 2.66699 8.66658 2.66699Z" stroke="#808897" />
                                        </svg>

                                        <span className="ml-1">Tag</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {displayedCustomers.map((customer, index) => (
                                <tr  style={{
                                    width: '100px',
                                    flexShrink: 0,
                                    fontFamily: '"Encode Sans"',
                                    fontSize: '14px',
                                    fontStyle: 'normal',
                                    fontWeight: 500,
                                    lineHeight: '150%',
                                    letterSpacing: '0.2px'
                                }} key={index} className="hover:dark:bg-neutral-900 hover:bg-gray-100 cursor-pointer">
                                    <td className="py-3 px-4 border-b border-gray-500 flex items-center space-x-3">
                                        <img 
                                            src={customer.image}
                                            alt={`${customer.name}'s avatar`}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <span>{customer.name}</span>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-500">{customer.email}</td>
                                    <td className="py-3 px-4 border-b border-gray-500">{customer.phone}</td>
                                    <td className="py-3 px-4 border-b border-gray-500">
                                        <div className="flex items-center space-x-2">
                                            {customer.channels.map((channel, idx) => (
                                                <div
                                                    key={idx}
                                                    className="channel-icon-container"
                                                    title={channel}
                                                >
                                                    <img
                                                        src={getChannelIcon(channel)}
                                                        alt={channel}
                                                        className="channel-icon"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-500">{customer.tag}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default CustomerTable;
