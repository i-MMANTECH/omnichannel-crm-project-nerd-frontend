"use client";
import React, { useState } from 'react';
import { Search, Filter} from 'lucide-react';
import SmsBalanceCard from './SmsBalanceCard';

const Sms = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const messages = [
        { id: 1, date: 'Oct 23', status: 'Sent', text: 'Hello! Thank you for choosing fueled by...' },
        { id: 2, date: 'Oct 23', status: 'Draft', text: 'Hello! Thank you for choosing fueled by...' },
        { id: 3, date: 'Oct 23', status: 'Failed', text: 'Hello! Thank you for choosing fueled by...' },
        { id: 4, date: 'Oct 23', status: 'Failed', text: 'Hello! Thank you for choosing fueled by...' },
        { id: 5, date: 'Oct 23', status: 'Sent', text: 'Hello! Thank you for choosing fueled by...' },
        { id: 6, date: 'Oct 23', status: 'Failed', text: 'Hello! Thank you for choosing fueled by...' },
        { id: 7, date: 'Oct 23', status: 'Failed', text: 'Hello! Thank you for choosing fueled by...' },
    ];

    const filteredMessages = messages.filter(message => {
        const matchesSearch = message.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || message.status.toLowerCase() === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="body-theme flex flex-row px-10 min-h-[83vh]">
            <div className='relative body-theme rounded-lg shadow-sm flex-1 flex flex-col'>
                <SmsBalanceCard/>

                <div className="body-theme flex justify-between items-center px-6 py-4 border-b border-gray-200">
                   <div>
                        <p>Recent Messages</p>
                   </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} />
                            <input
                                type="text"
                                placeholder="Search for messages"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Filter size={16} />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>

               <table className="body-theme min-w-full divide-y divide-gray-200">
                    <thead className="body-theme ">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">SMS</th>
                            <th className="w-20  text-sm font-medium text-gray-600 dark:text-gray-300">Date Sent</th>
                            <th className="w-20 px-6 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody className="body-theme divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredMessages.map((message) => (
                            <tr key={message.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{message.text}</td>
                                <td className="px- py-4 text-sm text-gray-500 dark:text-gray-400">{message.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                        message.status === 'Sent' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                        message.status === 'Draft' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                    }`}>
                                        {message.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sms;
