"use client";

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/sidebar/Sidebar';
import Navbar from '@/app/components/navbar/Navbar';
import Grid from '@/app/pages/grid/Grid';

const Page = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user) {
            router.push('/auth/sign-in');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div style={{ marginLeft: '240px', zIndex: 100 }} className="flex-1 flex flex-col">
                <Navbar
                    title="Users"
                    searchPlaceholder="Search"
                    onSearch={setSearchQuery}
                />
                <Grid searchQuery={searchQuery} />
            </div>
        </div>
    );
};

export default Page;
