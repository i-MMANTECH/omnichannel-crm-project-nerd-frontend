"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CustomUrlForm = () => {
    const router = useRouter();
    const [url, setUrl] = useState('Fueledbyramenco');
    const [isUrlAvailable, setIsUrlAvailable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [errorMessages, setErrorMessages] = useState({});

    const handleChange = (e) => {
        setUrl(e.target.value);
    };

    useEffect(() => {
        const storedData = sessionStorage.getItem('signUpData');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        } else {
            router.push('/auth/sign-up');
        }
    }, []);

    useEffect(() => {
        const storedData = sessionStorage.getItem('signUpData');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }, []);

    const handleSubmit = async () => {
        if (!userData) {
            console.error("User data is missing.");
            return;
        }

        setIsLoading(true);
        setErrorMessages({});

        try {
            const response = await axios.post(
                `http://staging.core.nativetalkcrm.com/api/auth/create-account/register/`,
                {
                    ...userData,
                    company_description: 'Voip',
                    company_username: url
                }
            );
            router.push('/success-page');
        } catch (error) {

            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessages(error.response.data.error);
            } else {
                setErrorMessages({ general: "An unexpected error occurred. Please try again later." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100" style={{ height: '100vh' }}>
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

            <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">You're almost there! Let's</h2>
                <h2 className="text-2xl font-bold mb-2">create a custom URL for you</h2>
                <p className="text-gray-600 mb-8">This would serve as your unique username</p>

                <div className="flex items-center border rounded-lg mb-4 overflow-hidden">
                    <input
                        type="text"
                        value={url}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-none focus:outline-none"
                        placeholder="Your URL"
                    />
                    <span className="px-4 bg-gray-200 text-gray-600">.nativetalkcrm.com</span>
                    <span className="px-2 text-green-500">{isUrlAvailable ? '✔' : '✖'}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">This is just a suggestion, you can change to what you want</p>

                {Object.keys(errorMessages).length > 0 && (
                    <div className="mb-4 text-red-500">
                        {Object.entries(errorMessages).map(([field, messages], index) => (
                            <p key={index}>
                                <strong>{field.replace(/_/g, ' ')}:</strong> {messages.join(', ')}
                            </p>
                        ))}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    className={`w-full py-2 text-white rounded-md ${isUrlAvailable ? 'bg-[#3EBF0F] hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    disabled={!isUrlAvailable || isLoading}
                >
                    {isLoading ? 'Creating account...' : 'Create account'}
                </button>

                <div className="text-center mt-8">
                    <p className="text-xs text-gray-400">
                        © 2024 NativeTalk Technologies. All rights reserved.
                        <a href="#" className="text-gray-400 hover:underline ml-2">Terms & Conditions</a>
                        <a href="#" className="text-gray-400 hover:underline ml-2">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomUrlForm;
