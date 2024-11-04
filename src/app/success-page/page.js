"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
    const router = useRouter();

    const handleGoToDashboard = () => {
        router.push('/'); 
        sessionStorage.removeItem('signUpData');
    };

    useEffect(() => {
        const storedData = sessionStorage.getItem('signUpData');
        if (!storedData) {
            router.push('/auth/sign-up');
        } 
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
            <div className="mb-6">
                <img src={'../../assets/logo.png'} alt="Native Talk Logo" className="h-8" />
            </div>

            <div className="mb-4">
                <img src={'../../assets/checkmark.png'} alt="Success Checkmark" className="" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Success!</h1>
            <p className="text-gray-600 mb-8">You have successfully created your account</p>

            <button
                onClick={handleGoToDashboard}
                className="bg-[#3EBF0F] hover:bg-green-600 text-white py-2 px-6 rounded-full shadow-lg"
            >
                Go to dashboard
            </button>

            <div className="absolute bottom-4 text-center">
                <p className="text-xs text-gray-400">
                    © 2024 NativeTalk Technologies. All rights reserved. 
                    <a href="#" className="text-gray-400 hover:underline ml-2">Terms & Conditions</a> 
                    <a href="#" className="text-gray-400 hover:underline ml-2">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default SuccessPage;
