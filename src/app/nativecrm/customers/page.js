"use client";

import React, { useState} from 'react';
import CustomerGrid from '@/app/components/CustomerGrid/CustomerGrid';

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">
            <div className='relative body-theme flex-1 flex flex-col '>  
                <CustomerGrid searchQuery={searchQuery} />
            </div>
        </div>
    );
};
export default Page;
