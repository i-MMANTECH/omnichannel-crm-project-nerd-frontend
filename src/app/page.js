"use client";

import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Page = () => {
    const { user } = useContext(AuthContext); 
    const router = useRouter();
 

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        } else {
            router.push('/auth/sign-in');
        }
    }, [user, router]);

    return null;
};

export default Page;
