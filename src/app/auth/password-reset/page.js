'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const PasswordReset = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async () => {
        if (email) {
            setIsSubmitting(true);
            try {
                const response = await axios.post('http://staging.core.nativetalkcrm.com/api/auth/forgot-password/send-otp/', {
                    email: email
                });
    
                if (response.data.success) {
                    sessionStorage.setItem('resetPwdData', JSON.stringify({ email }));
                    router.push("/auth/otp-verification");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrorMessage("Please enter your email address.");
        }
    };
    

    return (
        <div style={{ height: '100vh' }} className="flex min-h-screen flex-col items-center justify-center bg-white">
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md p-8 bg-white">
                    <div className="flex justify-center mb-4">
                        <img src="../../assets/logo.png" alt="Logo" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                        Forgot Password
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Enter your email address below, we'll send you an OTP
                    </p>

                    <div className="mb-4">
                        <input
                            type="email"
                            value={email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 text-lg focus:outline-none focus:ring focus:ring-[#3EBF0F]"
                            placeholder="Email Address"
                        />
                    </div>

                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                    <button
                        onClick={handleSubmit}
                        className={`w-full bg-[#3EBF0F] text-white py-2 rounded-md hover:bg-[#34a60e] focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Proceed'}
                    </button>

                    <div className="text-center mt-4">
                        <a href="/auth/sign-in" className="text-[#3EBF0F] hover:underline">
                            Back to login
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-auto text-center">
                <p className="text-xs text-gray-400">
                    © 2024 NativeTalk Technologies. All rights reserved.
                    <a href="#" className="text-[#111827] hover:underline"> Terms & Conditions</a> | 
                    <a href="#" className="text-[#111827] hover:underline"> Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default PasswordReset;
