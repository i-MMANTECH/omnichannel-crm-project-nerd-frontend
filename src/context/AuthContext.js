'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useApi } from '.././services/axiosConfig';
import NProgress from '@/services/nprogressConfig';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { axiosInstance } = useApi();
    const [company, setCompany] = useState();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const fetchCompanyDetails = async () => {
        try {
            const response = await axiosInstance.get("/companies/details/");
            if (response.data.company) {
                setCompany(response.data.company);
                localStorage.setItem('company', JSON.stringify(response.data.company));
            }
        } catch (error) {
            console.error("Error fetching company details:", error);
        }
    };

    const login = async (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login Successful');

        await fetchCompanyDetails();
        setLoading(false);
        setIsAuthenticated(true);
    };

    const logout = () => {    
        NProgress.setColor('green');
        NProgress.start();
        setUser(null);
        setCompany(null);
        localStorage.removeItem('user');
        localStorage.removeItem('company');
        localStorage.removeItem('permissions');
        setIsAuthenticated(false);
        setLoading(false);
        
        toast.success('Logout successful');
        NProgress.done();
        
        router.push('/auth/sign-in');
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            const storedCompany = localStorage.getItem('company');

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Error parsing user data from localStorage:", error);
                }
            }

            if (storedCompany) {
                try {
                    const parsedCompany = JSON.parse(storedCompany);
                    setCompany(parsedCompany);
                } catch (error) {
                    console.error("Error parsing company data from localStorage:", error);
                }
            }

            const handleStorageChange = () => {
                const storedUser = localStorage.getItem('user');
                const storedCompany = localStorage.getItem('company');
                setUser(storedUser ? JSON.parse(storedUser) : null);
                setCompany(storedCompany ? JSON.parse(storedCompany) : null);
            };

            window.addEventListener('storage', handleStorageChange);
    
            setLoading(false); 

            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, company, login, isAuthenticated, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
