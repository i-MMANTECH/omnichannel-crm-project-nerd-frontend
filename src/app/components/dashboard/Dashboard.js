import React from 'react';
import DashboardContent from './DashboardContent';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';

const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <DashboardContent />
            </div>
        </div>
    );
};

export default Dashboard;
