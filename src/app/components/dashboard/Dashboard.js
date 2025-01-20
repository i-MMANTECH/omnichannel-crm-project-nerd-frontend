"use client";

import React, {useState} from 'react';
import './style.css';
import ProgessBar from './ProgessBar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import StatsCard from './StatsCard';
import './style.css';
import ChatData from './ChatData';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [isRotating, setIsRotating] = useState(false);

    const handleRefreshClick = async () => {
        setIsRotating(true);

        // Simulate an API call
        await new Promise(resolve => setTimeout(resolve, 3000));

        setIsRotating(false);
    };
    

  return (
    <div className="ms-10 me-">
        <div className="flex justify-between">
            <div className="flex h-[40px] w-[250px] p-[8px_12px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
  
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.33333 2.00016H4C2.89543 2.00016 2 2.89559 2 4.00016V6.00016M5.33333 2.00016V1.3335M5.33333 2.00016H10.6667M5.33333 2.00016V2.66683M10.6667 2.00016H12C13.1046 2.00016 14 2.89559 14 4.00016V6.00016M10.6667 2.00016V1.3335M10.6667 2.00016V2.66683M2 6.00016V12.6668C2 13.7714 2.89543 14.6668 4 14.6668H12C13.1046 14.6668 14 13.7714 14 12.6668V6.00016M2 6.00016H14" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round"/>
                </svg>

                
                <span className="text-center font-[500] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
                    Last updated: Oct 20, 2024
                </span>

                
                <svg
                    className={`cursor-pointer ${isRotating ? 'rotate' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    onClick={handleRefreshClick}
                >
                    <path d="M7.99984 2.66683C5.05432 2.66683 2.6665 5.05464 2.6665 8.00016C2.6665 9.97425 3.73903 11.6978 5.33317 12.62M7.99984 2.66683L6.6665 1.3335M7.99984 2.66683L6.99984 4.3335M7.99984 13.3335C10.9454 13.3335 13.3332 10.9457 13.3332 8.00016C13.3332 6.02608 12.2606 4.30249 10.6665 3.38033M7.99984 13.3335L9.33317 14.6668M7.99984 13.3335L8.99984 11.6668" stroke="#3EBF0F" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            
            <div className="flex h-[40px] p-[8px_12px_8px_14px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] bg-white shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z" stroke="#808897" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <span className="text-[#666D80] text-center font-[500] text-[14px] font-[Encode Sans] leading-[150%] tracking-[0.2px]">
                    Filter
                </span>
             </div>
        </div>

        <StatsCard/>
        <ProgessBar />
        <ChatData/>
    </div>
  );
};

export default Dashboard;
