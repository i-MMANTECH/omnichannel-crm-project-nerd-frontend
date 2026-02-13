import getBaseRoute from './getBaseRoute';

/**
 * Build a complete route path with the correct portal prefix based on user roles
 * This uses the existing getBaseRoute function to determine the portal
 * 
 * @param {Array} userRoles - Array of user roles from auth context
 * @param {string} route - The route path (without leading slash)
 * @returns {string} - Complete route with portal prefix
 * 
 * @example
 * buildPortalRoute(['Admin'], 'customers') // returns '/admin/customers'
 * buildPortalRoute(['Agent'], 'customers') // returns '/nativecrm/customers'
 * buildPortalRoute(['Admin'], 'messages?chat=customers&id=123') // returns '/admin/messages?chat=customers&id=123'
 */
export const buildPortalRoute = (userRoles, route) => {
    const baseRoute = getBaseRoute(userRoles);
    // Remove leading slash if present
    const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
    return `${baseRoute}/${cleanRoute}`;
};

/**
 * Get the current portal based on user roles
 * 
 * @param {Array} userRoles - Array of user roles from auth context
 * @returns {string} - The portal name ('admin' or 'nativecrm')
 * 
 * @example
 * getCurrentPortal(['Admin']) // returns 'admin'
 * getCurrentPortal(['Agent']) // returns 'nativecrm'
 */
export const getCurrentPortal = (userRoles) => {
    const isAdmin = userRoles?.includes("Admin") || userRoles?.includes("admin");
    return isAdmin ? 'admin' : 'nativecrm';
};