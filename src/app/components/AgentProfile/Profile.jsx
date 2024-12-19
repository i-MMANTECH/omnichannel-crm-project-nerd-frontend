import React, {useState} from 'react';
import AgentGeneral from './AgentGeneral';
import AgentNotification from './AgentNotification';
import AgentActivityLog from './AgentActivityLog';
import AgentSecuritySettings from './AgentSecuritySettings';
import './agentProfile.css';
import UserAvatar from '../UserAvatar';
import Image from 'next/image';


export default function Profile() {
    const [selected, setSelected] = useState("general");

    const userProfile = {
        name: "Pristia Candra",
        email: "Prista@gmail.com",
        phone: "089318298493",
        website: "fueledbyramenco.nativetalkcrm.com",
        role: "Admin",
        lastLogin: "Oct 23, 2022",
        profileImage: ""
    };

    return (
        <div className="flex justify-center my-5 gap-2">
            <div className="flex flex-col items-center gap-6 w-[300px]  p-6 rounded-lg border border-[#DFE1E6]  h-[500px] overflow-y-auto">
                {userProfile.profileImage ? (
                    <Image
                        src={userProfile.profileImage}
                        alt="User Profile"                        
                        className="w-[100px] rounded-full object-cover" 
                        width={70}
                        height={70}
                    />
                ) : (
                    <UserAvatar
                    name={userProfile.name}
                    width="w-20"
                    height="h-20"
                    />
                )}    
                <p className="text-center text-xl font-bold self-stretch">
                    {userProfile.name}
                </p>
                <div className="flex justify-center items-center gap-1 text-right text-[#F36F4A] w-auto p-[2px_8px] rounded-md bg-[#FEF1ED] text-[12px] font-medium leading-[1.5] tracking-[0.4px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="4"
                        height="4"
                        viewBox="0 0 4 4"
                        fill="none"
                        className="flex-shrink-0 fill-[#F36F4A]"
                    >
                        <circle cx="2" cy="2" r="2" fill="#F36F4A" />
                    </svg>
                    {userProfile.role}
                </div>
                <p className=" text-center text-sm ">
                    {userProfile.website}
                </p>
                <div className="flex h-[1px] items-center self-stretch bg-[#DFE1E6]"></div>

                <div style={{ marginLeft: "-90px" }} className="flex flex-col gap-3">
                    <div className="flex items-center gap-[10px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="flex-shrink-0 w-[24px] h-[24px]"
                        >
                            <path
                                d="M6 8L10.2111 10.1056C11.3373 10.6686 12.6627 10.6686 13.7889 10.1056L18 8M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z"
                                stroke="#666D80"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="text-sm font-medium">
                            {userProfile.email}
                        </p>
                    </div>

                    <div className="flex items-center gap-[10px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-[24px] h-[24px]"
                        >
                            <path
                                d="M11.7925 14.742L9.25195 12.2057C8.43422 11.3893 8.43422 10.0657 9.25195 9.24935C9.98275 8.51977 10.071 7.36701 9.45987 6.53498L7.37385 3.69514C6.75631 2.85444 5.53346 2.76108 4.79506 3.49826C3.67086 4.62058 2.91814 6.10588 3.00713 7.6906C3.44184 15.4326 9.49836 20.6079 16.3476 20.993C17.9183 21.0813 19.3811 20.3229 20.4935 19.2123C21.2429 18.4642 21.148 17.2252 20.2933 16.5995L17.4726 14.5344C16.6392 13.9242 15.4845 14.0124 14.7537 14.742C13.936 15.5583 12.6102 15.5583 11.7925 14.742Z"
                                stroke="#666D80"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <p className="text-sm font-medium">
                            {userProfile.phone}
                        </p>
                    </div>

                    <div className="flex items-center gap-[10px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path 
                                d="M8 3H6C4.34315 3 3 4.34315 3 6V9M8 3V2M8 3H16M8 3V4M16 3H18C19.6569 3 21 4.34315 21 6V9M16 3V2M16 3V4M3 9V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9M3 9H21M13.5 12.5H16.5L14 17.5M10.5 14V16C10.5 16.8284 9.82843 17.5 9 17.5C8.17157 17.5 7.5 16.8284 7.5 16V14C7.5 13.1716 8.17157 12.5 9 12.5C9.82843 12.5 10.5 13.1716 10.5 14Z" 
                                stroke="#666D80" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>

                        <p className="text-sm font-medium">
                            {userProfile.lastLogin}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-selected gap-6 p-6 flex-[1_0_0] rounded-lg border border-[#DFE1E6] ">
                <div className='flex gap-6'>
                    <p
                        className={`h-[30px] cursor-pointer ${selected === "general" ? "selected" : "not-selected"}`}
                        onClick={() => setSelected("general")}
                        aria-selected={selected === "general"}
                        >
                        General
                    </p>

                    <p
                        className={`h-[30px] cursor-pointer ${selected === "notification" ? "selected" : "not-selected"}`}
                        onClick={() => setSelected("notification")}
                    >
                        Notification
                    </p>
                    <p
                        className={`h-[30px] cursor-pointer ${selected === "activity-log" ? "selected" : "not-selected"}`}
                        onClick={() => setSelected("activity-log")}
                    >
                        Activity log
                    </p>
                    <p
                        className={`h-[30px] cursor-pointer ${selected === "security-settings" ? "selected" : "not-selected"}`}
                        onClick={() => setSelected("security-settings")}
                    >
                        Security settings
                    </p>
                </div>

                {selected === "general" && <AgentGeneral />}
                {selected === "notification" && <AgentNotification />}
                {selected === "activity-log" && <AgentActivityLog />}
                {selected === "security-settings" && <AgentSecuritySettings />}
            </div>
        </div>
    )
}
