"use client";

import React, { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email submitted:', email);
        // Add logic to handle OTP sending
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
            <div className="mb-6">
                <Image src="/assets/nativetalk-logo.svg" 
                            alt="Logo" 
                            width={100}
                            height={100}
                            />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Forgot password</h2>
            <p className="text-gray-600 mb-6 text-center">
                Enter your email address below. We'll send you an OTP.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full px-3 py-2 border border-green-500 rounded-md focus:outline-none focus:border-green-600"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
                >
                    Proceed
                </button>
            </form>

            <button
                className="mt-4 text-green-500 hover:underline"
                onClick={() => console.log('Back to login')}
            >
                Back to login
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

export default ForgotPassword;
