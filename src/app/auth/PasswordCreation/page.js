"use client";

import React, { useState } from 'react';

const PasswordCreation = () => {
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

    const handleSubmit = () => {
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
        <div className="min-h-screen flex flex-col justify-between items-center bg-white p-6">
            <div className="max-w-sm bg-white p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Create your password
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Set your password with a minimum of 8 characters with a combination of letters and numbers.
                </p>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border-2 rounded-md focus:outline-none focus:border-green-500"
                        />
                        <button
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 px-3 text-gray-600"
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

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`w-full p-2 border-2 rounded-md focus:outline-none ${password === confirmPassword ? 'focus:border-green-500' : 'focus:border-red-500'}`}
                        />
                        <button
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 px-3 text-gray-600"
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none"
                >
                    Continue
                </button>
            </div>

            <div className="text-center mt-8">
                <p className="text-xs text-gray-400">
                    © 2024 NativeTalk Technologies. All rights reserved. 
                    <a href="#" className="text-gray-400 hover:underline ml-2">Terms & Conditions</a> 
                    <a href="#" className="text-gray-400 hover:underline ml-2">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default PasswordCreation;
