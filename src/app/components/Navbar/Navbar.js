'use client';

import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import chevronLeft from '/public/assets/chevron-left.svg';
import Image from 'next/image';
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
        <div className="hidden md:flex fixed top-[-3px] left-0 right-0 ml-[200px] body-theme pr-8 pl-10 py-7 z-10 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-2 relative top-2 ">
                {/* {showBackButton && (
                    <Image
                        src={chevronLeft}
                        className="bg-white rounded-lg border border-[#DFE1E6] p-2 cursor-pointer"
                        onClick={goBack}
                        width={30}
                        height={30}
                        alt="back"
                    />
                )} */}
                <h1 className="text-xl font-bold ml-2 ">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <FaBell
                    className="text-gray-600 cursor-pointer"
                    onClick={toggleNotification}
                />
            </div>
        </div>
    );
};

export default Navbar;
