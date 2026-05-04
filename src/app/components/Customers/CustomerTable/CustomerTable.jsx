import React, { useState } from 'react';
import './style.css';
import { useRouter } from 'next/navigation';
import UserAvatar from '../../UserAvatar';
import Image from 'next/image';
import { getRoleStyle } from '@/utils/getRoleStyle';
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

    const getChannelIcon = (channel) => {
        switch (channel) {
            case "WhatsApp":
                return "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";
            case "Facebook":
                return "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg";
            case "Instagram":
                return "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png";
            default:
                return "https://via.placeholder.com/24/000000/FFFFFF?text=?";
        }
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
                                Tags
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {customers?.map((customer, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => router.push(`customers/${customer.id}`)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div className="flex items-center gap-3">
                                        {customer?.image ? (
                                            <Image
                                                alt="profile pic"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full"
                                                src={customer.image}
                                            />
                                        ) : (
                                            <UserAvatar
                                                name={`${customer.first_name} ${customer.last_name}`}
                                                width="w-8"
                                                height="h-8"
                                            />
                                        )}
                                        <span>{customer?.username || "--"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {`${customer.first_name} ${customer.last_name}` || "--"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {maskEmail(truncateText(customer.email), canViewContactInfo)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {maskPhoneNumber(customer.phone_number, canViewContactInfo)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {(!customer?.channels || customer.channels.length === 0) ? (
                                        <span className="text-gray-400">—</span>
                                    ) : (
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
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {(!customer?.categories || customer.categories.length === 0) ? (
                                        <span className="text-gray-400">—</span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {customer.categories.slice(0, 6).map((cat, idx) => (
                                                <span
                                                    key={idx}
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
                                    {(!customer?.tags || customer.tags.length === 0) ? (
                                        <span className="text-gray-400">—</span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {customer.tags.slice(0, 6).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 text-xs rounded"
                                                    style={getRoleStyle(tag)}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {customer.tags.length > 6 && (
                                                <span className="text-xs font-bold">+{customer.tags.length - 6}</span>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;
