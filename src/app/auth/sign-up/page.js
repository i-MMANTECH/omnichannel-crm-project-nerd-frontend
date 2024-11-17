"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { AuthContext } from '../../../context/AuthContext';
import Footer from '@/app/components/Footer';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { toast } from 'react-toastify';

const SignUp = () => {
    const router = useRouter();
    const { axiosInstance, loading } = useApi();
    const [company_name, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const { user } = useContext(AuthContext);
    const { handleApiError } = useError();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleSignUp = async (event) => {
        event.preventDefault();
    
        if (!company_name || !email || !phone_number) {
            toast.dark(errorMessage);
            return;
        }
        
        try {
            const response = await axiosInstance.post('/auth/create-account/send-otp/', 
            {
                email
            });
            
            sessionStorage.setItem('signUpData', JSON.stringify({ company_name, email, phone_number }));
            sessionStorage.setItem(
                'signUpData',
                JSON.stringify({ company_name, email, phone_number })
            );

            router.push("sign-up/verify-otp");
        } catch (error) {
            handleApiError(error);
        } 
    };
    

    const allFieldsFilled = company_name && email && phone_number;

    return (
        <div className="flex" style={{ height: "100%" }}>
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

        <div className="w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 text-left mb-3">Manage your employees easily! </h2>
                <p className="text-gray-500 text-left mb-6">Enter your details to login!</p>
                
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
                            onChange={(e) => setCompanyName(e.target.value)}
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

                    <button
                        type="submit"
                        className={`w-full text-white py-2 rounded-md focus:outline-none ${allFieldsFilled ? 'bg-[#3EBF0F] hover:bg-green-700' : 'bg-[#EEEFF2]'}`}
                        disabled={!allFieldsFilled || loading}
                    >
                        {loading ? "Processing..." : "Continue"}
                    </button>
                </form>

                 <div className="text-left mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account? <a href="/auth/sign-in" className="text-[#3EBF0F] hover:underline">Login Here</a>
                    </p>
                </div>
                <div style={{ width: 500, marginBottom: -90 }} className="text-xs mt-6 pt-6">
                <Footer />
                </div>
            </div>
        </div>
    </div>

    );
};

export default SignUp;
