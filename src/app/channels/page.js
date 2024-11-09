"use client";

import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { MainContainer } from '../components/MainContainer/MainContainer';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';

const Page = () => {
    const { user } = useContext(AuthContext); 
    const router = useRouter();
  

    useEffect(() => {
        if (!user) {
            router.push('/auth/sign-in');
        }
    }, [user, router]);

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-hidden border-l">
        <Sidebar />
        <div style={{ marginLeft: '240px', zIndex: 100 }} className="flex-1 flex flex-col overflow-x-hidden">
            <Navbar title="Messages" searchPlaceholder="Search" />
            <MainContainer />
        </div>
    </div>
    
    );
};

export default Page;
