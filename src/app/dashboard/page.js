"use client";

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import Dashboard from '../components/dashboard/Dashboard';

const Page = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user) {
            router.push('/auth/sign-in');
        }
    }, [user, router]);

    if (!user) return <div>Loading...</div>; 

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-60">
                <Navbar
                    title="Dashboard"
                    searchPlaceholder="Search"
                    onSearch={setSearchQuery}
                />
               <Dashboard searchQuery={searchQuery}/>
            </div>
        </div>
    );
};

export default Page;
