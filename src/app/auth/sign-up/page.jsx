"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { AuthContext } from '@/context/AuthContext';
import Footer from '@/app/components/Footer';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';


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
        <div className="flex min-h-screen flex-col overflow-y-auto lg:flex-row">
            <div className="hidden flex-col md:flex md:min-h-[360px] md:w-full lg:min-h-screen lg:w-1/2">
                <div className="min-h-[220px] flex-grow lg:min-h-0">
                    <img
                        src="/assets/sign-up-home-screen-image.png"
                        alt="Create Password"
                        className="h-full min-h-[220px] w-full object-cover lg:min-h-0"
                    />
                </div>
                <div style={{ height: '4px', backgroundColor: '#3EBF0F' }}></div>
                <div className="flex flex-col items-start bg-black p-5 text-white sm:p-6 lg:p-8">
                    <img src='/assets/logo.png' alt="Logo" />
                    <h2 className="mt-4 text-2xl font-bold leading-tight text-white lg:text-3xl">
                        Let's empower your <br /> employees today.
                    </h2>
                    <p className="text-white mt-2">Transform every conversation into opportunity.</p>
                </div>
            </div>

            <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 sm:px-6 md:min-h-0 lg:min-h-screen lg:w-1/2 lg:p-8">
                <div className="w-full max-w-md lg:mt-[100px]">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-left mb-2">Manage your employees easily! </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-left mb-6">Get started for free today!</p>

                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="company_name"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:py-2 sm:text-sm"
                                placeholder="Company Name"
                                value={company_name}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">

                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Work Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:py-2 sm:text-sm"
                                placeholder="example@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <PhoneInput
                                country={'ng'}
                                value={phone_number}
                                onChange={setPhoneNumber}
                                inputClass="custom-phone-input mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:py-2 sm:text-sm"
                                containerClass="custom-phone-container w-full"
                                placeholder="(123) 456-7890"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full rounded-md py-2.5 text-white focus:outline-none sm:py-2 ${allFieldsFilled ? 'bg-[#3EBF0F] hover:bg-green-700' : 'bg-[#EEEFF2]'}`}
                            disabled={!allFieldsFilled || loading}
                        >
                            {loading ? "Processing..." : "Continue"}
                        </button>
                    </form>

                    <div className="text-left mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account? <Link href="/auth/sign-in" className="text-[#3EBF0F] hover:underline">Login Here</Link>
                        </p>
                    </div>
                </div>
                <div className="mt-auto w-full max-w-[500px] pt-6 text-xs">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
