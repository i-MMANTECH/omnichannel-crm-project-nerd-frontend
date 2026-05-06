"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import NProgress from '@/services/nprogressConfig';
import { toast } from 'react-toastify';


const PasswordCreation = () => {
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('signUpData');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        } 
        else {
            router.push('/auth/sign-up');
        }
    }, [router]);

    const evaluatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
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

    useEffect(() => {
        const storedData = sessionStorage.getItem('signUpData');
        if (storedData) {
            setUserData({ ...JSON.parse(storedData), password });
        }
    }, [password]);

    const isPasswordValid = (password) => {
        const lengthValid = password.length >= 8 && password.length <= 24;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSymbol = /[\W_]/.test(password);
        return lengthValid && hasUppercase && hasLowercase && hasDigit && hasSymbol;
    };

    const handleSubmit = () => {
        NProgress.setColor('green');    
        NProgress.start();            

        if (!isPasswordValid(password)) {
            NProgress.setColor('red');
            toast.error("Password must be 8-24 characters, include uppercase, lowercase, digit, and symbol.");
            NProgress.done();
            return;
        }

        if (password !== confirmPassword) {
            NProgress.setColor('red');
            toast.error("Passwords do not match.");
            NProgress.done();
            return;
        }

        sessionStorage.setItem('signUpData', JSON.stringify({ ...userData, password }));        
        router.push('custom-url');
        NProgress.done();
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

    const isFormValid = isPasswordValid(password) && password === confirmPassword;

    return (
        <div className="flex min-h-screen flex-col overflow-y-auto lg:flex-row">
            <div className="hidden flex-col md:flex md:min-h-[360px] md:w-full lg:min-h-screen lg:w-1/2">
                <div className="min-h-[220px] flex-grow lg:min-h-0">
                        <img
                            src="/assets/sign-up-image.png"
                            alt="Sign up"
                            className="h-full min-h-[220px] w-full object-cover lg:min-h-0"
                        />
                </div>
                
                <div style={{ height: '4px', backgroundColor: '#3EBF0F' }}></div>
                
                <div className="flex flex-col items-start bg-black p-5 text-white sm:p-6 lg:p-8">
                    <Image src="/assets/nativetalk-logo2.svg" 
                            alt="Logo" 
                            width={100}
                            height={100}
                            />
                    <h2 className="mt-4 text-2xl font-bold leading-tight text-white lg:text-3xl">
                        Let's empower your <br /> employees today.
                    </h2>
                    <p className="text-white mt-2">Transform every conversation into opportunity.</p>
                </div>
            </div>

            <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 sm:px-6 md:min-h-0 lg:min-h-screen lg:w-1/2 lg:p-8">
                <div className="w-full max-w-md lg:mt-[100px]">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-left mb-2">Create Your Password</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-left mb-6">
                        Set a password with 8-24 characters, including uppercase, lowercase, numbers, and symbols.
                    </p>

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full rounded-md border border-gray-300 p-2.5 pr-10 focus:border-[#3EBF0F] focus:outline-none sm:p-2 sm:pr-10"
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
                                className={`w-full rounded-md border border-gray-300 p-2.5 pr-10 focus:outline-none sm:p-2 sm:pr-10 ${password === confirmPassword ? 'focus:border-[#3EBF0F]' : 'focus:border-red-500'}`}
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
                        className={`mt-5 w-full rounded-md py-2.5 text-white hover:bg-[#34a60e] focus:outline-none sm:py-2 ${isFormValid ? 'bg-[#3EBF0F]' : 'bg-gray-300 cursor-not-allowed'}`}
                        disabled={!isFormValid}
                    >
                        Continue
                    </button>
                </div>
                <div className="mt-auto w-full max-w-[500px] pt-6 text-xs">
                    <Footer />
                </div>
            </div>      
        </div>
    );
};

export default PasswordCreation;
