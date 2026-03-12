/**
 * Tasks Section Component
 * 
 * This component handles team productivity display including:
 * - Statistics cards
 * - Team productivity table with performance metrics
 * - Interactive action menus for each team member
 */
'use client';

import React from 'react';
import { CheckSquareIcon, MessageSquareIcon, PhoneCallIcon, UsersIcon } from 'lucide-react';
import TeamProductivityTable from './TeamProductivityTable';
import StatCard from './StatCard';

const TasksSection = ({ filters, selectedUser, refreshKey }) => {
    const statsData = [
        {
            title: 'Total Calls',
            value: 247,
            icon: <PhoneCallIcon className="text-white" size={20} />,
            bgColor: '#666D80',
        },
        {
            title: 'Total Messages',
            value: 198,
            icon: <MessageSquareIcon className="text-white" size={20} />,
            bgColor: '#1285FE',
        },
        {
            title: 'Total Tasks',
            value: 32,
            icon: <CheckSquareIcon className="text-white" size={20} />,
            bgColor: '#3EBF0F',
        },
        {
            title: 'Average Team Score',
            value: `${20}%`,
            icon: <UsersIcon className="text-white" size={20} />,
            bgColor: '#FF7043',
        },
    ];

    return (
        <>
            {/* Stats Cards */}
            <div className="gap-5 mt-5 flex flex-wrap border border-[#DFE1E6] body-theme rounded-[16px] p-5">
                {statsData.map((stat, index) => (
                    <StatCard 
                        key={index}
                        icon={stat.icon}
                        title={stat.title}
                        value={stat.value}
                        bgColor={stat.bgColor}
                    />
                ))}
            </div>

            {/* Team Productivity Table */}
            <TeamProductivityTable 
                filters={filters} 
                selectedUser={selectedUser}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default TasksSection;
