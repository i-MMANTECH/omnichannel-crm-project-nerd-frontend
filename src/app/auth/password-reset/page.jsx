'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import { toast } from 'react-toastify';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

const PasswordReset = () => {
    const router = useRouter();
    const { axiosInstance, loading } = useApi();
    const { handleApiError } = useError();
    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async () => {
        if (email) {
            try {
                const response = await axiosInstance.post('/auth/forgot-password/send-otp/', {
                    email: email
                });

                if (response.data.success) {
                    sessionStorage.setItem('resetPwdData', JSON.stringify({ email }));
                    router.push("password-reset/verify-otp");
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                handleApiError(error);
            }
        } else {
            toast.error("Please enter your email address.");
        }
    };


    return (
        <div className="flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:px-6">
            <div className="flex w-full items-center justify-center lg:mt-[100px]">
                <div className="w-full max-w-md p-4 sm:p-8">
                    <div className="flex justify-center mb-8">
                        <Image src="/assets/nativetalk-logo.svg"
                            alt="Logo"
                            width={100}
                            height={100}
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center dark:text-gray-200  mb-2">
                        Forgot Password
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                        Enter your email address below, we'll send you an OTP
                    </p>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-[#3EBF0F] focus:outline-none focus:ring-[#3EBF0F] dark:border-gray-600 dark:text-gray-300 sm:py-2 sm:text-sm"
                            placeholder="mycompany@email.com"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className={`mt-5 w-full rounded-md bg-[#3EBF0F] py-2.5 text-white hover:bg-[#34a60e] focus:outline-none sm:py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        Proceed
                    </button>

                    <div className="text-center mt-5">
                        <Link href="/auth/sign-in" className="text-[#3EBF0F] hover:underline">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full max-w-[500px] px-4 text-center text-xs sm:px-0">
                <Footer />
            </div>
        </div>
    );
};

export default PasswordReset;
