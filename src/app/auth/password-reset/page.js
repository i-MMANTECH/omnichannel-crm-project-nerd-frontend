'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import { toast } from 'react-toastify';
import Footer from '@/app/components/Footer';

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
        <div style={{ height: '100%', overflow: 'hidden' }} className="flex min-h-screen flex-col items-center justify-center">
            <div className="flex items-center justify-center mt-[100px]">
                <div className="w-full max-w-md p-8">
                    <div className="flex justify-center mb-8">
                        <img src="../../assets/logo.png" alt="Logo" />
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-[#3EBF0F] focus:border-[#3EBF0F] sm:text-sm"
                            placeholder="mycompany@email.com"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className={`w-full mt-5 bg-[#3EBF0F] text-white py-2 rounded-md hover:bg-[#34a60e] focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        Proceed
                    </button>

                    <div className="text-center mt-5">
                        <a href="/auth/sign-in" className="text-[#3EBF0F] hover:underline">
                            Back to login
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-auto text-center mb-5">
                <Footer />
            </div>
        </div>
    );
};

export default PasswordReset;
