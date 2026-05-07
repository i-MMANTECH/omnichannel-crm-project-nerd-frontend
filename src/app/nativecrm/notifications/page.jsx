"use client";

import React, { useEffect } from 'react';
import Notifications from '@/app/components/Notification/Notifications';

const Page = () => {   
     useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="h-screen flex flex-row px-3 sm:px-6 lg:px-10 m-3 sm:m-6 lg:m-10">
            <div className="flex-1 overflow-y-auto">
                <Notifications />
            </div>
        </div>
    );
};

export default Page;
