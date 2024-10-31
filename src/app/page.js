"use client";

import React, { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';

const Dashboard = () => {
    const { user } = useContext(AuthContext); 
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth/signIn');
        }
    }, [user, router]);

    if (!user) return null; 

    return (
        <div style={{ zIndex: 100, marginLeft: 240 }} className="flex min-h-screen bg-gray-100">
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
