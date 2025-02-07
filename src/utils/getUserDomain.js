'use client'

export const getUserDomain = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');

        // Check for localhost (development environment)
        if (hostname.includes('localhost')) {
            return process.env.NEXT_PUBLIC_USER_DOMAIN || 'codex-r';
        }

        // Check for staging environment
        if (parts.length === 4 && parts[1] === 'staging' && parts[2] === 'nativetalkcrm' && parts[3] === 'com') {
            return parts[0];
        } 

        // Check for production environment
        else if (parts.length === 3 && parts[1] === 'nativetalkcrm' && parts[2] === 'com') {
            return parts[0];
        }
    }
    return ''; 
};
  
