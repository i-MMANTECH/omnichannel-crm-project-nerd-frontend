"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EmailConfirmation = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [activeInput, setActiveInput] = useState(0);
    const [userData, setUserData] = useState(null);
    const [timer, setTimer] = useState(59);
    const inputRefs = useRef([]);

    useEffect(() => {
        const storedData = sessionStorage.getItem('signUpData');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [timer]);

    useEffect(() => {
        if (inputRefs.current[activeInput]) {
            inputRefs.current[activeInput].focus();
        }
    }, [activeInput]);

    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = localPart.slice(0, 3) + '*'.repeat(localPart.length - 3);
        return `${maskedLocalPart}@${domain}`;
    };

    const handleChange = (value, index) => {
        if (/^\d$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (index < code.length - 1 && value) {
                setActiveInput(index + 1);
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            setActiveInput(index - 1);
        }
    };

    const handleSubmit = async () => {
        const verificationCode = code.join('');
        
        if (verificationCode.length === 6) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/companies/create-account/register/`, {
                    ...userData,
                    verificationCode
                });

                console.log("User registration successful:", response.data);
            } catch (error) {
                console.error("Error verifying email:", error.response || error);
            }
        } else {
            console.log("Please enter a 6-digit code");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
            <div className="flex flex-col items-center" style={{ margin: 'auto' }}>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Confirm email address
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Please enter the 6 digit code we sent to <br /> {userData?.workEmail ? maskEmail(userData.workEmail) : "your email"}
                </p>
                
                <div className="flex justify-center mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            value={digit}
                            maxLength={1}
                            ref={(el) => inputRefs.current[index] = el}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className={`w-10 h-10 border-2 rounded-md text-center text-lg mx-1 ${
                                activeInput === index ? 'border-green-500' : 'border-gray-300'
                            } focus:outline-none`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-[#3EBF0F] text-white py-2 rounded-md hover:bg-[#34a60e] focus:outline-none"
                >
                    Continue
                </button>

                <p className="text-center text-gray-500 mt-4">
                    Resend code in {timer > 0 ? timer : "0"} seconds
                </p>
            </div>

            {/* Footer Section - Moved to Bottom */}
            <div style={{ width: 500 }} className="text-center mt-auto">
                <p className="text-xs text-gray-400">
                    © 2024 NativeTalk Technologies. All rights reserved. <a href="#" className="text-[#111827] hover:underline">Terms & Conditions</a> | <a href="#" className="text-[#111827] hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default EmailConfirmation;
