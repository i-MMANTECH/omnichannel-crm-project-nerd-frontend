"use client";

import React from 'react';
import { Messages } from '../../components/Message/Messages';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const Page = () => {

    return (
        <ProtectedRoute requiredPermission="view_message">
            <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">      
                <div className='relative body-theme flex-1 flex flex-col '>    
                    <Messages />
                </div>
            </div>
        </ProtectedRoute>
        
    );
};

export default Page;
