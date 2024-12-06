"use client";

import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState('');
    const router = useRouter();

    const handleApiError = (error) => {
        console.error("API Error:", error);
        const errorData = error?.response?.data?.error;

        if (error?.response?.status === 401) {
            toast.error("Session expired. Please sign in again.");
            router.push('/auth/sign-in');
            return;
        }

        if (errorData && typeof errorData === 'object') {
            for (let field in errorData) {
                if (errorData.hasOwnProperty(field)) {
                    const fieldErrors = errorData[field];
                    fieldErrors.forEach((msg) => {
                        toast.error(`${msg}`);
                        return;
                    });
                }
            }
        } else {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            setError(errorMessage);
            return
        }
    };

    return (
        <ErrorContext.Provider value={{ error, setError, handleApiError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);
