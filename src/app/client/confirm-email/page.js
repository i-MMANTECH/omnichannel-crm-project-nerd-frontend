"use client";

import React, { useState } from 'react';

const ConfirmEmail = () => {
    const [code, setCode] = useState(new Array(6).fill(""));

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("OTP Code entered:", code.join(""));
    };

    const handleResend = () => {
        console.log("Resend code");
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
            <div className="mb-6">
                <img src={'../../assets/logo.png'} alt="Native Talk Logo" className="h-10" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm email address</h2>
            <p className="text-gray-600 mb-6 text-center">
                Please enter the 6-digit code we sent to <span className="font-semibold">demo***@framemail.com</span>
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-xs text-center">
                <div className="flex justify-center mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            name="otp"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            className="w-10 h-10 mx-1 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:border-green-500"
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
                >
                    Proceed
                </button>
            </form>

            <p className="text-gray-600 mt-4">
                Resend code in <span className="font-semibold">59:00</span>
            </p>
            <button onClick={handleResend} className="text-green-500 hover:underline mt-2">
                Resend Code
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

export default ConfirmEmail;
