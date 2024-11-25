"use client";

import React, { useState } from 'react';
import Sidebar from '@/app/components/sidebar/Sidebar';
import Navbar from '@/app/components/navbar/Navbar';
import CustomerGrid from '@/app/components/CustomerGrid/CustomerGrid';

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");

  

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div style={{ marginLeft: '240px', zIndex: 100 }} className="flex-1 flex flex-col">
                <Navbar
                    title="Users"
                    searchPlaceholder="Search"
                    onSearch={setSearchQuery}
                />
                <CustomerGrid searchQuery={searchQuery} />
            </div>
        </div>
    );
};

export default Page;
