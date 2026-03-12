import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <div className="text-center mt-auto">
            <p className="text-xs text-gray-400">
                © 2024 NativeTalk Technologies. All rights reserved. <Link href="/legal/terms-and-conditions" >Terms & Conditions</Link> | <Link href="/legal/privacy-policy">Privacy Policy</Link>
            </p>
        </div>
    );
};

export default Footer;
