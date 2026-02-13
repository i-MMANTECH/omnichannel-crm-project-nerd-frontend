'use client';

import React, { useState, useMemo } from 'react';
import UserAvatar from "../../UserAvatar";
import mockTeamData from './mockTeamData.json';

const TeamProductivityTable = ({ filters, selectedUser, refreshKey }) => {
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Filter data based on selected user
    const filteredData = useMemo(() => {
        if (!selectedUser) return mockTeamData;
        return mockTeamData.filter(member => member.Name.toLowerCase().includes(selectedUser.toLowerCase()));
    }, [selectedUser]);

    // Pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Good':
                return 'text-green-600 bg-green-100';
            case 'Fair':
                return 'text-yellow-600 bg-yellow-100';
            case 'Poor':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getPercentageColor = (percentage, target) => {
        if (percentage >= target) return 'text-green-600';
        if (percentage >= target * 0.8) return 'text-yellow-600';
        return 'text-red-600';
    };

    const renderStars = (quality) => {
        return Array.from({ length: 5 }, (_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < quality ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    const actionOptions = [
        'View Details',
        'Send Message',
        'Assign Task',
        'Schedule Meeting',
        'View Performance',
        'Export Report'
    ];

    const handleActionClick = (option, memberName) => {
        console.log(`Action: ${option} for ${memberName}`);
        setShowActionMenu(null);
    };

    return (
        <div className="w-full border rounded-[16px] border-gray-300 dark:border-gray-700 p-4 mt-6 overflow-auto body-theme">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Agent Performance</h3>
                    <h3 className='text-sm mt-2'>Monitor and Analyze team performance</h3>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search team members..."
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <svg
                            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    
                    {/* Filter Button */}
                    <button className="flex items-center gap-2 px-3 h-[40px] rounded-[10px] bg-[#3EBF0F] items-center hover:bg-[#36A50D] transition-colors">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                        <span className="text-[14px] font-medium tracking-[0.2px] text-white">Filter</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-300 bg-[#F8F9FB] dark:bg-gray-800 rounded-lg overflow-hidden">
                            <th className="py-3 px-3 text-left rounded-tl-lg">Name</th>
                            <th className="py-3 px-3 text-center">Calls</th>
                            <th className="py-3 px-3 text-center">Msgs</th>
                            <th className="py-3 px-3 text-center">Tasks</th>
                            <th className="py-3 px-3 text-center">Overall</th>
                            <th className="py-3 px-3 text-center">Completion</th>
                            <th className="py-3 px-3 text-center">Quality</th>
                            <th className="py-3 px-3 text-center">Target</th>
                            <th className="py-3 px-3 text-center">Status</th>
                            <th className="py-3 px-3 text-center rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="py-8 text-center text-gray-500">
                                    No team members found
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((member, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                name={member.Name}
                                                className="w-8 h-8 rounded-full flex-shrink-0"
                                            />
                                            <div>
                                                <div className="font-medium">{member.Name}</div>
                                                <div className="text-xs text-gray-500">{member.Role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div>
                                            <div className="font-medium">{member.Calls}</div>
                                            <div className={`text-xs ${getPercentageColor(member.Call, 100)}`}>
                                                {member.Call}%
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div>
                                            <div className="font-medium">{member.Msgs}</div>
                                            <div className={`text-xs ${getPercentageColor(member.Msg, 100)}`}>
                                                {member.Msg}%
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div>
                                            <div className="font-medium">{member.Tasks}</div>
                                            <div className={`text-xs ${getPercentageColor(member.Task, 100)}`}>
                                                {member.Task}%
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div className={`font-medium ${getPercentageColor(member.Overall, 100)}`}>
                                            {member.Overall}%
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div className={`font-medium ${getPercentageColor(member.Completion, 100)}`}>
                                            {member.Completion}%
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div className="flex justify-center gap-0.5">
                                            {renderStars(member.Quality)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div className={`font-medium ${getPercentageColor(member.Target, member.Target)}`}>
                                            {member.Target}%
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.Status)}`}>
                                            {member.Status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowActionMenu(showActionMenu === index ? null : index)}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                </svg>
                                            </button>
                                            
                                            {showActionMenu === index && (
                                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                                    {actionOptions.map((option, optionIndex) => (
                                                        <button
                                                            key={optionIndex}
                                                            onClick={() => handleActionClick(option, member.Name)}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {totalPages > 1 && `Page ${currentPage} of ${totalPages}`}
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">
                        Showing {paginatedData.length} of {filteredData.length} members
                    </div>
                    {totalPages > 1 && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamProductivityTable;
