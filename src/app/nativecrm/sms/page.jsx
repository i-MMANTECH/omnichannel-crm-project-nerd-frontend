"use client";

import React from 'react';
import Sms from '@/app/components/Sms/Sms';

const Page = () => {
    return (
        <div className="flex flex-row body-theme px-10 min-h-[83vh]">      
            <div className='relative body-theme flex-1 flex flex-col '>     
                <Sms/>
            </div>
        </div>
    );
};

export default Page;
