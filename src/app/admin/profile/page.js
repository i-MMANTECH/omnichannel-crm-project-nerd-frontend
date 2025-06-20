"use client";

import React, { useState} from 'react';
import Profile from '@/app/components/admin/Profile/Profile';

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[65vh]">
            <div className='relative body-theme flex-1 flex flex-col '>  
                <Profile searchQuery={searchQuery} />
            </div>
        </div>
    );
};
export default Page;
