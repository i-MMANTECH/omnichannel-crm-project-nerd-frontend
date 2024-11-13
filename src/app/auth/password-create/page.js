"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PasswordCreation = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userData, setUserData] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordError('');
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

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        sessionStorage.setItem('signUpData', JSON.stringify({ ...userData, password }));
        router.push('/auth/customUrlForm');
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
        <div style={{height: '100%'}} className="flex h-screen overflow-hidden">
            <div className="w-1/2 flex flex-col">
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

            <div className="w-1/2 flex flex-col justify-center items-center p-8 overflow-hidden">
                <div className="w-full max-w-md flex-grow mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-left mb-3 mt-6">Create Your Password</h2>
                    <p className="text-gray-500 text-left mb-6">
                        Set a password with at least 6 characters, combining letters and numbers.
                    </p>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
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
                                {showPassword ? '🙈' : '👁️'}
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
                        <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
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
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {passwordError && (
                        <p className="text-red-500 text-sm mb-4">
                            {passwordError}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        className={`w-full text-white py-2 rounded-md hover:bg-[#34a60e] focus:outline-none ${isFormValid ? 'bg-[#3EBF0F]' : 'bg-gray-300 cursor-not-allowed'}`}
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : "Continue"}
                    </button>
                </div>

                <div style={{ width: 500 }} className="text-center mt-auto pt-6">
                    <p className="text-xs text-gray-400 mt-6 pt-6">
                        © 2024 NativeTalk Technologies. All rights reserved. 
                        <a href="#" className="text-[#111827] hover:underline">Terms & Conditions</a> | 
                        <a href="#" className="text-[#111827] hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PasswordCreation;
