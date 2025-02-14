'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useApi } from '@/services/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import { useError } from '@/context/ErrorContext';

const PermissionsContext = createContext();

export const usePermissions = () => {
  return useContext(PermissionsContext);
};

export const PermissionsProvider = ({ children }) => {
  const { axiosInstance } = useApi();
  const { user } = useAuth();
  const { handleApiError } = useError();
  const [permissions, setPermissions] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem('permissions')) || [];
    }
    return [];
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) return;

      try {
        const response = await axiosInstance.get('/users/me');

        if (response.data.success) {
          const userPermissions = response.data.user.roles.flatMap(role => role.permissions);
          setPermissions(userPermissions);
          localStorage.setItem('permissions', JSON.stringify(userPermissions));
        }
      } catch (err) {
        handleApiError(err);
      }
    };

    fetchPermissions();
  }, [user]);

  const contextValue = useMemo(() => permissions, [permissions]);

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
};
