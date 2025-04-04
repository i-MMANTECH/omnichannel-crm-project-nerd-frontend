'use client';

import React, { useState, useMemo } from "react";
import AssignedMessages from "./AssignedMessages";
import WorkSchedule from "./WorkSchedule";
import './UserDetailsStyle.css';
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { getRoleStyle } from "@/utils/getRoleStyle";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

export default function UserDetails({ user }) {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

  const [selected, setSelected] = useState("work-schedule");
  const [previewImage, setPreviewImage] = useState(user?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

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


  const name = useMemo(() => {
    return user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : "--";
  }, [user]);
  

  return (
    <div className="flex justify-center mt-5">
      <div className="flex mb-5 flex-col max-w-[788px] p-8 items-center gap-6 flex-1 rounded-lg border border-gray-300 body-theme">
      <div className="user-top-content flex flex-col md:flex-row justify-between border w-full rounded-lg p-6 gap-4">
        {/* User Profile Section */}
        <div className="relative px-6 py-4 flex flex-col items-center gap-1 h-fit rounded-lg border border-gray-200 body-theme w-full md:w-auto">
          {/*previewImage or User Image or Avatar */}
          <div className="relative">
            {previewImage ? (
              <Image
                className="user-left-image mt-2 w-20 h-20 rounded-full"
                alt="User Preview"
                src={previewImage}
                width={80}
                height={80}
              />
            ) : user?.image ? (
              <Image
                className="user-left-image mt-2 w-10 h-10 rounded-full"
                alt="bio"
                src={user?.image}
                width={50}
                height={50}
              />
            ) : (
              <UserAvatar name={user?.name ? user?.name : "--"} />
            )}

              {/* Change Picture Icon */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="upload-photo"
                onChange={(e) => handleImageUpload(e)}
              />
              <button
                className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600 transition"
                onClick={() => document.getElementById("upload-photo").click()}
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

               {selectedFile  && (
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition w-full"
                  onClick={submitImage}
                >
                  Submit Image
                </button>
              )}

          </div>

              {/* User Details */}
              <p className="user-left-name">{name}</p>
              <p className="user-left-email">{user?.email}</p>

              <div className="flex w-full mt-4 items-center justify-between">
                <p className="py-1 pl-2 pr-2 text-right text-[#40C4AA] -ml-1 font-medium text-[12px] font-normal rounded-sm">
                  {user?.roles?.map((role) => (
                <span key={role.id} className="px-2 py-1 ml-1 rounded" style={getRoleStyle(role.name)}>
                  {role.name}
                </span>
              )) || "--"}

                </p>
                <p className="text-right font-medium text-sm bg-[#F8F9FB] dark:bg-gray-800 px-2 py-1 rounded">
                  Last seen: {user?.last_active || '--'}
                </p>
              </div>
              </div>

            {/* User Details Section */}
            <div className="flex flex-1 justify-start flex-col body-theme w-full">
              <p className="font-medium text-[14px] font-normal text-left">General</p>
              <hr className="w-full h-[1px] bg-[#DFE1E6] mt-2" />

              <div className="flex items-center justify-between mt-2">
                <p className="font-medium text-[14px] font-normal text-left">Name</p>
                <p className="user-left-name">{name}</p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="font-medium text-[14px] font-normal text-left">Role</p>
                <p className="user-left-name -ml-1">
                  {user?.roles.map((role) => (
                    <span key={role.id} className="px-2 py-1 ml-1 rounded" style={getRoleStyle(role.name)}>
                      {role.name}
                    </span>
                  ))}
                </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium text-[14px] font-normal text-left">Email</p>
            <p className="user-left-name">{user?.email || '--'}</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium text-[14px] font-normal text-left">Phone Number</p>
            <p className="user-left-name">{user?.phone_number || '--'}</p>
          </div>

          <p className="mt-5 text-left">Other Information</p>
          <hr className="w-full h-[1px] bg-[#DFE1E6] mt-2" />

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium text-[14px] font-normal text-left">Gender</p>
            <p className="user-left-name">{user?.gender || '--'}</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">DOB</p>
            <p className="user-left-name">{user?.dob || '--'}</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">Country</p>
            <p className="user-left-name">{user?.country || '--'}</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">State</p>
            <p className="user-left-name">{user?.state || '--'}</p>
          </div>
        </div>
      </div>


      <div className="w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-start gap-4 w-full mt-4">
          <p
            className={`cursor-pointer text-sm sm:text-base ${
              selected === "work-schedule" ? "selected" : "not-selected"
            }`}
            onClick={() => setSelected("work-schedule")}
          >
            Work Schedule
          </p>
          <p
            className={`cursor-pointer pb-2 sm:pb-0 px-6 sm:px-10 text-sm sm:text-base ${
              selected === "assigned-messages" ? "selected" : "not-selected"
            }`}
            onClick={() => setSelected("assigned-messages")}
          >
            Assigned Messages
          </p>
        </div>

        {/* Content Section */}
        <div className="mt-6 w-full">
          {selected === "work-schedule" && <WorkSchedule />}
          {selected === "assigned-messages" && (
            <div className="text-center text-gray-500 text-sm sm:text-base">
              Agent has no assigned messages
            </div>
          )}
        </div>
      </div>

      </div>
    </div>
  );
}


