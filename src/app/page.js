import React from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';

const Dashboard = () => {
    return (
        <div style={{zIndex:100, marginLeft:240}} className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-4">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <div>home</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
