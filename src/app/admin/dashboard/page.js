"use client";

import React, { useEffect, useState } from 'react';
import Dashboard from '@/app/components/admin/Dashboard/Dashboard';

const Page = () => {    
    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">      
            <div className='relative body-theme flex-1 flex flex-col '>    
                <Dashboard />
            </div>
        </div>
    );
};

export default Page;
