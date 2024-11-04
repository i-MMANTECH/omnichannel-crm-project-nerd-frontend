"use client";

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import UserTable from '../pages.js/userTable/UserTable';

const UsersPage = () => {
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
                    <UserTable searchQuery={searchQuery} />
            </div>
        </div>
    );
};

export default UsersPage;
