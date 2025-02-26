"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


const Page = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (typeof window != 'undefined') {
            window.addEventListener('load', () => {    
                if (!isAuthenticated && !localStorage.getItem('user')) {
                    router.push('/auth/sign-in');
                } else if (localStorage.getItem('user') && isAuthenticated) {
                    router.push('/nativecrm');
                } else {
                    router.push('/auth/sign-in');
                }
            });
        } 
    }, [])

    useEffect(() => {
        if (isAuthenticated && localStorage.getItem('user')) {
            const timer = setTimeout(() => {
                router.push('/nativecrm');    
            }, 1000);
            return () => clearTimeout(timer);
        } else if (!isAuthenticated && !localStorage.getItem('user')) {
            router.push('/auth/sign-in');
        }
    }, [isAuthenticated])

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
        </div>
    );    
};

export default Page;
