'use client';

import React, { useEffect, useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import chevronLeft from '/public/assets/chevron-left.svg';
import Image from 'next/image';
import { useNotification } from '@/context/NotificationContext';

const Navbar = ({ searchPlaceholder, onSearch }) => {
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
        <div style={{zIndex:9999 }} className="fixed top-0 right-0 w-10/12 pr-10 body-theme px-4 py-5 z-10 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {showBackButton && (
                    <Image
                        src={chevronLeft}
                        className="bg-white rounded-lg border border-[#DFE1E6] p-2 cursor-pointer"
                        onClick={goBack}
                        width={35}
                        height={35}
                    />
                )}
                <h1 className="text-xl font-bold ml-2">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="border rounded-lg pl-10 pr-4 py-2 focus:outline-none w-64"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <FaBell
                    className="text-gray-600 cursor-pointer"
                    onClick={toggleNotification}
                />
            </div>
        </div>
    );
};

export default Navbar;
