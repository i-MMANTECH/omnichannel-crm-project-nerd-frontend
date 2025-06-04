"use client";

import React from 'react';
import Notifications from '@/app/components/Notification/Notifications';

const Page = () => {    
    return (
        <div className="overflow-x-hidden flex flex-row px-10 m-10">      
            <div className='relative body-theme flex-1 flex flex-col '>    
                <Notifications />
            </div>
        </div>
    );
};

export default Page;
