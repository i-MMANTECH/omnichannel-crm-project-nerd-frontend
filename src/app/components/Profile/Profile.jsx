import React, {useEffect, useMemo, useRef, useState} from 'react';
import General from './General';
import Notification from './Notification';
import ActivityLog from './ActivityLog';
import SecuritySettings from './SecuritySettings/SecuritySettings';
import './agentProfile.css';
import UserAvatar from '../UserAvatar';
import Image from 'next/image';
import { useApi } from '@/services/axiosConfig';
import { useError } from '@/context/ErrorContext';
import { getRoleStyle } from '@/utils/getRoleStyle';
import { formatDateTime } from '@/utils/timeUtils';


export default function Profile() {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const [userProfile, setUserProfile] = useState({})
    const [previewImage, setPreviewImage] = useState(userProfile?.image || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState("general");
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUserProfile()
    }, []);

    const fetchUserProfile = async () => {
        try {
            const resp = await axiosInstance.get(`/users/me`)
            setUserProfile(resp.data.user)
        } catch(error) {
            handleApiError(error)
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };
    
      const submitImage = async () => {
        if (!selectedFile) return;
    
        setLoading(true);
        const formData = new FormData();
        formData.append("image", selectedFile);
    
        try {
            const response = await axiosInstance.put("/users/me/update/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            if (response.status === 200) {
                const data = response.data;
                setPreviewImage(data.image);
                setSelectedFile(null)
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col md:flex-row justify-center my-5 gap-4 p-4 ">
            <div className="flex flex-col items-center p-5 rounded-lg border border-gray-300 w-full md:w-1/3 lg:w-1/4 shadow-md">
            <div className='relative px-6 py-4 flex flex-col items-center gap-1 h-fit rounded-lg body-theme w-full md:w-auto'>
                {/* Profile Image Section */}
                <div className="relative pb-8 flex flex-col items-center gap-3">
                    <div className="relative w-20 h-20">
                        {previewImage ? (
                        <Image
                            src={previewImage}
                            alt="User Profile"
                            width={100}
                            height={100}
                            className="rounded-full w-20 h-20"
                        />
                        ) : userProfile?.image ? (
                        <Image
                            src={userProfile.image}
                            alt="User Profile"
                            width={100}
                            height={100}
                            className="rounded-full w-20 h-20"
                        />
                        ) : (
                        <UserAvatar
                            name={
                            userProfile?.first_name
                                ? `${userProfile.first_name} ${userProfile?.last_name || ''}`
                                : userProfile?.email || '--'
                            }
                            className="w-20 h-20 rounded-full profile-icon cursor-pointer flex-shrink-0"
                            width="w-20"
                            height="h-20"
                        />
                        )}

                        {/* Cancel Icon */}
                        {previewImage && (
                        <button
                            onClick={() => {
                            setPreviewImage(null);
                            setSelectedFile(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full hover:bg-red-500 transition"
                            title="Cancel"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                            </svg>
                        </button>
                        )}

                        {/* Upload Icon (overlay on bottom-right of image) */}
                        <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="upload-photo"
                        ref={fileInputRef}
                        onChange={(e) => handleImageUpload(e)}
                        />
                        <button
                        className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600 transition"
                        onClick={() => document.getElementById('upload-photo').click()}
                        title="Upload new photo"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232a2.828 2.828 0 0 1 4 4L7 21H3v-4L15.232 5.232z"
                            />
                        </svg>
                        </button>
                    </div>

                    {selectedFile && (
                        <button
                        className="bg-[#3EBF0F] text-white text-sm px-3 py-1 rounded-md hover:bg-[#34a40d] transition w-full"
                        onClick={submitImage}
                        >
                        Submit
                        </button>
                    )}
                </div>

                <p className="text-center text-xl font-bold self-stretch mt-3 truncate">
                    {userProfile?.first_name ? 
                        `${userProfile.first_name} ${userProfile?.last_name}` : 
                        userProfile?.email || '--'
                    }
                </p>

                <div className="flex justify-center items-center gap-1 text-right admin w-auto p-[2px_8px] rounded-md text-sm font-medium">
                    {userProfile?.roles?.map((role) => (
                        <span
                            key={role.id}
                            className="px-2 py-1 rounded"
                            style={getRoleStyle(role.name)}
                        >
                            {role.name}
                        </span>
                    ))}
                </div>

                <p className="text-center text-sm">{userProfile?.url}</p>
            </div>


                <div className="flex h-[1px] items-center self-stretch bg-[#DFE1E6] mt-5 mb-5"></div>

                <div  className="flex flex-col gap-3 items-start w-100 ">
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
                            {userProfile?.email}
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
                            {userProfile?.phone_number}
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
                            {userProfile?.created_at ? formatDateTime(userProfile?.created_at) : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div  className="flex flex-col  flex-1 gap-4 p-6 rounded-lg border border-gray-300 shadow-md ">
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

                {selected === "general" && <General onProfileChanged={fetchUserProfile} />}
                {selected === "notification" && <Notification />}
                {selected === "activity-log" && <ActivityLog />}
                {selected === "security-settings" && <SecuritySettings />}
            </div>
        </div>
    )
}
