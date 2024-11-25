"use client";

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Messages } from '../../components/Message/Messages';

const Page = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");



    return (
        <div className="flex min-h-screen bg-gray-100">
            <div style={{ marginLeft: '240px', zIndex: 100, backgroundColor: 'white' }} className="flex-1 flex flex-col border-l">
            <Messages />
            </div>
        </div>
    );
};

export default Page;
