"use client";

import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = ({ setActiveComponent }) => {
    const menuItems = [
        { id: 'DashboardContent', icon: 'bi-speedometer2', label: 'Dashboard' },
        { id: 'UserTable', icon: 'bi-people', label: 'Users' },
        { id: 'Messaging', icon: 'bi-chat', label: 'Messaging' },
        { id: 'Tasks', icon: 'bi-list-check', label: 'Tasks' },
        { id: 'Customers', icon: 'bi-people', label: 'Customers' },
        { id: 'AgentManagement', icon: 'bi-person-badge', label: 'Agent Management' },
        { id: 'Reports', icon: 'bi-bar-chart', label: 'Reports' },
        { id: 'Notifications', icon: 'bi-bell', label: 'Notifications' },
    ];

    return (
        <div className="h-full w-64 bg-white shadow-lg z-10 pt-4 px-3">
            <div className="flex items-center px-3 mb-5">
                <img src="/logo.png" alt="Native Talk Logo" className="h-7 mr-2" /> 
                <span className="text-gray-800 font-bold text-base">
                    native <span style={{ color: '#3EBF0F' }}>talk</span>
                </span>
            </div>
            
            <h2 className="text-gray-500 text-xs font-semibold mt-6 mb-3 pl-3">Main Menu</h2>
            <ul className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                    <li key={item.id} className="nav-item">
                        <button
                            onClick={() => setActiveComponent(item.id)}
                            className="nav-link flex items-center p-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <i className={`bi ${item.icon} mr-3 text-base`}></i> {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            <ul className="flex flex-col space-y-1 mt-5">
                {/* Additional items, e.g., settings and help */}
            </ul>

            <div className="flex items-center mt-5 p-3 bg-gray-100 rounded-md">
                <img src="/user-avatar.jpg" alt="User Avatar" className="h-8 w-8 rounded-full mr-3" />
                <div>
                    <p className="text-gray-800 text-sm font-semibold">Denise Adebayo</p>
                    <p className="text-gray-500 text-xs">Agent</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
