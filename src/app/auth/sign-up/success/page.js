"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Footer from '../../../components/Footer';

const SuccessPage = () => {
    const router = useRouter();
    const { axiosInstance, loading } = useApi();
    const { handleApiError } = useError();
    const [userData, setUserData] = useState(null);
    const { user, login } = useContext(AuthContext);

    useEffect(() => {
        if (userData) {
            signUserIn();
        }
    }, [userData])

    const signUserIn = async () => {
        try {
            const response = await axiosInstance.post('/auth/signin/', {
                email: userData.email,
                password: userData.password,
            });
            login(response.data);
            router.push('/');
        } catch (error) {
            handleApiError(error);
            router.push('/');
        }
    };


    const handleGoToDashboard = () => {
        const storedData = sessionStorage.getItem('signUpData');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }  else {
            router.push('/');
        }
    };
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="mb-8">
                <img src={'../../assets/logo.png'} alt="Native Talk Logo" className="h-8" />
            </div>

            <div className="relative top-7 mt-2">
                <img src={'../../assets/checkmark.png'} alt="Success Checkmark" className="" />
            </div>

            <h2 className="text-3xl font-bold text-black dark:text-white leading-tight mb-2">Success!</h2>            
            <p className="text-gray-500 dark:text-gray-400 mb-8">You have successfully created your account</p>

            <button
                onClick={handleGoToDashboard}
                className="bg-[#3EBF0F] hover:bg-green-600 text-white py-2 px-6 rounded-full shadow-lg"
            >
                Go to dashboard
            </button>

            <div className="absolute bottom-4 text-center">
                <Footer />
            </div>
        </div>
    );
};

export default SuccessPage;
