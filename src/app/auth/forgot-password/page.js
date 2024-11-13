"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ForgotPassword = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({});
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const parsedData = sessionStorage.getItem('resetPwdData');
        if (parsedData) {
            setUserData(JSON.parse(parsedData));
        } else {
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
        if (value.length <= 24) {
            setPassword(value);
            setPasswordStrength(evaluatePasswordStrength(value));
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordError('');
    };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.post('http://staging.core.nativetalkcrm.com/api/auth/forgot-password/change-password/', {
                email: userData.email,
                new_password: password
            });
            setIsSubmitting(false);
            router.push('/auth/success-page');
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error changing password:", error);
            setPasswordError("Failed to change password. Please try again.");
        }
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

    const isFormValid = password.length >= 8 && password.length <= 24 && confirmPassword.length >= 8;

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-8">
            <div className="w-full max-w-md text-center">
                <div className="flex justify-center mb-4">
                    <img src='/assets/logo.png' alt="Logo" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Reset your password</h2>
                <p className="text-gray-500 mb-6">
                Set your new password with minimum 8 characters with a combination of letters and numbers
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
                    {isSubmitting ? "Processing..." : "Proceed"}
                </button>
            </div>

            <p className="text-xs text-gray-400 mt-6 pt-6">
                © 2024 NativeTalk Technologies. All rights reserved. 
                <a href="#" className="text-[#111827] hover:underline">Terms & Conditions</a> | 
                <a href="#" className="text-[#111827] hover:underline">Privacy Policy</a>
            </p>
        </div>
    );
};

export default ForgotPassword;
