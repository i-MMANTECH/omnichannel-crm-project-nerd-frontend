'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import { toast } from 'react-toastify';
import { formatTime } from '@/utils/timeUtils';
import Image from 'next/image';


const OtpVerification = () => {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [activeInput, setActiveInput] = useState(0);
    const [userData, setUserData] = useState(null);
    const [timer, setTimer] = useState(59);
    const { axiosInstance, loading } = useApi();
    const { handleApiError } = useError();
    const inputRefs = useRef([]);

    useEffect(() => {
        const parsedData = sessionStorage.getItem('resetPwdData');
        if (parsedData) {
            setUserData(JSON.parse(parsedData));
        } 
        else {
            router.push('/auth/sign-in');
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
            try {
                const response = await axiosInstance.post(`/auth/forgot-password/verify-otp/`, {
                    email: userData.email,
                    otp: verificationCode
                });
                if (response.data.status ) {
                    router.push("reset-password");
                } else {
                    setCode(['', '', '', '', '', '']);
                    toast.error(response.data.message);
                }
            } catch (error) {
                setCode(['', '', '', '', '', '']);
                handleApiError(error)
            }
        } else {
            toast.error("Please enter a 6-digit code.");
        }
    };
    

    const handleResendCode = async () => {
        if (timer === 0 && userData?.email) {
            try {
                const response = await axiosInstance.post('/auth/forgot-password/send-otp/',
                    { email: userData.email }
                );
                if (response.data.success) {
                    setTimer(59);
                } else {
                    toast.error(response.data.message || "Failed to resend OTP. Please try again.");
                }
            } catch (error) {
                handleApiError(error);
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:px-6">
            <div className="w-full max-w-sm p-4 sm:p-8 lg:mt-[100px]">
                <div className="flex justify-center mb-8">
                    <Image src="/assets/nativetalk-logo.svg" 
                            alt="Logo" 
                            width={100}
                            height={100}
                            />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center dark:text-gray-200  mb-2">
                    Confirm email address
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                    Please enter the 6-digit code we sent to <br /> {userData?.email ? maskEmail(userData.email) : "your email"}
                </p>

                <div className="mt-8 mb-6 flex justify-between gap-2" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            value={digit}
                            maxLength={1}
                            ref={(el) => inputRefs.current[index] = el}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className={`h-10 w-9 rounded-md border-2 text-center text-lg sm:w-10 ${activeInput === index ? 'border-green-500' : 'border-gray-300'} focus:outline-none`}
                            aria-label="OTP input"
                        />
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className={`mt-5 w-full rounded-md bg-[#3EBF0F] py-2.5 text-white hover:bg-[#34a60e] focus:outline-none sm:py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    Continue
                </button>

                <p className="text-center text-gray-500 mt-4">
                    {timer > 0 ? <span>Resend code in <span className='font-bold'>{formatTime(timer)}</span></span> : <span onClick={handleResendCode} className="text-blue-500 cursor-pointer">Resend now</span>}
                </p>

            </div>
            <div className="mt-auto w-full max-w-[500px] px-4 text-center text-xs sm:px-0">
                <Footer />
            </div>
        </div>
    );
};

export default OtpVerification;
