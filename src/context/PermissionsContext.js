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
  
  const [permissions, setPermissions] = useState(null);

  // ✅ Load permissions from localStorage when component mounts
  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    } else {
      setPermissions([]);
    }
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) return;

      try {
        const response = await axiosInstance.get('/users/me');

        if (response?.data?.success) {
          const userPermissions = response.data.user.roles.flatMap(role => role.permissions);
          setPermissions(userPermissions);

          // ✅ Store in localStorage
          localStorage.setItem('permissions', JSON.stringify(userPermissions));
        }
      } catch (err) {
        handleApiError(err);
      }
    };

    fetchPermissions();
  }, [user]);

  const contextValue = useMemo(() => ({
    permissions,
    checkPermission: (permission) => permissions.some(perm => perm.codename === permission),
  }), [permissions]);

  if (permissions === null) {
    return  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-400"></div>
</div>;
  }

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
};
