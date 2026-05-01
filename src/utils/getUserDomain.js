'use client'

export const getUserDomain = () => {
    if (typeof window === 'undefined') return '';

    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Local development: prefer the tenant slug captured during the most
    // recent successful auth. Falls back to the env default for the very
    // first signin on a fresh browser.
    if (hostname.includes('localhost')) {
        const stored = window.localStorage.getItem('userDomain');
        return stored || process.env.NEXT_PUBLIC_USER_DOMAIN || '';
    }

    // Staging: <slug>.staging.nativetalkcrm.com
    if (parts.length === 4 && parts[1] === 'staging' && parts[2] === 'nativetalkcrm' && parts[3] === 'com') {
        return parts[0];
    }

    // Production: <slug>.nativetalkcrm.com
    if (parts.length === 3 && parts[1] === 'nativetalkcrm' && parts[2] === 'com') {
        return parts[0];
    }

    return '';
};
