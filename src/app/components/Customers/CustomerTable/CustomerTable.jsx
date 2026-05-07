import React, { useState } from 'react';
import './style.css';
import { useRouter } from 'next/navigation';
import UserAvatar from '../../UserAvatar';
import LeadAvatar from '../../Leads/LeadAvatar';
import { getRoleStyle } from '@/utils/getRoleStyle';
import { getChannelIcon } from '@/utils/getChannelIcon';
import { useCanViewContactInfo } from '@/hooks/useCanViewContactInfo';
import { maskPhoneNumber, maskEmail } from '@/utils/maskContactInfo';
import truncateText from '@/utils/truncateText';

const CustomerTable = ({ customers }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const router = useRouter();
    const canViewContactInfo = useCanViewContactInfo();

    const handlePageChange = (page) => setCurrentPage(page);

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const formatAccountManager = (manager) => {
        if (!manager) return null;
        const fullName = `${manager.first_name || ""} ${manager.last_name || ""}`.trim();
        return fullName || manager.email || `User #${manager.id}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Customer Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Channel
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Categories
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Account Manager
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {customers?.map((customer, index) => {
                            const managerName = formatAccountManager(customer?.account_manager);
                            return (
                                <tr
                                    key={customer.id || index}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => router.push(`customers/${customer.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <LeadAvatar
                                                image={customer?.image}
                                                name={`${customer.first_name || ""} ${customer.last_name || ""}`.trim()}
                                            />
                                            <span>{customer?.username || "--"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {`${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "--"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {customer.email
                                            ? maskEmail(truncateText(customer.email), canViewContactInfo)
                                            : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {customer.phone_number
                                            ? maskPhoneNumber(customer.phone_number, canViewContactInfo)
                                            : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {(!customer?.channels || customer.channels.length === 0) ? (
                                            <span className="text-gray-400">—</span>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                {customer.channels.map((channel, idx) => (
                                                    <div
                                                        key={`${customer.id}-channel-${idx}`}
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
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {(!customer?.categories || customer.categories.length === 0) ? (
                                            <span className="text-gray-400">—</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {customer.categories.slice(0, 6).map((cat, idx) => (
                                                    <span
                                                        key={`${customer.id}-category-${idx}`}
                                                        className="px-2 py-0.5 text-xs rounded"
                                                        style={getRoleStyle(cat)}
                                                    >
                                                        {cat}
                                                    </span>
                                                ))}
                                                {customer.categories.length > 6 && (
                                                    <span className="text-xs font-bold">+{customer.categories.length - 6}</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {managerName ? (
                                            <div
                                                className="flex items-center gap-2"
                                                title={customer?.account_manager?.email || managerName}
                                            >
                                                <UserAvatar name={managerName} width="w-7" height="h-7" />
                                                <span className="truncate max-w-[160px]">{managerName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;
