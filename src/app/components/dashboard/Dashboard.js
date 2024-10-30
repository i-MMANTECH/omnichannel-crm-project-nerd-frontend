"use client";

import React, { useState } from 'react';
import DashboardContent from './DashboardContent';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import UserTable from '../userTable/UserTable';

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState('DashboardContent');

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'UserTable':
                return <UserTable />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar setActiveComponent={setActiveComponent} />

            <div className="flex-1 flex flex-col">
            <Navbar title="Dashboard" />
                <div className="p-4">{renderActiveComponent()}</div>
            </div>
        </div>
    );
};

export default Dashboard;
