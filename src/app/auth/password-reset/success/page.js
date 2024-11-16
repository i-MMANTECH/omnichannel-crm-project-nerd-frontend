"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Footer from '@/app/components/Footer';


const SuccessPage = () => {
    const router = useRouter();

    const goToLogin = () => {
        router.push('/auth/sign-in');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="mb-8">
                <img src={'../../assets/logo.png'} alt="Native Talk Logo" className="h-8" />
            </div>

            <div className="relative top-7 mt-2">
                <img src={'../../assets/checkmark.png'} alt="Success Checkmark" className="" />
            </div>

            <h2 className="text-3xl font-bold text-black dark:text-white leading-tight mb-2">Success!</h2>            
            <p className="text-gray-500 dark:text-gray-400 mb-8">Your password has been changed successfully</p>

            <button
                onClick={goToLogin}
                className="bg-[#3EBF0F] hover:bg-green-600 text-white py-2 px-6 rounded-full shadow-lg"
            >
                Back to login
            </button>

            <div className="absolute bottom-4 text-center">
                <Footer />
            </div>
        </div>
        
    );
};

export default SuccessPage;
