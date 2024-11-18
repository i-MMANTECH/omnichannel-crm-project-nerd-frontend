export const getUserDomain = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
        return process.env.NEXT_PUBLIC_USER_DOMAIN || 'codex-r';
    }
    const subdomain = hostname.split('.')[0];
    return subdomain;
};
