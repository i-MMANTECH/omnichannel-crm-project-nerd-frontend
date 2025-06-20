"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


const Page = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const getUserFromStorage = () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        if (typeof window != 'undefined') {
            window.addEventListener('load', () => {    
                const user = getUserFromStorage();

                if (!isAuthenticated && !user) {
                    router.push('/auth/sign-in');
                } else if (user && isAuthenticated) {
                    const isAdmin = user.roles?.includes("Admin") || user.roles?.includes("admin");
                    router.push(isAdmin ? '/admin' : '/nativecrm');
                    return;
                } else {
                    router.push('/auth/sign-in');
                }
            });
        } 
    }, [])

    useEffect(() => {
        const user = getUserFromStorage();

        if (isAuthenticated && user) {
            const timer = setTimeout(() => {
                router.push('/nativecrm');   
                const isAdmin = user.roles?.includes("Admin") || user.roles?.includes("admin");
                router.push(isAdmin ? '/admin' : '/nativecrm');
                return;
            }, 1000);
            return () => clearTimeout(timer);
        } else if (!isAuthenticated && !user) {
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
