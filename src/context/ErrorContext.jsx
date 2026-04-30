"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState('');
    const { logout } = useAuth;

    const handleApiError = useCallback((error) => {
        console.error("API Error:", error);
        const errorData = error?.response?.data?.error;

        if (errorData && typeof errorData === 'object') {
            for (let field in errorData) {
                if (errorData.hasOwnProperty(field)) {
                    const fieldErrors = errorData[field];
                    fieldErrors.forEach((msg) => {
                        toast.error(`${field} ${msg}`);
                        return;
                    });
                }
            }
        } else {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.errors?.email[0] || "request failed";
            toast.error(errorMessage);
            setError(errorMessage);
            return
        }
    }, []);

    const value = useMemo(
        () => ({ error, setError, handleApiError }),
        [error, handleApiError]
    );

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);
