import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { buildPortalRoute } from '@/utils/portalUtils';

/**
 * Custom hook for portal-aware routing
 * Provides navigation functions that automatically use the correct portal based on user role
 * 
 * @returns {Object} - Object containing portal navigation utilities
 * 
 * @example
 * const { navigateTo, buildRoute } = usePortalRouter();
 * 
 * // Navigate to messages
 * navigateTo('messages?chat=customers&id=123');
 * 
 * // Build route without navigating
 * const route = buildRoute('customers/456');
 */
export const usePortalRouter = () => {
    const router = useRouter();
    const { user } = useAuth();
    const userRoles = user?.roles || [];

    /**
     * Navigate to a route with the correct portal prefix
     * @param {string} route - The target route
     * @param {Object} options - Next.js router options (optional)
     */
    const navigateTo = (route, options = {}) => {
        const fullRoute = buildPortalRoute(userRoles, route);
        router.push(fullRoute, options);
    };

    /**
     * Build a route with the correct portal prefix without navigating
     * @param {string} route - The target route
     * @returns {string} - Complete route with portal prefix
     */
    const buildRoute = (route) => {
        return buildPortalRoute(userRoles, route);
    };

    /**
     * Navigate back
     */
    const goBack = () => {
        router.back();
    };

    /**
     * Replace current route
     * @param {string} route - The target route
     * @param {Object} options - Next.js router options (optional)
     */
    const replaceTo = (route, options = {}) => {
        const fullRoute = buildPortalRoute(userRoles, route);
        router.replace(fullRoute, options);
    };

    return {
        navigateTo,
        buildRoute,
        goBack,
        replaceTo,
        router, // Expose original router for advanced use
    };
};