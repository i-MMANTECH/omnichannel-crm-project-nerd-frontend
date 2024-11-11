"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        {
            id: 1,
            name: "Mubarak Almustpha",
            profileImage: "../../assets/userprofile1.png",
            lastMessage: "Looking forward to your response.",
            time: "10:00AM",
            avatarIcon: "faInstagram",
            unreadCount: 2,
            messages: [
              { text: "Hello Chioma! How's everything going?", time: "09:10", status: "SENT" },
            ],
          },
    );

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
