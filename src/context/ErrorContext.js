"use client";

import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState('');

    const handleApiError = (error) => {
        const errorData = error?.response?.data?.error;

        if (errorData && typeof errorData === 'object') {
            for (let field in errorData) {
                if (errorData.hasOwnProperty(field)) {
                    const fieldErrors = errorData[field];
                    fieldErrors.forEach((msg) => {
                        toast.error(`${msg}`);
                    });
                }
            }
        } else {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            setError(errorMessage);
        }

        console.error("API Error:", error);
    };

    return (
        <ErrorContext.Provider value={{ error, setError, handleApiError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);
