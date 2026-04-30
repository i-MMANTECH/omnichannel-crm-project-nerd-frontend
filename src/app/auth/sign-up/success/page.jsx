"use client";

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Footer from '../../../components/Footer';
import Image from 'next/image';


const SuccessPage = () => {
    const router = useRouter();
    const { login } = useContext(AuthContext);

    const handleGoToDashboard = () => {
        const stored = sessionStorage.getItem('signUpAuthPayload');
        if (!stored) {
            router.push('/auth/sign-in');
            return;
        }
        try {
            const payload = JSON.parse(stored);
            login(payload);
            sessionStorage.removeItem('signUpAuthPayload');
            router.push('/');
        } catch {
            sessionStorage.removeItem('signUpAuthPayload');
            router.push('/auth/sign-in');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="mb-8">
                    <Image src='/assets/nativetalk-logo.svg' alt="Logo"
                    width={100}
                    height={100}
                    />

            </div>

            <div className="relative top-7 mt-2">
                <Image src='/assets/checkmark.svg' alt="Success Checkmark"
                    width={150}
                    height={150}

                    />
            </div>

            <h2 className="text-3xl font-bold text-black dark:text-white leading-tight mb-2">Success!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">You have successfully created your account</p>

            <button
                onClick={handleGoToDashboard}
                className="bg-[#3EBF0F] hover:bg-green-600 text-white py-2 px-6 rounded-full shadow-lg"
            >
                Go to dashboard
            </button>

            <div className="absolute bottom-4 text-center">
                <Footer />
            </div>
        </div>
    );
};

export default SuccessPage;
