"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import NProgress from '@/services/nprogressConfig';
import { toast } from 'react-toastify';


const Invitation = () => {
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const { id } = useParams();

    useEffect(() => {
        const checkAndAcceptInvitation = async () => {
            try {
                const resp = await axiosInstance.get(`/users/invitations/accept/${id}`)
                setEmail(resp.data.email)
            } catch(error) {
                handleApiError(error)
            }
        }

        checkAndAcceptInvitation()
    }, [setEmail, handleApiError]);

    const handleSubmit = async () => {
        try {
            const resp = await axiosInstance.post(`/users/invitations/register/${id}/`, {
                password,
                phone_number: phoneNumber
            })
            router.push(`${id}/success`);
        } catch(error) {
            handleApiError(error)
        }  
    };

    const evaluatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[\W_]/.test(password)) strength += 1;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordStrength(evaluatePasswordStrength(value));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 1:
            case 2:
                return 'text-red-500';
            case 3:
            case 4:
                return 'text-yellow-500';
            case 5:
                return 'text-green-500';
            default:
                return 'text-gray-300';
        }
    };

    const getPasswordStrengthLabel = () => {
        switch (passwordStrength) {
            case 1:
            case 2:
                return 'Weak';
            case 3:
            case 4:
                return 'Moderate';
            case 5:
                return 'Strong';
            default:
                return '';
        }
    };

    const isFormValid = password.length >= 6 && confirmPassword.length >= 6;

    return (
        <div className="flex min-h-screen" style={{ height: '100%', overflow: 'hidden' }}>
            <div className="w-1/2 flex flex-col">
                <div className="flex-grow">
                        <img
                            src="/assets/sign-up-image.png"
                            alt="Sign up"
                            className="object-cover w-full h-full"
                            style={{height: 542}}
                        />
                </div>
                
                <div style={{ height: '4px', backgroundColor: '#3EBF0F' }}></div>
                
                <div className="bg-black p-8 text-white flex flex-col items-start">
                    <Image src="/assets/nativetalk-logo2.svg" 
                            alt="Logo" 
                            width={100}
                            height={100}
                            />
                    <h2 className="text-3xl font-bold text-white leading-tight mt-4">
                        Let's empower your <br /> employees today.
                    </h2>
                    <p className="text-white mt-2">Transform every conversation into opportunity.</p>
                </div>
            </div>

            <div className="w-1/2 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-md flex-grow mt-6 mt-[100px]">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-left mb-2">Create Your Password</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-left mb-6">Set a password with at least 6 characters, combining letters and numbers.</p>

                    <div className="mb-4">
                            <label htmlFor="email"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Work Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="example@company.com"
                                value={email}
                                disabled
                                required
                            />
                    </div>
                    <div className="mb-4">
                            <label htmlFor="phone"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number
                            </label>
                            <input
                                type="phone"
                                id="phone"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="+2348038242844"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#3EBF0F]"
                            />
                            <button
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 px-3 text-gray-600"
                            >
                                <Image
                                    src={showPassword ? "/assets/show-password.svg" : "/assets/hide-password.svg"}
                                    alt="Show Password"
                                    width={24}
                                    height={24}
                                    />
                            </button>
                        </div>
                        <div className="flex items-center mt-2 space-x-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1 flex-1 rounded ${index < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-300'}`}
                                />
                            ))}
                            <span className={`ml-2 text-sm font-semibold ${getPasswordStrengthColor()}`}>
                                {getPasswordStrengthLabel()}
                            </span>
                        </div>
                        {password.length > 0 && (
                            <p className="text-gray-500 text-xs">
                                Minimum password length is 6 characters and maximum is 24 characters.
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirm_password" className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                            Confirm <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none ${password === confirmPassword ? 'focus:border-[#3EBF0F]' : 'focus:border-red-500'}`}
                            />
                            <button
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 px-3 text-gray-600"
                            >
                                <Image
                                    src={showConfirmPassword ? "/assets/show-password.svg" : "/assets/hide-password.svg"}
                                    alt="Show Password"
                                    width={24}
                                    
                                    height={24}
                                    />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className={`w-full text-white mt-5 py-2 rounded-md hover:bg-[#34a60e] focus:outline-none ${isFormValid ? 'bg-[#3EBF0F]' : 'bg-gray-300 cursor-not-allowed'}`}
                        disabled={!isFormValid}
                    >
                        Continue
                    </button>
                </div>
                <div style={{ width: 500 }} className="text-xs mt-auto pt-6">
                    <Footer />
                </div>
            </div>      
        </div>
    );
};

export default Invitation;
