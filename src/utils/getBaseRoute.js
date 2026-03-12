export default function getBaseRoute(userRoles) {
    const isAdmin = userRoles?.includes("Admin") || userRoles?.includes("admin");
    return isAdmin ? '/admin' : '/nativecrm';
}