// "use client"; //

import React from 'react';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
    const isActive = (path) => false; 

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
                {[
                    { href: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
                    { href: '/messaging', icon: 'bi-chat', label: 'Messaging' },
                    { href: '/tasks', icon: 'bi-list-check', label: 'Tasks' },
                    { href: '/customers', icon: 'bi-people', label: 'Customers' },
                    { href: '/agent-management', icon: 'bi-person-badge', label: 'Agent Management' },
                    { href: '/reports', icon: 'bi-bar-chart', label: 'Reports' },
                    { href: '/notifications', icon: 'bi-bell', label: 'Notifications' },
                ].map((item) => (
                    <li key={item.href} className="nav-item">
                        <Link href={item.href} className={`nav-link flex items-center p-2 rounded-md text-sm ${isActive(item.href) ? 'bg-[#3EBF0F] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                            <i className={`bi ${item.icon} mr-3 text-base`}></i> {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <ul className="flex flex-col space-y-1 mt-5">
                {[
                    { href: '/invite', icon: 'bi-person-plus', label: 'Invite Members' },
                    { href: '/settings', icon: 'bi-gear', label: 'Settings' },
                    { href: '/help-support', icon: 'bi-question-circle', label: 'Help and Support' },
                ].map((item) => (
                    <li key={item.href} className="nav-item">
                        <Link href={item.href} className="nav-link flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm">
                            <i className={`bi ${item.icon} mr-3 text-base`}></i> {item.label}
                        </Link>
                    </li>
                ))}
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
