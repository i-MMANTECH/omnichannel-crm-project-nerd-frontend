import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isUserAdmin } from '@/utils/maskContactInfo';

/**
 * Custom hook to determine if user can view contact information
 * Admins can view all contact info, non-admins cannot
 */
export const useCanViewContactInfo = () => {
    const { user } = useAuth();

    const canViewContactInfo = useMemo(() => {
        if (!user) return false;

        // Check if user has admin role
        return isUserAdmin(user.roles);
    }, [user]);

    return canViewContactInfo;
};