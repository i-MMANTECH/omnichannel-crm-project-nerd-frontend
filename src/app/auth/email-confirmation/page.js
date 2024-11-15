'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const EmailConfirmation = () => {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [activeInput, setActiveInput] = useState(0);
    const [userData, setUserData] = useState(null);
    const [timer, setTimer] = useState(59);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        const storedData = sessionStorage.getItem('signUpData');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        } else {
            router.push('/auth/sign-up');
        }
    }, [router]);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(countdown);
        }
    }, [timer]);

    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@');
        return `${localPart.slice(0, 3)}${'*'.repeat(localPart.length - 3)}@${domain}`;
    };

    const handleChange = (value, index) => {
        if (/^\d$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (index < code.length - 1) {
                setActiveInput(index + 1);
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('Text').slice(0, 6);
        if (/^\d{6}$/.test(pasteData)) {
            setCode(pasteData.split(''));
            inputRefs.current[5].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (code[index] === '' && index > 0) {
                setActiveInput(index - 1);
                inputRefs.current[index - 1].focus();
            } else {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };

    const handleSubmit = async () => {
        const verificationCode = code.join('');
        if (verificationCode.length === 6 && userData?.email) {
            setIsSubmitting(true);
            try {
                const response = await axios.post(`https://staging.core.nativetalkcrm.com/api/auth/create-account/verify-otp/`, {
                    email: userData.email,
                    otp: verificationCode
                });
                if (response.data.success) {
                    router.push("/auth/password-create");
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                setCode(['', '', '', '', '', '']);
                setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
            } finally {
                setIsSubmitting(false); 
            }
        } else {
            setErrorMessage("Please enter a 6-digit code.");
        }
    };

    const handleResendCode = async () => {
        if (timer === 0 && userData?.email) {
            try {
                const response = await axios.post(
                    'http://staging.core.nativetalkcrm.com/api/auth/create-account/send-otp/',
                    { email: userData.email }
                );
                if (response.data.success) {
                    setTimer(59);
                    setErrorMessage(null);
                } else {
                    setErrorMessage(response.data.message || "Failed to resend OTP. Please try again.");
                }
            } catch (error) {
                setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col md:flex-row" style={{ height: "100%" }}>
            <div className="md:w-1/2 flex flex-col">
                <div className="flex-grow">
                    <img
                        src="/assets/sign-up-home-screen-image.png"
                        alt="Create Password"
                        className="h-full w-full object-cover"
                        style={{ height: 380 }}
                    />
                </div>
                <div style={{ height: '4px', backgroundColor: '#3EBF0F' }}></div>
                <div className="bg-black p-8 text-white flex flex-col items-start">
                    <img src='/assets/logo.png' alt="Logo" />
                    <h2 className="text-3xl font-bold text-white leading-tight mt-4">
                        Let's empower your <br /> employees today.
                    </h2>
                    <p className="text-white mt-2">Transform every conversation into opportunity.</p>
                </div>
            </div>

            <div style={{ marginTop: '100px' }} className="md:w-1/2 w-full flex flex-col items-center justify-center mt-6 pt-6 p-8">
                <h2 className="text-2xl font-bold text-left text-gray-800 mt-6 mb-2">
                    Confirm email address
                </h2>
                <p className="text-left text-gray-600 mb-6">
                    Please enter the 6 digit code we sent to <br /> {userData?.email ? maskEmail(userData.email) : "your email"}
                </p>

                <div className="flex justify-center mb-6" onPaste={handlePaste}>
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
                            aria-label="OTP input"
                        />
                    ))}
                </div>

                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                <button
                    onClick={handleSubmit}
                    className={`w-full bg-[#3EBF0F] text-white py-2 rounded-md hover:bg-[#34a60e] focus:outline-none ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ width: 300 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Continue'}
                </button>

                <p className="text-center text-gray-500 mt-4">
                    Resend code in {timer > 0 ? timer : <span onClick={handleResendCode} className="text-blue-500 cursor-pointer">Resend now</span>}
                </p>

                <div className="text-center mt-auto">
                    <p className="text-xs text-gray-400">
                        © 2024 NativeTalk Technologies. All rights reserved. <a href="#" className="text-[#111827] hover:underline">Terms & Conditions</a> | <a href="#" className="text-[#111827] hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
