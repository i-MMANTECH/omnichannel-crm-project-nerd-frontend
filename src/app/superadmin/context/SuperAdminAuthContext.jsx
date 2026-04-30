'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SuperAdminAuthContext = createContext();

export const SuperAdminAuthProvider = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('superadmin_user');
      if (stored) {
        try {
          setSuperAdmin(JSON.parse(stored));
        } catch {
          localStorage.removeItem('superadmin_user');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    // Response: { success, access, refresh, user_id, email, full_name }
    const userData = {
      access: data.access,
      refresh: data.refresh,
      user_id: data.user_id,
      email: data.email,
      full_name: data.full_name,
    };
    localStorage.setItem('superadmin_user', JSON.stringify(userData));
    setSuperAdmin(userData);
  };

  const logout = () => {
    localStorage.removeItem('superadmin_user');
    setSuperAdmin(null);
    router.push('/superadmin/login');
  };

  return (
    <SuperAdminAuthContext.Provider value={{ superAdmin, loading, login, logout }}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
};

export const useSuperAdminAuth = () => useContext(SuperAdminAuthContext);
