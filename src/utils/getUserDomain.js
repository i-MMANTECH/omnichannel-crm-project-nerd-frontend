export const getUserDomain = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('localhost')) {
            return process.env.NEXT_PUBLIC_USER_DOMAIN || 'join';
        }
        const subdomain = hostname.split('.')[0];
        return subdomain;
    }
    return '';
};
