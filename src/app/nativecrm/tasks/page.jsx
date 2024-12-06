"use client";

import React, {useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Task from '../../components/Task/Task';

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div style={{ marginLeft: '50px', zIndex: 100 }} className="flex-1 flex flex-col border-l">
                <Navbar
                    title="Taks"
                    searchPlaceholder="Search"
                    onSearch={setSearchQuery}
                />
                <Task />
            </div>
        </div>
    );
};

export default Page;
