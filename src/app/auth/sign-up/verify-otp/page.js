'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Footer from '@/app/components/Footer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import { toast } from 'react-toastify';


const EmailConfirmation = () => {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [activeInput, setActiveInput] = useState(0);
    const [userData, setUserData] = useState(null);
    const [timer, setTimer] = useState(59);
    const [errorMessage, setErrorMessage] = useState(null);
    const { axiosInstance, loading } = useApi();
    const { handleApiError } = useError();
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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            try {
                const response = await axiosInstance.post(`/auth/create-account/verify-otp/`, {
                    email: userData.email,
                    otp: verificationCode
                });
                if (response.data.success) {
                    router.push("create-password");
                } else {
                    toast.error((response.data.message || "Failed to resend OTP. Please try again."))
                }
            } catch (error) {
                setCode(['', '', '', '', '', '']);
                handleApiError(error)
            }
        } else {
            toast.dark("Please enter a 6-digit code.");
        }
    };

    const handleResendCode = async () => {
        if (timer === 0 && userData?.email) {
            try {
                const response = await axiosInstance.post(
                    '/auth/create-account/send-otp/',
                    { email: userData.email }
                );
                if (response.data.success) {
                    setTimer(59);
                } else {
                    toast.error((response.data.message || "Failed to resend OTP. Please try again."))
                }
            } catch (error) {
                handleApiError(error);
            }
        }
    };

    return (
        <div className="flex min-h-screen" style={{ height: '100%', overflow: 'hidden' }}>
            <div className="md:w-1/2 flex flex-col">
                <div className="flex-grow">
                    <img
                        src="/assets/sign-up-home-screen-image.png"
                        alt="Create Password"
                        className="h-full w-full object-cover"
                        style={{ height: 500 }}
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

            <div className="w-1/2 flex flex-col items-center justify-center p-8">
                <div className='w-full max-w-md mt-[150px]'>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-left mb-2">
                        Confirm email address
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-left mb-8">
                        Please enter the 6 digit code we sent to <br /> {userData?.email ? maskEmail(userData.email) : "your email"}
                    </p>

                    <div className="flex mb-6 mt-8" onPaste={handlePaste}>
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

                    
                    <div className='mt-5 w-fit d-flex'>
                        <button
                            onClick={handleSubmit}
                            className={`w-full bg-[#3EBF0F] mt-5  text-white py-2 rounded-md hover:bg-[#34a60e] focus:outline-none ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            style={{ width: 300 }}
                            disabled={loading}
                        >
                            Continue
                        </button>

                        <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
                            {timer > 0 ? <span className='font-bold'>Resend code in {formatTime(timer)}</span> : <span onClick={handleResendCode} className="text-blue-500 cursor-pointer">Resend now</span>}
                        </p>
                    </div>
                </div>

                <div style={{ width: 500 }} className="text-xs mt-auto pt-6">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
