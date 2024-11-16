"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';


const CustomUrlForm = () => {
    const router = useRouter();
    const { axiosInstance, loading } = useApi();
    const [url, setUrl] = useState('');
    const [isUrlAvailable, setIsUrlAvailable] = useState(true);
    const [userData, setUserData] = useState(null);
    const { handleApiError } = useError();

    const handleChange = (e) => {
        setUrl(e.target.value);
    };

    useEffect(() => {
        const storedData = sessionStorage.getItem('signUpData');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        } 
        else {
            router.push('/auth/sign-up');
        }
    }, [router]);

    const handleSubmit = async () => {
        if (!userData) {
            console.error("User data is missing.");
            return;
        }

        try {
            const response = await axiosInstance.post(
                `/auth/create-account/register/`,
                {
                    ...userData,
                    company_description: 'Voip',
                    company_username: url
                }
            );
            router.push('success');
        } catch (error) {
            handleApiError(error)
        }
    };

    return (
        <div className="flex min-h-screen" style={{ height: '100%', overflow: 'hidden' }}>
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

            <div className="w-1/2 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-md mt-[100px]">
                    <h2 className="text-2xl font-bold mb-2">You're almost there! Let's</h2>
                    <h2 className="text-2xl font-bold mb-2">create a custom URL for you</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-left mb-6">This would serve as your unique username</p>

                    <div className="flex items-center border rounded-lg mb-4 overflow-hidden">
                        <input
                            type="text"
                            value={url}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-none focus:outline-none"
                            placeholder="mycompanyurl"
                        />
                        <span className="px-4 text-gray-600">.nativetalkcrm.com</span>
                        <span className="px-2 text-green-500">{isUrlAvailable ? '✔' : '✖'}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-6">This is just a suggestion, you can change to what you want</p>

                    <button
                        onClick={handleSubmit}
                        className={`w-full py-2 text-white rounded-md ${isUrlAvailable ? 'bg-[#3EBF0F] hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                        disabled={!isUrlAvailable || loading}
                    >
                        Create account
                    </button>
                </div>
                <div style={{ width: 500 }} className="text-xs mt-auto pt-6">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default CustomUrlForm;
