"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const SignUp = () => {
    const router = useRouter();
    const [company_name, setcompany_name] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (!company_name || !email || !phone_number) {
            setError("Please fill in all fields");
            return;
        }
        try {
            const response = await axios.post(`http://staging.core.nativetalkcrm.com/api/auth/create-account/send-otp/`, {
                email: email
            });
            if (response.status === 200) {
                // Save company_name, email, and phone_number to session storage
                sessionStorage.setItem('signUpData', JSON.stringify({ company_name, email, phone_number }));
                router.push("/auth/emailConfirmation");
            } else {
                setError("Failed to send OTP. Please try again.");
            }
        } catch (err) {
            console.error("Error sending OTP:", err);
            setError("An error occurred. Please try again later.");
        }
    };

    const allFieldsFilled = company_name && email && phone_number;

    return (
        <div className="flex" style={{ height: "100vh" }}>
            <div className="w-1/2 flex flex-col">
                <div className="flex-grow">
                    <img
                        src="/assets/sign-up-home-screen-image.png"
                        alt="Create Password"
                        className="h-full w-full object-cover"
                        style={{ height: 360 }}
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

            <div className="w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 text-left mb-3">Welcome Back</h2>
                    <p className="text-gray-500 text-left mb-6">Enter your details to login.</p>
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="company_name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Company Name"
                                value={company_name}
                                onChange={(e) => setcompany_name(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Work Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="example@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <PhoneInput
                                country={'ng'}
                                value={phone_number}
                                onChange={setPhoneNumber}
                                inputClass="custom-phone-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                containerClass="custom-phone-container w-full"
                                placeholder="(123) 456-7890"
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            type="submit"
                            className={`w-full text-white py-2 rounded-md focus:outline-none ${allFieldsFilled ? 'bg-[#3EBF0F] hover:bg-green-700' : 'bg-[#EEEFF2]'}`}
                            disabled={!allFieldsFilled}
                        >
                            Continue
                        </button>

                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-4 text-gray-400">OR</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <button
                            type="button"
                            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 focus:outline-none flex items-center justify-center"
                        >
                            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="mr-2" />
                            Sign up with Google
                        </button>
                    </form>
                    <div className="text-left mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account? <a href="sign-in" className="text-green-500 hover:underline">Login Here</a>
                        </p>
                    </div>
                    <div style={{width: 500}} className="text- mt-6">
                        <p className="text-xs text-gray-400">
                            © 2024 NativeTalk Technologies. All rights reserved. <a href="#" className="text-[#111827] hover:underline">Terms & Conditions</a> | <a href="#" className="text-[#111827] hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
