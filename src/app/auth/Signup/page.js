"use client";

import React, { useState } from 'react';

const SignUp = () => {
    const [companyName, setCompanyName] = useState('');
    const [workEmail, setWorkEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSignUp = (event) => {
        event.preventDefault();
        console.log({ companyName, workEmail, phoneNumber });
    };

    const allFieldsFilled = companyName && workEmail && phoneNumber;

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 bg-gray-100 relative overflow-hidden">
                <img 
                    src={'../../assets/sign-up-home-screen-image.png'} 
                    alt="Sign Up" 
                    className="min-h-full w-full object-cover" 
                />
                <div className="absolute bottom-0 left-0 w-full bg-black p-4 text-white z-10">
                <img src='../../assets/logo.png'/>
                    <h2 className="text-3xl font-bold text-white leading-tight">
                        Let's empower your <br />employees today.
                    </h2>
                    <p className="text-white mt-2">Descriptive text goes here.</p>
                </div>
            </div>

            <div className="w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Manage your employees easily!</h2>
                    <p className="text-gray-500 text-center mb-6">Get started for free today!</p>
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                Company Name
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Full"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="workEmail" className="block text-sm font-medium text-gray-700">
                                Work Email
                            </label>
                            <input
                                type="email"
                                id="workEmail"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="example@company.com"
                                value={workEmail}
                                onChange={(e) => setWorkEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="(123) 456-7890"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full text-white py-2 rounded-md focus:outline-none ${allFieldsFilled ? 'bg-[#3EBF0F] hover:bg-green-700' : 'bg-[#EEEFF2]'}`} // Button color set to #3EBF0F
                            disabled={!allFieldsFilled}
                        >
                            Continue
                        </button>

                        <div className="text-center my-4">
                            <span className="text-gray-400">OR</span>
                        </div>
                        <button
                            type="button"
                            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 focus:outline-none flex items-center justify-center"
                        >
                            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="mr-2" />
                            Sign up with Google
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account? <a href="sign-in" className="text-green-500 hover:underline">Login Here</a>
                        </p>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-xs text-gray-400">
                            © 2024 NativeTalk Technologies. All rights reserved. <a href="#" className="text-gray-400 hover:underline">Terms & Conditions</a> <a href="#" className="text-gray-400 hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
