'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [refreshInterval, setRefreshInterval] = useState(null);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login Successful');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        if (refreshInterval) {
            clearInterval(refreshInterval);
            setRefreshInterval(null);
        }
    };

    const refreshToken = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser?.refresh) {
                console.error("No refresh token found");
                return;
            }

            const payload = { refresh: storedUser.refresh };

            const response = await axios.post(
                'http://staging.core.nativetalkcrm.com/api/auth/token/refresh/',
                payload,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.status === 200 && response.data.access && response.data.refresh) {
                const updatedUser = { ...storedUser, access: response.data.access, refresh: response.data.refresh };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                console.error("Failed to refresh token:", response.data);
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
            }
        }

        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };
        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (user && !refreshInterval) {
            refreshToken();
            const interval = setInterval(refreshToken, 300000);
            setRefreshInterval(interval);
            return () => clearInterval(interval);
        }
    }, [user, refreshInterval]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
