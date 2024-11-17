export const getUserDomain = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
        return process.env.NEXT_PUBLIC_USER_DOMAIN || 'Fueledbyramenco';
    }
    const subdomain = hostname.split('.')[0];
    return subdomain;
};
