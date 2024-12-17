"use client";

import React, {useState } from 'react';
import Task from '../../components/Task/Task';

const Page = () => {
    return (
        <div className="flex flex-row body-theme px-10 min-h-[83vh]">      
            <div className='relative body-theme flex-1 flex flex-col '>     
                <Task />
            </div>
        </div>
    );
};

export default Page;
