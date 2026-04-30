'use client';

import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';

const Navbar = () => {
    const path = usePathname();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const { toggleNotification } = useNotification();


    useEffect(() => {
        const pathParts = path.split('/');
        let lastPart = pathParts[pathParts.length - 1];

        if (/\d+$/.test(lastPart)) {
            lastPart = pathParts[pathParts.length - 2];
        }

        const formattedTitle = lastPart
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());

        setTitle(formattedTitle || "Page Title");
    }, [path]);

    const goBack = () => {
        router.back();
    };

    const showBackButton = path.split('/').length > 3;

    return (
        <div className="fixed top-0 left-0 right-0 lg:left-60 body-theme pr-4 sm:pr-6 lg:pr-8 pl-16 sm:pl-6 lg:pl-10 py-4 md:py-5 z-10 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">{title}</h1>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
                <FaBell
                    className="text-gray-600 cursor-pointer"
                    onClick={toggleNotification}
                />
            </div>
        </div>
    );
};

export default Navbar;
