"use client";

import React, { useState } from 'react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword && passwordStrength >= 3) {
            console.log('Passwords match and are strong enough!');
        } else {
            console.log('Passwords do not match or are not strong enough.');
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 1:
            case 2:
                return 'bg-red-500'; 
            case 3:
            case 4:
                return 'bg-yellow-500'; 
            case 5:
                return 'bg-green-500'; 
            default:
                return 'bg-gray-300'; 
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
            <div className="mb-6">
                <img src={'../../assets/logo.png'} alt="Native Talk Logo" className="h-10" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset your password</h2>
            <p className="text-gray-600 mb-6 text-center">
                Set your new password with a minimum of 8 characters with a combination of letters and numbers
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password *</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-green-500"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <div className="flex mt-2 space-x-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 flex-1 rounded ${index < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1">Confirm Password *</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${password === confirmPassword ? 'focus:border-green-500' : 'focus:border-red-500'}`}
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
                >
                    Proceed
                </button>
            </form>

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

export default ResetPassword;
