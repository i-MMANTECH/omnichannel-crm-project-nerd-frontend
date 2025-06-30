"use client";

import React from 'react';
import { Messages } from '../../components/Message/Messages';

const Page = () => {

    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">      
            <div className='relative body-theme flex-1 flex flex-col '>    
                <Messages />
            </div>
        </div>
    );
};

export default Page;
